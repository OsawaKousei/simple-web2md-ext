# Web to Markdown

クリック一つでウェブページを Markdown 形式で保存できるブラウザ拡張機能です。

## 🌟 特徴

- **ワンクリック変換**: ツールバーアイコンをクリックするだけで、現在のページを Markdown 形式で保存
- **高精度抽出**: Mozilla Readability を使用して記事コンテンツを正確に抽出
- **自動ダウンロード**: 変換された Markdown ファイルを自動的にダウンロード
- **日本語対応**: 日本語コンテンツにも完全対応
- **軽量**: シンプルで高速な動作

## 📋 動作環境

- Google Chrome 88 以降
- Microsoft Edge 88 以降
- Firefox 109 以降（Manifest V3 対応版）

## 🚀 インストール方法

1. このリポジトリをクローンまたはダウンロード

```bash
git clone https://github.com/yourusername/simple-web2md-ext.git
cd simple-web2md-ext
```

2. 依存関係をインストール

```bash
npm install
```

3. ビルド

```bash
npm run build
```

4. Chrome/Edge で拡張機能を読み込み
   - `chrome://extensions/` または `edge://extensions/` にアクセス
   - 「デベロッパーモード」を有効化
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `dist` フォルダを選択

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
git clone https://github.com/yourusername/simple-web2md-ext.git
cd simple-web2md-ext

# 依存関係をインストール
npm install

# 本番用ビルド
npm run build

# 拡張機能パッケージの作成
npm run package
```

### 技術スタック

- **TypeScript**: 型安全な開発
- **Webpack**: バンドリングとビルド
- **Mozilla Readability**: コンテンツ抽出
- **Turndown**: HTML to Markdown 変換
- **WebExtension Polyfill**: クロスブラウザ対応

## 📄 ライセンス

このプロジェクトは [ISC License](LICENSE) の下で公開されています。

## 🙏 謝辞

- [Mozilla Readability](https://github.com/mozilla/readability) - 高精度なコンテンツ抽出
- [Turndown](https://github.com/domchristie/turndown) - HTML to Markdown 変換
- [WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill) - クロスブラウザ対応

---
