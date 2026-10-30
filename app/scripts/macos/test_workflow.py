"""Checks the boundaries that protect credentials, profiles, and release artifacts."""

from datetime import datetime, timedelta
import hashlib
import io
import json
import os
from pathlib import Path
import plistlib
import tarfile
import tempfile
import unittest
from unittest.mock import patch

import release
from build import configure_project

from common import (configuration, export_options, read_env, safe_extract, validate_profile,
                    verify_artifacts, write_metadata)
from remote import snapshot, source_filter


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.config = {"TEAM_ID": "TEAM123456", "BUNDLE_ID": "com.example.app",
                       "EXTENSION_ID": "com.example.app.Extension"}
        self.cert = b"certificate-fixture"
        self.profile = {"Name": "StoreProfile", "TeamIdentifier": ["TEAM123456"],
                        "Platform": ["iOS"], "ExpirationDate": datetime.now() + timedelta(days=1),
                        "DeveloperCertificates": [self.cert],
                        "Entitlements": {"application-identifier": "TEAM123456.com.example.app"}}

    def validate(self, profile=None, **overrides):
        args = {"bundle_id": "com.example.app", "team": "TEAM123456", "platform": "iOS",
                "certificate_sha1": hashlib.sha1(self.cert).hexdigest()}
        args.update(overrides)
        validate_profile(self.profile if profile is None else profile, **args)

    def test_matching_distribution_profile(self):
        self.validate()

    def test_wrong_app_platform_and_certificate_rejected(self):
        for override in [{"bundle_id": "com.example.app.Extension"}, {"platform": "OSX"},
                         {"certificate_sha1": "0" * 40}]:
            with self.subTest(override=override), self.assertRaises(ValueError):
                self.validate(**override)

    def test_expired_and_device_profiles_rejected(self):
        for override in [{"ExpirationDate": datetime.now() - timedelta(days=1)},
                         {"ProvisionedDevices": ["device"]}, {"ProvisionsAllDevices": True}]:
            with self.subTest(override=override), self.assertRaises(ValueError):
                self.validate(dict(self.profile, **override))

    def test_export_never_uploads_and_maps_both_targets(self):
        profiles = {"app": {"Name": "Parent"}, "extension": {"Name": "Extension"}}
        for mode in ["macos", "ios", "github"]:
            options = export_options(mode, self.config, profiles)
            self.assertEqual(options["destination"], "export")
            if mode == "github":
                self.assertNotIn("provisioningProfiles", options)
                self.assertEqual(options["method"], "developer-id")
            else:
                self.assertEqual(set(options["provisioningProfiles"]),
                                 {self.config["BUNDLE_ID"], self.config["EXTENSION_ID"]})

    def test_host_and_signed_targets_share_configured_extension_id(self):
        config = dict(self.config, EXTENSION_ID="com.example.app.SafariExtension", build_number="2495.1.0")
        profiles = {"app": {"Name": "Parent"}, "extension": {"Name": "Extension"}}
        for mode in ["macos", "ios", "github"]:
            with self.subTest(mode=mode), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                project = root / "App.xcodeproj"
                project.mkdir()
                controller = root / "Shared (App)/ViewController.swift"
                controller.parent.mkdir()
                controller.write_text('let extensionBundleIdentifier = "com.example.app.Extension"\n'
                                      'getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier)\n'
                                      'showPreferencesForExtension(withIdentifier: extensionBundleIdentifier)\n')
                objects = {}
                for platform, sdk in [("macos", "macosx"), ("ios", "iphoneos")]:
                    for role, product in [("app", "application"), ("extension", "app-extension")]:
                        key = f"{platform}-{role}"
                        objects[key] = {"isa": "PBXNativeTarget", "name": key,
                                        "productType": f"com.apple.product-type.{product}",
                                        "buildConfigurationList": key + "-list"}
                        objects[key + "-list"] = {"buildConfigurations": [key + "-release"]}
                        objects[key + "-release"] = {"buildSettings": {"SDKROOT": sdk}}
                with patch("build.run", return_value=json.dumps({"objects": objects}).encode()):
                    scheme = configure_project(project, mode, config, profiles, "1.0.0")
                self.assertEqual(scheme, ("ios" if mode == "ios" else "macos") + "-app")
                self.assertIn('let extensionBundleIdentifier = "com.example.app.SafariExtension"', controller.read_text())
                self.assertNotIn('"com.example.app.Extension"', controller.read_text())
                updated = plistlib.loads((project / "project.pbxproj").read_bytes())["objects"]
                for platform in ["macos", "ios"]:
                    self.assertEqual(updated[f"{platform}-extension-release"]["buildSettings"]["PRODUCT_BUNDLE_IDENTIFIER"],
                                     config["EXTENSION_ID"])

    def test_changed_host_template_stops_build(self):
        declaration = 'let extensionBundleIdentifier = "com.example.app.Extension"\n'
        for source in ["// declaration removed\n", declaration * 2]:
            with self.subTest(source=source), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                controller = root / "Shared (App)/ViewController.swift"
                controller.parent.mkdir()
                controller.write_text(source)
                with self.assertRaisesRegex(ValueError, "exactly one generated host"):
                    configure_project(root / "App.xcodeproj", "github", self.config, {}, "1.0.0")
                self.assertEqual(controller.read_text(), source)

    def test_env_is_literal_and_requires_private_permissions(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".env"
            path.write_text("PASSWORD='$(echo secret)`echo secret`$HOME'\n")
            path.chmod(0o600)
            self.assertEqual(read_env(path)["PASSWORD"], "$(echo secret)`echo secret`$HOME")
            path.chmod(0o644)
            with self.assertRaises(ValueError):
                read_env(path)

    def test_ssh_host_requires_private_configuration(self):
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ, {}, clear=True):
            root = Path(directory)
            with self.assertRaisesRegex(ValueError, "Set WEB2MD_MAC_HOST"):
                configuration(root)
            config_dir = root / "app/scripts/macos"
            config_dir.mkdir(parents=True)
            path = config_dir / ".env"
            path.write_text("WEB2MD_MAC_HOST=builder@mac.example\n")
            path.chmod(0o600)
            self.assertEqual(configuration(root)["MAC_HOST"], "builder@mac.example")
            with patch.dict(os.environ, {"WEB2MD_MAC_HOST": "override@mac.example"}):
                self.assertEqual(configuration(root)["MAC_HOST"], "override@mac.example")

    def test_snapshot_excludes_credentials_and_includes_licenses(self):
        with tempfile.TemporaryDirectory() as directory:
            archive = Path(directory) / "source.tar.gz"
            snapshot(archive)
            with tarfile.open(archive) as bundle:
                names = bundle.getnames()
            self.assertIn("LICENSE", names)
            self.assertIn("NOTICE.md", names)
            self.assertIn("app/public/manifest.safari.json", names)
            self.assertFalse(any(Path(name).name == ".env" for name in names))
            self.assertFalse(any(name.startswith("ref/") or "node_modules" in name for name in names))

    def test_all_private_environment_variants_are_excluded(self):
        for name in ["app/scripts/.env", "app/scripts/.env.production", "app/scripts/key.p12",
                     "app/scripts/key.p8", "app/scripts/key.pem", "app/scripts/__pycache__/x.pyc"]:
            self.assertIsNone(source_filter(tarfile.TarInfo(name)))
        self.assertIsNotNone(source_filter(tarfile.TarInfo("app/scripts/.env.example")))

    def test_tampered_and_traversing_artifacts_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            package = output / "app.ipa"
            package.write_bytes(b"signed-package")
            write_metadata(output, {"build_id": "fixture"})
            info = json.loads((output / "build-info.json").read_text())
            verify_artifacts(output, info)
            package.write_bytes(b"modified")
            with self.assertRaises(ValueError):
                verify_artifacts(output, info)
            with self.assertRaises(ValueError):
                verify_artifacts(output, {"artifacts": {"../app.ipa": "0" * 64}})

    def test_archive_cannot_escape_destination_or_install_symlinks(self):
        for name, kind in [("../escape", tarfile.REGTYPE), ("/escape", tarfile.REGTYPE),
                           ("link", tarfile.SYMTYPE)]:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as directory:
                archive = Path(directory) / "bad.tar"
                with tarfile.open(archive, "w") as bundle:
                    entry = tarfile.TarInfo(name)
                    entry.type = kind
                    entry.linkname = "/tmp"
                    bundle.addfile(entry, io.BytesIO(b""))
                with self.assertRaises(ValueError):
                    safe_extract(archive, Path(directory) / "out")

    def test_validation_does_not_upload_and_upload_is_platform_specific(self):
        for validate_only in [True, False]:
            with self.subTest(validate_only=validate_only), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                output = root / "artifacts"
                (output / "macos-appstore").mkdir(parents=True)
                (output / "macos-appstore/app.pkg").write_bytes(b"signed-pkg")
                write_metadata(output, {"build_id": "fixture"})
                metadata = json.loads((output / "build-info.json").read_text())
                private_keys = root / "home/.appstoreconnect/private_keys"
                private_keys.mkdir(parents=True)
                (private_keys / "AuthKey_ABCDE12345.p8").write_text("fixture")
                request = {"command": "upload", "API_KEY_ID": "ABCDE12345",
                           "API_ISSUER_ID": "11111111-1111-1111-1111-111111111111",
                           "platform": "macos", "validate_only": validate_only,
                           "artifacts": metadata["artifacts"]}
                with patch.object(release, "ROOT", root), patch.object(release.Path, "home", return_value=root / "home"), \
                     patch.object(release.sys, "platform", "darwin"), \
                     patch.object(release.sys, "stdin", io.StringIO(json.dumps(request))), \
                     patch.object(release, "run") as execute:
                    release.main()
                    self.assertEqual(execute.call_count, 1 if validate_only else 2)
                    self.assertIn("--validate-app", execute.call_args_list[0].args[0])
                    if not validate_only:
                        self.assertIn("--upload-app", execute.call_args_list[1].args[0])


if __name__ == "__main__":
    unittest.main()
