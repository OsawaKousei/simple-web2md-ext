# Mozilla source code submission and build instructions

This document describes how to rebuild the Firefox extension submitted to addons.mozilla.org from its original source code. The source ZIP and the extension ZIP are separate uploads.

## Build environment

- Operating system: Ubuntu 24.04 LTS (x86_64).
- Node.js: 24.19.0, as specified in `.node-version`. Install it from the [official Node.js downloads](https://nodejs.org/en/download), or install [fnm](https://github.com/Schniz/fnm) and run `fnm install 24.19.0` and `fnm use 24.19.0`.
- npm: 11.17.0. If the installed version differs, run `npm install --global npm@11.17.0`.
- Network access to the npm registry is needed to download the dependencies in `package-lock.json`. No Chrome signing key or other external build tool is needed.

## Rebuild the submitted extension

1. Extract the source ZIP. Open a terminal in its root directory, which contains `package.json`.
2. Verify the tool versions:

   ```bash
   node --version # v24.19.0
   npm --version  # 11.17.0
   ```

3. Run the complete Firefox review build script:

   ```bash
   npm run review:firefox
   ```

The `review:firefox` script runs `npm ci --no-audit` to install the locked dependencies, then runs webpack in production mode to transpile, bundle, and minify the TypeScript source. It copies the Firefox manifest, icons, and license files into `dist/firefox/`, then creates `release/simple-web2md-ext-firefox.zip`. The files in `dist/firefox/` can be compared with the files inside the submitted extension ZIP. The ZIP container metadata may differ between builds.

## Prepare the source ZIP

Use the **same Git commit** that produced the submitted Firefox extension. From the repository root, after that commit is checked out, run:

```bash
git archive --format=zip --output=firefox-review-source.zip HEAD
```

The archive includes the original `src/` and `public/` files, `webpack.config.js`, `package.json`, `package-lock.json`, `.node-version`, this document, and the remaining tracked files needed for the build. It excludes generated `dist/` and `release/` files, installed `node_modules/`, `.env`, and signing keys because those are not tracked by Git. Do not add generated or transpiled code to the source ZIP.
