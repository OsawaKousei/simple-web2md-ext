# Web to Markdown

_[English version](README_EN.md)_

ウェブページを Markdown 形式で保存できるブラウザ拡張機能です。

詳しい紹介は[プロダクトページ](https://web2md.prj.kupac.co.jp/)をご覧ください。

## 🌟 特徴

- **ワンクリック変換**: ツールバーアイコンをクリックするだけで、現在のページを Markdown 形式で保存
- **高精度抽出**: Mozilla Readability を使用して記事コンテンツを正確に抽出
- **自動ダウンロード**: 変換された Markdown ファイルを自動的にダウンロード
- **日本語対応**: 日本語コンテンツにも完全対応
- **軽量**: シンプルで高速な動作

## 📋 動作環境

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari（macOS 13 以降、iOS / iPadOS 16 以降）

## 🚀 インストール方法

### 公式ストアから入手

- **Google Chrome**: [Chrome ウェブストア](https://chromewebstore.google.com/detail/web-to-markdown/kpobgdndklphhmkkjloefgmenidljpdh)で「Chrome に追加」をクリック
- **Mozilla Firefox**: [Firefox Browser Add-ons](https://addons.mozilla.org/en-US/firefox/addon/web-to-markdown-extension/)で「Firefox へ追加」をクリック
- **Microsoft Edge**: [Microsoft Edge アドオン](https://microsoftedge.microsoft.com/addons/detail/web-to-markdown/fnadejhpnenfeejgcbfcoiepbiimpjon)からインストール
- **Safari（Mac / iPhone / iPad）**: [App Store](https://apps.apple.com/jp/app/web-to-markdown/id6828905022)からアプリをインストールし、Safari の設定で Web to Markdown の機能拡張を有効にする

Safari 版は Mac・iPhone・iPad とも同じ App Store ページから入手できます。

### 手動でインストール

1. [GitHub リリースページ](https://github.com/OsawaKousei/simple-web2md-ext/releases)から Chrome / Edge / Firefox 用 ZIP をダウンロード

2. zip ファイルを解凍

3. ブラウザで拡張機能を読み込み

**Chrome/Edge の場合:**

- `chrome://extensions/` または `edge://extensions/` にアクセス
- 「デベロッパーモード」を有効化
- 「パッケージ化されていない拡張機能を読み込む」をクリック
- ZIP を解凍したフォルダを選択

**Firefox の場合:**

- `about:debugging#/runtime/this-firefox` にアクセス
- 「一時的なアドオンを読み込む」をクリック
- ZIP を解凍したフォルダ内の `manifest.json` を選択

### Safari（Mac）を手動でインストール

- [GitHub リリースページ](https://github.com/OsawaKousei/simple-web2md-ext/releases)から DMG またはアプリ本体の ZIP をダウンロードし、アプリを Applications に配置
- アプリを起動し、Safari の「設定 → 機能拡張」で Web to Markdown を有効化

## 📖 使用方法

1. **ページを開く**: Markdown で保存したいウェブページを開きます
2. **拡張機能を実行**: ツールバーのアイコン、または Safari の機能拡張メニューから Web to Markdown を実行します。Safari でサイトへのアクセス許可を求められた場合は許可してください
3. **自動保存**: ページタイトルを使った名前の `.md` ファイルが端末に保存されます

## ❗ 制限事項

- JavaScript 動的コンテンツが多いページでは一部内容が抽出されない場合があります
- chrome:// や file:// などの特殊な URL では動作しません
- 一部の Web サイトではコンテンツセキュリティポリシーにより動作しない場合があります

## 🐛 トラブルシューティング

### ファイルがダウンロードされない場合

1. ブラウザのダウンロード設定を確認
2. ポップアップブロッカーが有効になっていないか確認
3. 拡張機能の権限設定を確認

### 内容が正しく抽出されない場合

1. ページが完全に読み込まれてから実行してください
2. JavaScript 多用サイトの場合、少し時間を置いてから再試行してください

## 📝 開発

Mozilla 審査用ソースコードの提出と再現ビルドの手順は [MOZILLA_REVIEW.md](docs/MOZILLA_REVIEW.md) を参照してください。

Chrome / Edge / Firefox の更新提出用 ZIP と Mozilla 審査用ソースは、`app/` で `npm run package:stores` を実行すると `app/release/stores/<version>/` にまとめて生成します。提出ファイルと更新内容は [ストア更新資料](app/assets/store-update/1.1.md) を参照してください。

GitHub Release の本文・添付ファイルと、次回のバージョン（`1.2` / `1.2.0`）は [リリース管理メモ](docs/RELEASING.md) を参照してください。

Safari の macOS / iOS 向け SSH ビルド、署名、アップロード、公証の手順は [SAFARI_BUILD.md](docs/SAFARI_BUILD.md) を参照してください。

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/OsawaKousei/simple-web2md-ext.git
cd simple-web2md-ext

# 指定された Node.js バージョンに切り替え
fnm use

# 依存関係をインストール
npm install

# Chrome の署名鍵の絶対パスを設定するためのファイルを作成
cp .env.example .env

# .env の CHROME_EXTENSION_PEM を実際の PEM ファイルの絶対パスに変更

# Chrome/Edge と Firefox の配布用ファイルを作成
npm run build
```

ビルド開始前に ESLint、`npm audit`、Prettier の書式チェックが自動実行されます。
個別に確認する場合は `npm run check`、書式を修正する場合は `npm run format:write` を実行してください。

生成先: `release/simple-web2md-ext-chrome.zip` と `release/simple-web2md-ext-firefox.zip`。
Chrome ビルド時には、`.env` の秘密鍵を使って `release/simple-web2md-ext-chrome.crx` も生成します。
`.env` は Git の管理対象外です。署名鍵の中身はリポジトリに配置しないでください。
各 ZIP のルートに、そのブラウザ用の `manifest.json` が含まれます。
片方だけ作成する場合は `npm run package:chrome` または `npm run package:firefox` を実行してください。

問い合わせ先: **dev@kupac.co.jp**。

### 技術スタック

- **TypeScript**: 型安全な開発
- **Webpack**: バンドリングとビルド
- **Mozilla Readability**: コンテンツ抽出
- **Turndown**: HTML to Markdown 変換
- **WebExtension Polyfill**: クロスブラウザ対応

## 🙏 謝辞

- [Mozilla Readability](https://github.com/mozilla/readability) - 高精度なコンテンツ抽出
- [Turndown](https://github.com/domchristie/turndown) - HTML to Markdown 変換
- [WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill) - クロスブラウザ対応

---
