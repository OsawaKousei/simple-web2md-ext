#!/usr/bin/env python3
"""Local entry point. Build, App Store upload, and notarization are separate commands."""

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import shlex
import subprocess
import sys
import tarfile
import tempfile
import uuid

from common import (REMOTE_BASE, configuration, digest, run, safe_extract, verify_artifacts)

REPO = Path(__file__).resolve().parents[3]
SSH_OPTIONS = ["-o", "BatchMode=yes", "-o", "ConnectTimeout=15", "-o", "StrictHostKeyChecking=yes"]


def source_filter(entry):
    parts = Path(entry.name).parts
    if any(part == "__pycache__" or (part.startswith(".env") and part != ".env.example") for part in parts):
        return None
    if entry.issym() or entry.islnk() or Path(entry.name).suffix in [".p12", ".p8", ".pem", ".key", ".pyc"]:
        return None
    return entry


def ssh(host, args, **kwargs):
    return run(["ssh", "-T", *SSH_OPTIONS, host, shlex.join(args)], **kwargs)


def copy(host, source, destination, download=False):
    args = [f"{host}:{source}", str(destination)] if download else [str(source), f"{host}:{destination}"]
    run(["scp", *SSH_OPTIONS, *args])


def snapshot(archive):
    # Explicit source allowlist: no .env, keys, node_modules, LP, ref, or build outputs.
    inputs = [REPO / "LICENSE", REPO / "NOTICE.md"]
    inputs += [REPO / "app" / name for name in ["package.json", "package-lock.json", ".node-version",
               ".prettierignore", ".prettierrc.json", "eslint.config.mjs", "tsconfig.json", "webpack.config.js",
               "src", "public", "scripts"]]
    with tarfile.open(archive, "w:gz") as bundle:
        for source in inputs:
            bundle.add(source, arcname=str(source.relative_to(REPO)), filter=source_filter)


def collect(host, remote, destination):
    with tempfile.TemporaryDirectory(prefix="web2md-download-") as staging:
        archive = Path(staging) / "artifacts.tar.gz"
        copy(host, f"{remote}/artifacts.tar.gz", archive, download=True)
        extracted = Path(staging) / "extracted"
        safe_extract(archive, extracted)
        metadata = json.loads((extracted / "build-info.json").read_text())
        verify_artifacts(extracted, metadata)
        if destination.exists():
            raise ValueError(f"Output already exists: {destination}")
        destination.parent.mkdir(parents=True, exist_ok=True)
        import shutil
        shutil.copytree(extracted, destination)
    print(f"Verified artifacts: {destination}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    build = commands.add_parser("build", help="Build and recover artifacts; never upload or notarize")
    build.add_argument("target", choices=["all", "macos", "ios", "github"], default="all", nargs="?")
    now = datetime.now(timezone.utc)
    days = (now.date() - datetime(2020, 1, 1).date()).days
    build.add_argument("--build-number", default=f"{days}.{now.hour}.{now.minute}")
    for name in ["upload", "notarize"]:
        action = commands.add_parser(name)
        action.add_argument("release", type=Path, help="Local release directory produced by build")
        if name == "upload":
            action.add_argument("--platform", choices=["macos", "ios"], required=True)
            action.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    config = configuration(REPO)
    host = config["MAC_HOST"]
    if args.command == "build":
        if not re.fullmatch(r"[1-9][0-9]{0,3}(?:\.[0-9]{1,2}){0,2}", args.build_number):
            raise ValueError("Build number must follow CFBundleVersion's 4.2.2 digit limits")
        keys = ["GITHUB_P12_PASSWORD"] if args.target == "github" else ["APPSTORE_P12_PASSWORD"]
        if args.target in ["all", "macos"]:
            keys.append("INSTALLER_P12_PASSWORD")
        if args.target == "all":
            keys.append("GITHUB_P12_PASSWORD")
        for key in keys:
            if not config[key]:
                raise ValueError(f"Missing WEB2MD_{key}; see scripts/macos/.env.example")
        build_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + uuid.uuid4().hex[:8]
        remote = f"{REMOTE_BASE}/{build_id}"
        with tempfile.TemporaryDirectory(prefix="web2md-source-") as staging:
            archive = Path(staging) / "source.tar.gz"
            snapshot(archive)
            source_hash = digest(archive)
            ssh(host, ["mkdir", "-p", remote])
            copy(host, archive, f"{remote}/source.tar.gz")
            ssh(host, ["tar", "-xzf", f"{remote}/source.tar.gz", "-C", remote])
        config.update({"build_id": build_id, "target": args.target, "build_number": args.build_number,
                       "source_sha256": source_hash})
        # Credentials travel only on SSH stdin, never in argv, archives, or logs.
        ssh(host, ["python3", f"{remote}/app/scripts/macos/build.py"],
            input_data=json.dumps(config).encode())
        collect(host, remote, REPO / "app/release/safari" / build_id)
    else:
        metadata = json.loads((args.release / "build-info.json").read_text())
        verify_artifacts(args.release, metadata)
        build_id = metadata["build_id"]
        if not re.fullmatch(r"[0-9]{8}T[0-9]{6}Z-[a-f0-9]{8}", build_id):
            raise ValueError("Invalid build ID")
        if metadata["host"] != host:
            raise ValueError("Release was built on a different SSH host")
        for key in ["API_KEY_ID", "API_ISSUER_ID"]:
            if not config[key]:
                raise ValueError(f"Missing WEB2MD_{key}")
        remote = f"{REMOTE_BASE}/{build_id}"
        request = {"command": args.command, "API_KEY_ID": config["API_KEY_ID"],
                   "API_ISSUER_ID": config["API_ISSUER_ID"], "artifacts": metadata["artifacts"]}
        if args.command == "upload":
            request.update(platform=args.platform, validate_only=args.validate_only)
        ssh(host, ["python3", f"{remote}/app/scripts/macos/release.py"],
            input_data=json.dumps(request).encode())
        if args.command == "notarize":
            collect(host, f"{remote}/notarized", args.release / "notarized")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, OSError, subprocess.SubprocessError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
