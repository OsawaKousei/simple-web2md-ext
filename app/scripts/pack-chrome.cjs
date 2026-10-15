const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const envFile = path.join(root, ".env");

if (!fs.existsSync(envFile)) {
  throw new Error(
    ".env がありません。.env.example を参考に秘密鍵のパスを設定してください。",
  );
}

process.loadEnvFile(envFile);

const keyPath = process.env.CHROME_EXTENSION_PEM;
if (!keyPath || !path.isAbsolute(keyPath)) {
  throw new Error(
    ".env の CHROME_EXTENSION_PEM に PEM ファイルの絶対パスを設定してください。",
  );
}

if (!fs.existsSync(keyPath) || !fs.statSync(keyPath).isFile()) {
  throw new Error("CHROME_EXTENSION_PEM が指す PEM ファイルが見つかりません。");
}

const extensionDir = path.join(root, "dist", "chrome");
if (!fs.existsSync(path.join(extensionDir, "manifest.json"))) {
  throw new Error(
    "dist/chrome がありません。Chrome 拡張機能を先にビルドしてください。",
  );
}

const packedCrx = path.join(root, "dist", "chrome.crx");
const releaseCrx = path.join(root, "release", "simple-web2md-ext-chrome.crx");
fs.rmSync(packedCrx, { force: true });

const result = spawnSync(
  "google-chrome",
  [
    "--no-message-box",
    `--pack-extension=${extensionDir}`,
    `--pack-extension-key=${keyPath}`,
  ],
  { cwd: root, stdio: "inherit" },
);

if (result.error) {
  throw result.error;
}
if (result.status !== 0 || !fs.existsSync(packedCrx)) {
  throw new Error("Chrome の CRX パッケージ化に失敗しました。");
}

fs.mkdirSync(path.dirname(releaseCrx), { recursive: true });
fs.copyFileSync(packedCrx, releaseCrx);
console.log(`CRX を作成しました: ${releaseCrx}`);
