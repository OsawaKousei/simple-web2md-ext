# このワークスペースでの作業

- Chrome/Edge と Firefox 向けの WebExtension。実装は `src/`、ブラウザ別の manifest とアイコンは `public/`、ビルド設定は `webpack.config.js` にある。
- ページからの記事抽出と Markdown 変換は `src/logic/markdown-converter.ts`、ダウンロードは `src/logic/file-downloader.ts` が担当する。変更時は両ブラウザでの動作と manifest の権限を確認する。
- `dist/` と `release/` は生成物。通常の修正はソース側で行う。
- 変更後は `npm run lint` と `npm run format` を実行する。拡張機能の動作や manifest を変えた場合は `npm run build:chrome` と `npm run build:firefox` でも確認する。
