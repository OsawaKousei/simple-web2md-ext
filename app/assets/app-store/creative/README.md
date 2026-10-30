# App Store プロモーション用バナー（日本語）

App Store Connect の「プロダクトページ情報 → ヘッダ」に登録する画像です。
ヘッダ欄には、以下のいずれか 1 枚を選択してください。

| ファイル                                                 | サイズ    | 登録先                     |
| -------------------------------------------------------- | --------- | -------------------------- |
| [header-ja-3840x1646.png](header-ja-3840x1646.png)       | 3840×1646 | ヘッダ                     |
| [universal-ja-5244x2950.png](universal-ja-5244x2950.png) | 5244×2950 | ヘッダ・検索結果の共通画像 |

両方とも PNG / RGB で、アルファチャンネルはありません。
App Store Connect でアセットをチェックし、端末ごとのプレビューで文字や図の切れ方を確認してから登録します。

## デザイン

既存の `../../store-screenshot-source.html` の紺・ミントの配色と、
`../../../public/icons/icon.svg` のアイコンを使いました。
製品ページと共通の「ウェブの情報を、自分のファイルに。」というメッセージに、
記事ページから Markdown ファイルへの変換を表すイラストを組み合わせています。
文字と主要な図を中央に寄せ、周辺には装飾を配置しています。

これは機能を表現したプロモーション用イラストです。
スクリーンショット欄には実際のアプリや Safari で操作した画面を用意します。
Mac アプリの審査提出には Mac 用スクリーンショットが少なくとも 1 枚必要で、バナーでは代替できません。

## 編集・再出力

編集元は [header-ja.svg](header-ja.svg) です。日本語フォントは Noto Sans CJK JP を使用しています。
SVG を編集してから、Linux の librsvg・Cairo・GObject が利用できる環境で以下を実行すると、
両サイズの PNG を再出力できます。

```bash
python3 app/assets/app-store/creative/render.py
```

ネットワーク接続は不要です。5244×2950 版は同じ図柄を中央に置き、背景を上下へ拡張します。

## 参照

- [Apple：クリエイティブアセットの仕様](https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications)
- [Apple：アセットのベストプラクティス](https://developer.apple.com/app-store/asset-best-practices/)
- [Apple：スクリーンショットの仕様](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
