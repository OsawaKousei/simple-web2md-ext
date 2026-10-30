#!/usr/bin/env python3
"""Runs on macOS. Produces signed artifacts without uploading or notarizing."""

from contextlib import contextmanager
import hashlib
import json
import os
from pathlib import Path
import plistlib
import re
import secrets
import shlex
import shutil
import subprocess
import sys
import tarfile
import tempfile

from common import (APP_NAME, REMOTE_BASE, digest, export_options, load_profile,
                    run, validate_profile, write_metadata)

ROOT = Path(__file__).resolve().parents[3]
APP = ROOT / "app"
HOME_DIR = Path.home()


def environment():
    env = os.environ.copy()
    env["DEVELOPER_DIR"] = env.get("DEVELOPER_DIR", "/Applications/Xcode.app/Contents/Developer")
    env["PATH"] = "/opt/homebrew/bin:/usr/local/bin:" + env.get("PATH", "")
    version = (APP / ".node-version").read_text().strip()
    node = HOME_DIR / f".local/share/fnm/node-versions/{version}/installation/bin"
    if not (node / "node").is_file():
        run(["/opt/homebrew/bin/fnm", "install", version], env=env)
    if not (node / "node").is_file():
        raise ValueError(f"Node.js {version} not found at {node}")
    env["PATH"] = str(node) + ":" + env["PATH"]
    # Do not let credentials inherited from another app trigger automatic services.
    for key in list(env):
        if key.startswith(("APPLE_", "PRELIS_", "WEB2MD_")):
            del env[key]
    return env


