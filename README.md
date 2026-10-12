# Web to Markdown

_[English version](README_EN.md)_

クリック一つでウェブページを Markdown 形式で保存できるブラウザ拡張機能です。

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

## 🚀 インストール方法

1. [GitHub リリースページ](https://github.com/OsawaKousei/simple-web2md-ext/releases/tag/v1.0)から zip ファイルをダウンロード

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

## 📖 使用方法

1. **ページを開く**: Markdown で保存したいウェブページを開きます
2. **拡張機能をクリック**: ツールバーの「Web to Markdown」アイコンをクリック
3. **自動保存**: ページタイトル.md ファイルがダウンロードフォルダに保存されます

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

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/OsawaKousei/simple-web2md-ext.git
cd simple-web2md-ext

# 指定された Node.js バージョンに切り替え
fnm use

# 依存関係をインストール
npm install

# Chrome の署名鍵の絶対パスを .env の CHROME_EXTENSION_PEM に設定
cp .env.example .env

# Chrome/Edge と Firefox のストア提出用 ZIP を作成
npm run build
```

ビルド開始前に ESLint、`npm audit`、Prettier の書式チェックが自動実行されます。
個別に確認する場合は `npm run check`、書式を修正する場合は `npm run format:write` を実行してください。

生成先: `release/simple-web2md-ext-chrome.zip` と `release/simple-web2md-ext-firefox.zip`。
Chrome ビルド時には、`.env` の秘密鍵を使って `release/simple-web2md-ext-chrome.crx` も生成します。
`.env` は Git の管理対象外です。署名鍵の中身はリポジトリに配置しないでください。
各 ZIP のルートに、そのブラウザ用の `manifest.json` が含まれます。
片方だけ作成する場合は `npm run package:chrome` または `npm run package:firefox` を実行してください。

公開者: **KUPAC LLC** ／ 連絡先: **dev@kupac.co.jp**。
Chrome Web Store と Firefox Add-ons の公開者名・連絡先メールアドレスは、各ストアの開発者プロフィールにも設定してください。

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
