#!/usr/bin/env python3
"""Explicit remote upload / notarization actions. Never called by build.py."""

import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time

from common import APP_NAME, run, verify_artifacts, write_metadata

ROOT = Path(__file__).resolve().parents[3]


def notarize(metadata, output, credentials, env):
    final = ROOT / "notarized"
    final.mkdir(exist_ok=True)
    github = {name: sha for name, sha in metadata["artifacts"].items() if name.startswith("github/")}
    if len(github) != 2:
        raise ValueError("This build does not contain GitHub ZIP and DMG artifacts")
    receipt = final / "submissions.json"
    state = json.loads(receipt.read_text()) if receipt.exists() else {}
    for name, checksum in github.items():
        record = state.get(name)
        if record and record["sha256"] != checksum:
            raise ValueError("Notarization receipt belongs to a different artifact")
        if not record:
            result = json.loads(run(["xcrun", "notarytool", "submit", output / name, *credentials,
                                    "--output-format", "json"], capture=True, env=env))
            state[name] = {"id": result["id"], "sha256": checksum}
            receipt.write_text(json.dumps(state, indent=2) + "\n")
        print(f"Notarization submission: {name}: {state[name]['id']}", flush=True)
    deadline = time.monotonic() + 1800
    pending = set(github)
    while pending:
        for name in sorted(pending):
            identifier = state[name]["id"]
            result = json.loads(run(["xcrun", "notarytool", "info", identifier, *credentials,
                                    "--output-format", "json"], capture=True, env=env))
            status = result["status"]
            print(f"Notarization status: {name}: {status}", flush=True)
            if status == "Accepted":
                pending.remove(name)
            elif status != "In Progress":
                run(["xcrun", "notarytool", "log", identifier, *credentials,
                     final / f"{identifier}.json"], env=env)
                raise RuntimeError(f"Notarization failed: {name}: {status}; see {final}")
        if pending:
            if time.monotonic() >= deadline:
                raise RuntimeError("Notarization is still pending; rerun to resume using saved submission IDs")
            time.sleep(20)
    with tempfile.TemporaryDirectory(prefix="web2md-staple-") as staging:
        stage = Path(staging)
        zip_name = next(name for name in github if name.endswith(".zip"))
        dmg_name = next(name for name in github if name.endswith(".dmg"))
        run(["ditto", "-x", "-k", output / zip_name, stage])
        app = stage / f"{APP_NAME}.app"
        run(["xcrun", "stapler", "staple", app], env=env)
        run(["xcrun", "stapler", "validate", app], env=env)
        run(["codesign", "--verify", "--deep", "--strict", app])
        run(["spctl", "--assess", "--type", "execute", "--verbose=4", app])
        run(["ditto", "-c", "-k", "--sequesterRsrc", "--keepParent", app, final / Path(zip_name).name])
        # Preserve the submitted DMG's signed contents; staple the notarized container.
        dmg = final / Path(dmg_name).name
        shutil.copyfile(output / dmg_name, dmg)
        run(["xcrun", "stapler", "staple", dmg], env=env)
        run(["xcrun", "stapler", "validate", dmg], env=env)
        run(["codesign", "--verify", "--strict", dmg])
    metadata = dict(metadata, notarized=True, source_artifacts=github)
    write_metadata(final, metadata)
    with tarfile.open(final / "artifacts.tar.gz", "w:gz") as bundle:
        for path in sorted(final.iterdir()):
            if path.name != "artifacts.tar.gz":
                bundle.add(path, arcname=path.name)


def main():
    if sys.platform != "darwin":
        raise ValueError("Run this command on the Mac through remote.py")
    request = json.load(sys.stdin)
    if request.get("command") not in ["upload", "notarize"]:
        raise ValueError("Explicit upload or notarize command is required")
    if not re.fullmatch(r"[A-Z0-9]{10}", request["API_KEY_ID"]):
        raise ValueError("Invalid API key ID")
    if not re.fullmatch(r"[a-fA-F0-9]{8}(?:-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}", request["API_ISSUER_ID"]):
        raise ValueError("Invalid API issuer ID")
    key = Path.home() / f".appstoreconnect/private_keys/AuthKey_{request['API_KEY_ID']}.p8"
    if not key.is_file():
        raise ValueError(f"API private key missing: {key}")
    output = ROOT / "artifacts"
    metadata = json.loads((output / "build-info.json").read_text())
    if request["artifacts"] != metadata["artifacts"]:
        raise ValueError("Local and remote build manifests differ")
    verify_artifacts(output, metadata)
    env = os.environ.copy()
    env["DEVELOPER_DIR"] = env.get("DEVELOPER_DIR", "/Applications/Xcode.app/Contents/Developer")
    if request["command"] == "notarize":
        credentials = ["--key", key, "--key-id", request["API_KEY_ID"], "--issuer", request["API_ISSUER_ID"]]
        notarize(metadata, output, credentials, env)
    else:
        platform = request.get("platform")
        if platform not in ["ios", "macos"]:
            raise ValueError("Choose ios or macos explicitly")
        extension = ".ipa" if platform == "ios" else ".pkg"
        files = [output / name for name in metadata["artifacts"]
                 if name.startswith(f"{platform}-appstore/") and name.endswith(extension)]
        if len(files) != 1:
            raise ValueError(f"Expected one {platform} upload artifact")
        credentials = ["--api-key", request["API_KEY_ID"], "--api-issuer", request["API_ISSUER_ID"],
                       "--p8-file-path", key]
        run(["xcrun", "altool", "--validate-app", files[0], *credentials], env=env)
        if not request.get("validate_only"):
            run(["xcrun", "altool", "--upload-app", "-f", files[0], *credentials], env=env)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, OSError, subprocess.SubprocessError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
