# Mozilla source code submission and build instructions

This document describes how to rebuild the Firefox extension submitted to addons.mozilla.org from its original source code. The source ZIP and the extension ZIP are separate uploads.

## Build environment

- Operating system: Ubuntu 24.04 LTS (x86_64).
- Node.js: 24.19.0, as specified in `app/.node-version`. Install it from the [official Node.js downloads](https://nodejs.org/en/download), or install [fnm](https://github.com/Schniz/fnm) and run `fnm install 24.19.0` and `fnm use 24.19.0`.
- npm: 11.17.0. If the installed version differs, run `npm install --global npm@11.17.0`.
- Network access to the npm registry is needed to download the dependencies in `app/package-lock.json`. No Chrome signing key, Apple credentials, Python, or browser installation is needed for the Firefox review build.

## Rebuild the submitted extension

1. Extract the source ZIP. The root contains this README, `LICENSE`, `NOTICE.md`, and the `app/` directory. Open a terminal in `app/`:

   ```bash
   cd app
   ```

2. Verify the tool versions:

   ```bash
   node --version # v24.19.0
   npm --version  # 11.17.0
   ```

3. Run the complete Firefox review build script:

   ```bash
   npm run review:firefox
   ```

The `review:firefox` script runs `npm ci --no-audit` to install the locked dependencies, then runs webpack in production mode to transpile, bundle, and minify the TypeScript source. It copies the Firefox manifest, icons, and license files into `app/dist/firefox/`, then creates `app/release/simple-web2md-ext-firefox.zip` (paths relative to the extracted source root). Compare every file inside that ZIP with the submitted extension ZIP. The ZIP container metadata may differ between builds.

## Prepare the source ZIP

For maintainers using the full repository, build and package the current working tree from `app/`:

```bash
cd app
npm run package:stores
```

Upload `app/release/stores/<version>/simple-web2md-ext-<version>-firefox.zip` as the extension, and the corresponding `-firefox-source.zip` as its sources. The packager takes both from the current working tree, including uncommitted changes. Verify a clean rebuild from the source ZIP before submitting.

The source archive includes the original TypeScript, Firefox manifest, icons, webpack and TypeScript configuration, package and lockfiles, Node version, licenses, and this document as its root README. An explicit file allowlist excludes installed dependencies, generated bundles, Apple build scripts, store assets, `.env`, and signing keys. The source archive retains the `app/` directory because webpack resolves the root license files through `../`.
