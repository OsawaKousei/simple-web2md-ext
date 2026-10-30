#!/usr/bin/env python3
"""Package built store extensions and matching, credential-free Firefox sources."""

import hashlib
import json
from pathlib import Path
import re
import zipfile

APP = Path(__file__).resolve().parents[1]
REPO = APP.parent


def files_under(directory):
    for path in sorted(directory.rglob("*")):
        if path.is_symlink():
            raise ValueError(f"Symlinks are not allowed in store packages: {path}")
        if path.is_file():
            yield path


def archive(destination, entries):
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for name, path in sorted(entries):
            if path.is_symlink() or path.name.startswith(".env") or path.suffix.lower() in {".pem", ".key", ".p8", ".p12"}:
                raise ValueError(f"Private or linked file is not allowed: {path}")
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            bundle.writestr(info, path.read_bytes())


def main():
    manifests = {browser: json.loads((APP / f"public/manifest.{browser}.json").read_text())
                 for browser in ["chrome", "firefox"]}
    version = manifests["chrome"]["version"]
    if version != manifests["firefox"]["version"] or not re.fullmatch(r"[0-9]+(?:\.[0-9]+){0,3}", version):
        raise ValueError("Chrome and Firefox must have the same numeric store version")
    output = APP / "release/stores" / version
    output.mkdir(parents=True, exist_ok=True)
    packages = []
    for browser in ["chrome", "firefox"]:
        dist = APP / "dist" / browser
        if json.loads((dist / "manifest.json").read_text()) != manifests[browser]:
            raise ValueError(f"Rebuild {browser}: generated manifest differs from source")
        for required in ["background.js", "content.js", "LICENSE", "NOTICE.md"]:
            if not (dist / required).is_file():
                raise ValueError(f"Missing {browser} build output: {required}")
        label = "chrome-edge" if browser == "chrome" else "firefox"
        package = output / f"simple-web2md-ext-{version}-{label}.zip"
        archive(package, [(str(path.relative_to(dist)), path) for path in files_under(dist)])
        packages.append(package)

    # Keep the repository layout: webpack resolves LICENSE and NOTICE.md in app/.. .
    source_files = [REPO / "LICENSE", REPO / "NOTICE.md"]
    source_files += [APP / name for name in ["package.json", "package-lock.json", ".node-version",
                                            "tsconfig.json", "webpack.config.js", "public/manifest.firefox.json"]]
    source_files += list(files_under(APP / "src")) + list(files_under(APP / "public/icons"))
    entries = [(str(path.relative_to(REPO)), path) for path in source_files]
    entries.append(("README.md", REPO / "docs/MOZILLA_REVIEW.md"))
    sources = output / f"simple-web2md-ext-{version}-firefox-source.zip"
    archive(sources, entries)
    packages.append(sources)

    sums = []
    for package in packages:
        with zipfile.ZipFile(package) as bundle:
            if bundle.testzip() is not None:
                raise ValueError(f"Corrupt ZIP: {package}")
        sums.append(f"{hashlib.sha256(package.read_bytes()).hexdigest()}  {package.name}\n")
        print(f"Created {package.relative_to(APP)}")
    (output / "SHA256SUMS").write_text("".join(sums))


if __name__ == "__main__":
    main()
