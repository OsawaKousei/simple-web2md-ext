"""Shared configuration and validation for the SSH Apple build workflow."""

import hashlib
import json
import os
from pathlib import Path
import plistlib
import re
import subprocess
import tarfile

APP_NAME = "WebToMarkdown"
REMOTE_BASE = "web2md-builds"
DEFAULTS = {
    "MAC_HOST": "",
    "TEAM_ID": "GLQCJ8YF9S",
    "BUNDLE_ID": "jp.co.kupac.web2md",
    "EXTENSION_ID": "jp.co.kupac.web2md.SafariExtension",
    "API_KEY_ID": "",
}
LEGACY = {
    "APPSTORE_P12_PASSWORD": "PRELIS_APPSTORE_P12_PASSWORD",
    "INSTALLER_P12_PASSWORD": "PRELIS_APPSTORE_INSTALLER_P12_PASSWORD",
    "GITHUB_P12_PASSWORD": "PRELIS_GITHUB_P12_PASSWORD",
    "API_KEY_ID": "PRELIS_APPSTORE_API_KEY_ID",
    "API_ISSUER_ID": "PRELIS_APPSTORE_API_ISSUER_ID",
}


def read_env(path):
    if not path.exists():
        return {}
    if path.stat().st_mode & 0o077:
        raise ValueError(f"Set permissions to 600: {path}")
    values = {}
    for line in path.read_text().splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = re.fullmatch(r"\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=(.*)", line)
        if not match:
            raise ValueError(f"Invalid environment file syntax: {path}")
        key, value = match.groups()
        value = value.strip()
        if value.startswith(("'", '"')):
            if len(value) < 2 or value[-1] != value[0]:
                raise ValueError(f"Unclosed quote in {path}")
            value = value[1:-1]
        if any(char in value for char in "\r\n\0"):
            raise ValueError(f"Invalid value for {key}")
        values[key] = value
    return values


def configuration(repo):
    legacy = read_env(repo / "ref/macos/.env")
    values = read_env(repo / "app/scripts/macos/.env")
    result = {}
    for key in set(DEFAULTS) | set(LEGACY):
        current = "WEB2MD_" + key
        old = LEGACY.get(key, "")
        result[key] = (os.environ.get(current) or values.get(current)
                       or os.environ.get(old) or legacy.get(old) or DEFAULTS.get(key, ""))
    result["INSTALLER_P12_PASSWORD"] = (result["INSTALLER_P12_PASSWORD"]
                                       or result["APPSTORE_P12_PASSWORD"])
    if not result["MAC_HOST"]:
        raise ValueError("Set WEB2MD_MAC_HOST in scripts/macos/.env or the environment")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+@[A-Za-z0-9_.-]+", result["MAC_HOST"]):
        raise ValueError("Invalid WEB2MD_MAC_HOST")
    if not re.fullmatch(r"[A-Z0-9]{10}", result["TEAM_ID"]):
        raise ValueError("Invalid Team ID")
    for key in ["BUNDLE_ID", "EXTENSION_ID"]:
        if not re.fullmatch(r"[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+", result[key]):
            raise ValueError(f"Invalid {key}")
    if not result["EXTENSION_ID"].startswith(result["BUNDLE_ID"] + "."):
        raise ValueError("Extension ID must start with the containing app ID")
    return result


def run(args, *, cwd=None, env=None, capture=False, secret=False, input_data=None):
    if not secret:
        print("+ " + " ".join(map(str, args)), flush=True)
    proc = subprocess.run(list(map(str, args)), cwd=cwd, env=env, input=input_data,
                          stdout=subprocess.PIPE if capture else None,
                          stderr=subprocess.PIPE if capture else None)
    if proc.returncode:
        if capture and proc.stderr:
            print(proc.stderr.decode(errors="replace"), flush=True)
        # Never include the command arguments here: security import has passwords.
        raise RuntimeError(f"{Path(args[0]).name} failed (exit {proc.returncode})")
    return proc.stdout if capture else None


def digest(path):
    checksum = hashlib.sha256()
    with open(path, "rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            checksum.update(chunk)
    return checksum.hexdigest()


def safe_extract(archive, destination):
    with tarfile.open(archive) as bundle:
        for entry in bundle.getmembers():
            path = Path(entry.name)
            if path.is_absolute() or ".." in path.parts or not (entry.isfile() or entry.isdir()):
                raise ValueError(f"Unsafe archive entry: {entry.name}")
        # Entries above exclude links, devices, absolute paths, and parent traversal.
        bundle.extractall(destination)


def load_profile(path):
    return plistlib.loads(run(["/usr/bin/security", "cms", "-D", "-i", path], capture=True))


def validate_profile(profile, bundle_id, team, platform, certificate_sha1):
    from datetime import datetime, timezone

    entitlements = profile.get("Entitlements", {})
    app_id = entitlements.get("application-identifier", entitlements.get("com.apple.application-identifier"))
    if app_id != f"{team}.{bundle_id}" or profile.get("TeamIdentifier") != [team]:
        raise ValueError(f"Profile App ID / Team mismatch: {profile.get('Name')}")
    if platform not in profile.get("Platform", []):
        raise ValueError("Profile platform mismatch")
    expiry = profile["ExpirationDate"].replace(tzinfo=timezone.utc)
    if expiry <= datetime.now(timezone.utc):
        raise ValueError("Expired provisioning profile")
    if profile.get("ProvisionedDevices") or profile.get("ProvisionsAllDevices") or entitlements.get("get-task-allow"):
        raise ValueError("Expected an App Store distribution profile")
    certificates = [hashlib.sha1(cert).hexdigest().upper() for cert in profile.get("DeveloperCertificates", [])]
    if certificate_sha1.upper() not in certificates:
        raise ValueError("Profile does not match the imported distribution certificate")


def export_options(mode, config, profiles):
    result = {"method": "developer-id" if mode == "github" else "app-store-connect",
              "destination": "export", "teamID": config["TEAM_ID"], "signingStyle": "manual",
              "signingCertificate": "Developer ID Application" if mode == "github" else "Apple Distribution",
              "manageAppVersionAndBuildNumber": False}
    if mode != "github":
        result["provisioningProfiles"] = {
            config["BUNDLE_ID"]: profiles["app"]["Name"],
            config["EXTENSION_ID"]: profiles["extension"]["Name"],
        }
    if mode == "macos":
        result["installerSigningCertificate"] = "3rd Party Mac Developer Installer"
    return result


def write_metadata(output, metadata):
    metadata["artifacts"] = {str(p.relative_to(output)): digest(p)
                             for p in sorted(output.rglob("*"))
                             if p.is_file() and p.suffix in [".pkg", ".ipa", ".zip", ".dmg"]}
    (output / "build-info.json").write_text(json.dumps(metadata, indent=2) + "\n")
    (output / "SHA256SUMS").write_text("".join(f"{sha}  {name}\n" for name, sha in metadata["artifacts"].items()))


def verify_artifacts(output, metadata):
    for name, sha in metadata["artifacts"].items():
        path = Path(name)
        if path.is_absolute() or ".." in path.parts:
            raise ValueError("Invalid artifact path")
        if digest(output / path) != sha:
            raise ValueError(f"Artifact checksum mismatch: {name}")