@contextmanager
def signing(config, modes):
    lock = HOME_DIR / REMOTE_BASE / ".signing-lock"
    try:
        lock.mkdir()
    except FileExistsError:
        raise RuntimeError(f"Another Web2MD signing job is active: {lock}") from None
    original = shlex.split(run(["security", "list-keychains", "-d", "user"], capture=True).decode())
    try:
        with tempfile.TemporaryDirectory(prefix="web2md-keychain-") as staging:
            keychain = Path(staging) / "signing.keychain-db"
            password = secrets.token_hex(24)
            try:
                run(["security", "create-keychain", "-p", password, keychain], secret=True)
                run(["security", "unlock-keychain", "-p", password, keychain], secret=True)
                run(["security", "set-keychain-settings", "-lut", "21600", keychain])
                identities = {}
                certificates = []
                if any(mode != "github" for mode in modes):
                    certificates.append(("distribution", "KUPACLLC-Apple-Distribution.p12", "APPSTORE_P12_PASSWORD", "Apple Distribution"))
                if "macos" in modes:
                    certificates.append(("installer", "KUPACLLC-Mac-Installer-Distribution.p12", "INSTALLER_P12_PASSWORD", "3rd Party Mac Developer Installer"))
                if "github" in modes:
                    certificates.append(("developer-id", "KUPACLLC-Developer-ID-Application.p12", "GITHUB_P12_PASSWORD", "Developer ID Application"))
                for kind, filename, credential, prefix in certificates:
                    run(["security", "import", HOME_DIR / filename, "-k", keychain,
                         "-f", "pkcs12", "-P", config[credential],
                         "-T", "/usr/bin/codesign", "-T", "/usr/bin/productbuild"], secret=True)
                    pem = run(["security", "find-certificate", "-c", f"{prefix}: KUPAC LLC", "-p", keychain], capture=True)
                    der = run(["/usr/bin/openssl", "x509", "-outform", "DER"], capture=True, input_data=pem)
                    identities[kind] = hashlib.sha1(der).hexdigest().upper()
                run(["security", "set-key-partition-list", "-S", "apple-tool:,apple:,codesign:",
                     "-s", "-k", password, keychain], secret=True, capture=True)
                # Keep the existing default keychain. Restore only the search list on exit.
                run(["security", "list-keychains", "-d", "user", "-s", keychain, *original])
                yield keychain, identities
            finally:
                run(["security", "list-keychains", "-d", "user", "-s", *original])
                subprocess.run(["security", "delete-keychain", str(keychain)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    finally:
        lock.rmdir()


def profiles_for(mode, config, certificate):
    if mode == "github":
        return {}
    source = HOME_DIR / ".config/web2md/signing/profiles"
    platform = "iOS" if mode == "ios" else "OSX"
    profiles = {}
    for path in sorted(source.iterdir()):
        if path.suffix not in [".mobileprovision", ".provisionprofile"]:
            continue
        profile = load_profile(path)
        if platform not in profile.get("Platform", []):
            continue
        entitlements = profile.get("Entitlements", {})
        app_id = entitlements.get("application-identifier", entitlements.get("com.apple.application-identifier"))
        for role, bundle in [("app", config["BUNDLE_ID"]), ("extension", config["EXTENSION_ID"])]:
            if app_id != f"{config['TEAM_ID']}.{bundle}":
                continue
            validate_profile(profile, bundle, config["TEAM_ID"], platform, certificate)
            if role in profiles:
                raise ValueError(f"Multiple profiles for {mode}/{role}; keep one current profile in {source}")
            cache = HOME_DIR / "Library/Developer/Xcode/UserData/Provisioning Profiles"
            cache.mkdir(parents=True, exist_ok=True)
            installed = cache / (profile["UUID"] + path.suffix)
            shutil.copyfile(path, installed)
            installed.chmod(0o600)
            profiles[role] = profile
    if set(profiles) != {"app", "extension"}:
        raise ValueError(f"Missing {mode} app or extension profile in {source}")
    return profiles


def configure_project(project, mode, config, profiles, version):
    """Patch the generated project instead of retaining machine-specific generated files."""
    # The packager's Swift constant keeps its default ID even when target IDs change.
    # Both Safari state queries and the preferences button must use the signed ID.
    controller = project.parent / "Shared (App)" / "ViewController.swift"
    source, replacements = re.subn(
        r'(?m)^(let extensionBundleIdentifier\s*=\s*)"[^"\r\n]+"[ \t]*$',
        lambda match: match[1] + json.dumps(config["EXTENSION_ID"]),
        controller.read_text())
    if replacements != 1:
        raise ValueError("Expected exactly one generated host extensionBundleIdentifier declaration")
    controller.write_text(source)
    pbxproj = project / "project.pbxproj"
    model = json.loads(run(["plutil", "-convert", "json", "-o", "-", pbxproj], capture=True))
    objects = model["objects"]
    candidates = []
    for target in objects.values():
        if target.get("isa") != "PBXNativeTarget":
            continue
        product_type = target.get("productType", "")
        if product_type not in ["com.apple.product-type.application", "com.apple.product-type.app-extension"]:
            continue
        role = "app" if product_type.endswith(".application") else "extension"
        settings_list = objects[target["buildConfigurationList"]]["buildConfigurations"]
        platforms = set()
        for entry in settings_list:
            settings = objects[entry]["buildSettings"]
            sdk = settings.get("SDKROOT", "")
            platforms.add("ios" if sdk == "iphoneos" or "iOS" in target["name"] else "macos")
            settings.update({"PRODUCT_BUNDLE_IDENTIFIER": config["BUNDLE_ID"] if role == "app" else config["EXTENSION_ID"],
                             "DEVELOPMENT_TEAM": config["TEAM_ID"], "CODE_SIGN_STYLE": "Manual",
                             "MARKETING_VERSION": version, "CURRENT_PROJECT_VERSION": config["build_number"],
                             "INFOPLIST_KEY_CFBundleDisplayName": "Web to Markdown",
                             "CODE_SIGN_IDENTITY": "Developer ID Application" if mode == "github" else "Apple Distribution",
                             "ENABLE_HARDENED_RUNTIME": "YES", "ONLY_ACTIVE_ARCH": "NO",
                             "MACOSX_DEPLOYMENT_TARGET": "13.0", "IPHONEOS_DEPLOYMENT_TARGET": "16.0"})
            settings.pop("PROVISIONING_PROFILE", None)
            settings.pop("PROVISIONING_PROFILE_SPECIFIER", None)
            for key in list(settings):
                if key.startswith("CODE_SIGN_IDENTITY[") or key.startswith("PROVISIONING_PROFILE"):
                    del settings[key]
            if mode != "github":
                settings["PROVISIONING_PROFILE_SPECIFIER"] = profiles[role]["Name"]
            entitlement_path = settings.get("CODE_SIGN_ENTITLEMENTS")
            if entitlement_path:
                path = project.parent / entitlement_path
                if path.is_file():
                    entitlements = plistlib.loads(path.read_bytes())
                    # No shared storage or restricted native capabilities are used by this extension.
                    for key in ["com.apple.security.application-groups", "com.apple.application-identifier",
                                "com.apple.developer.team-identifier", "keychain-access-groups"]:
                        entitlements.pop(key, None)
                    path.write_bytes(plistlib.dumps(entitlements))
        if role == "app" and ("ios" if mode == "ios" else "macos") in platforms:
            candidates.append(target["name"])
    if len(candidates) != 1:
        raise ValueError(f"Could not identify one {mode} application scheme: {candidates}")
    # XML property lists are accepted by Xcode as project.pbxproj.
    pbxproj.write_bytes(plistlib.dumps(model))
    # Fix generated Info.plists whose literal default versions bypass build settings.
    for path in project.parent.rglob("Info.plist"):
        info = plistlib.loads(path.read_bytes())
        info["CFBundleShortVersionString"] = version
        info["CFBundleVersion"] = config["build_number"]
        info["NSHumanReadableCopyright"] = "Copyright © KUPAC LLC"
        info["LSApplicationCategoryType"] = "public.app-category.utilities"
        path.write_bytes(plistlib.dumps(info))
    return candidates[0]


def logged(args, log, env, cwd=APP):
    print(f"+ {shlex.join(list(map(str, args)))}\n  Log: {log}", flush=True)
    with log.open("wb") as output:
        status = subprocess.run(list(map(str, args)), cwd=cwd, env=env, stdout=output, stderr=subprocess.STDOUT).returncode
    if status:
        print("\n".join(log.read_text(errors="replace").splitlines()[-70:]), flush=True)
        raise RuntimeError(f"Build failed; see {log}")


def verify_app(app, config, github=False):
    run(["codesign", "--verify", "--deep", "--strict", app])
    info = plistlib.loads((app / "Contents/Info.plist").read_bytes()) if (app / "Contents").is_dir() else plistlib.loads((app / "Info.plist").read_bytes())
    if info["CFBundleIdentifier"] != config["BUNDLE_ID"]:
        raise ValueError("Exported app Bundle ID mismatch")
    extensions = list(app.rglob("*.appex"))
    if len(extensions) != 1:
        raise ValueError("Expected exactly one embedded Safari extension")
    ext_info = next(p for p in [extensions[0] / "Contents/Info.plist", extensions[0] / "Info.plist"] if p.exists())
    if plistlib.loads(ext_info.read_bytes())["CFBundleIdentifier"] != config["EXTENSION_ID"]:
        raise ValueError("Exported extension Bundle ID mismatch")
    if github:
        for binary in [app, extensions[0]]:
            result = subprocess.run(["codesign", "-dv", "--verbose=4", str(binary)], capture_output=True, text=True)
            if "Developer ID Application: KUPAC LLC" not in result.stderr or "runtime" not in result.stderr or "Timestamp=" not in result.stderr:
                raise ValueError("Missing Developer ID signature, hardened runtime, or timestamp")
            executable = binary / "Contents/MacOS" / plistlib.loads((binary / "Contents/Info.plist").read_bytes())["CFBundleExecutable"]
            architectures = run(["lipo", "-archs", executable], capture=True).decode().split()
            if set(architectures) != {"arm64", "x86_64"}:
                raise ValueError(f"Expected a Universal Binary: {architectures}")


def build_mode(mode, config, env, keychain, identities, output, version):
    profiles = profiles_for(mode, config, identities.get("distribution", ""))
    generated = ROOT / "native" / mode
    generated.mkdir(parents=True)
    logs = output / "logs"
    logs.mkdir(exist_ok=True)
    logged(["xcrun", "safari-web-extension-packager", APP / "dist/safari", "--project-location", generated,
            "--app-name", APP_NAME, "--bundle-identifier", config["BUNDLE_ID"], "--swift",
            "--copy-resources", "--no-open", "--no-prompt"], logs / f"{mode}-generate.log", env)
    projects = list(generated.rglob("*.xcodeproj"))
    if len(projects) != 1:
        raise ValueError("Packager did not produce exactly one Xcode project")
    project = projects[0]
    scheme = configure_project(project, mode, config, profiles, version)
    archive = ROOT / "archives" / f"{mode}.xcarchive"
    archive.parent.mkdir(exist_ok=True)
    destination = "generic/platform=iOS" if mode == "ios" else "generic/platform=macOS"
    flags = [f"OTHER_CODE_SIGN_FLAGS=--keychain {keychain}"]
    if mode != "ios":
        flags += ["ARCHS=arm64 x86_64"]
    logged(["xcodebuild", "archive", "-project", project, "-scheme", scheme, "-configuration", "Release",
            "-destination", destination, "-archivePath", archive, *flags], logs / f"{mode}-archive.log", env)
    options = ROOT / "archives" / f"{mode}-ExportOptions.plist"
    options.write_bytes(plistlib.dumps(export_options(mode, config, profiles)))
    exported = ROOT / "exports" / mode
    logged(["xcodebuild", "-exportArchive", "-archivePath", archive, "-exportPath", exported,
            "-exportOptionsPlist", options], logs / f"{mode}-export.log", env)
    final = output / ("github" if mode == "github" else f"{mode}-appstore")
    final.mkdir()
    stem = f"{APP_NAME}-{version}-{config['build_number']}-{mode}"
    if mode == "ios":
        packages = list(exported.glob("*.ipa"))
        if len(packages) != 1:
            raise ValueError("Expected one exported IPA")
        run(["unzip", "-tq", packages[0]])
        verify_app(archive / "Products/Applications" / f"{APP_NAME}.app", config)
        shutil.copyfile(packages[0], final / f"{stem}.ipa")
    elif mode == "macos":
        packages = list(exported.glob("*.pkg"))
        if len(packages) != 1:
            raise ValueError("Expected one exported App Store PKG")
        run(["pkgutil", "--check-signature", packages[0]])
        verify_app(archive / "Products/Applications" / f"{APP_NAME}.app", config)
        shutil.copyfile(packages[0], final / f"{stem}.pkg")
    else:
        app = exported / f"{APP_NAME}.app"
        verify_app(app, config, github=True)
        run(["ditto", "-c", "-k", "--sequesterRsrc", "--keepParent", app, final / f"{stem}.app.zip"])
        image_source = ROOT / "dmg-source"
        image_source.mkdir()
        run(["ditto", app, image_source / app.name])
        (image_source / "Applications").symlink_to("/Applications")
        dmg = final / f"{stem}.dmg"
        run(["hdiutil", "create", "-quiet", "-volname", "Web to Markdown", "-srcfolder", image_source,
             "-format", "UDZO", dmg])
        run(["codesign", "--sign", identities["developer-id"], "--keychain", keychain, "--timestamp", dmg])
        run(["codesign", "--verify", "--strict", dmg])
        run(["hdiutil", "verify", "-quiet", dmg])


def main():
    if sys.platform != "darwin":
        raise ValueError("This script must run on the Mac via remote.py")
    config = json.load(sys.stdin)
    print(f"Build workspace: {ROOT}", flush=True)
    if ROOT.name != config["build_id"] or digest(ROOT / "source.tar.gz") != config["source_sha256"]:
        raise ValueError("Source snapshot checksum mismatch")
    env = environment()
    output = ROOT / "artifacts"
    output.mkdir()
    run(["xcodebuild", "-version"], env=env)
    run(["xcodebuild", "-checkFirstLaunchStatus"], env=env)
    run(["npm", "ci", "--no-audit"], cwd=APP, env=env)
    run(["npm", "run", "build:safari"], cwd=APP, env=env)
    version = json.loads((APP / "dist/safari/manifest.json").read_text())["version"]
    if version != json.loads((APP / "package.json").read_text())["version"]:
        raise ValueError("Safari manifest and package.json versions must match")
    modes = ["macos", "ios", "github"] if config["target"] == "all" else [config["target"]]
    with signing(config, modes) as (keychain, identities):
        for mode in modes:
            build_mode(mode, config, env, keychain, identities, output, version)
    write_metadata(output, {"build_id": config["build_id"], "host": config["MAC_HOST"], "version": version,
                   "build_number": config["build_number"], "source_sha256": config["source_sha256"],
                   "bundle_id": config["BUNDLE_ID"], "extension_id": config["EXTENSION_ID"],
                   "team_id": config["TEAM_ID"], "modes": modes, "notarized": False})
    with tarfile.open(ROOT / "artifacts.tar.gz", "w:gz") as bundle:
        for path in sorted(output.iterdir()):
            bundle.add(path, arcname=path.name)
    print("Build complete. No App Store upload or notarization was performed.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, OSError, subprocess.SubprocessError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
