# App Store 向けスクリーンショット

2026年10月31日に Mac アプリと iOS シミュレーターから取得しました。
iOS は既存のアプリをシミュレーター向けにビルドし、`simctl io screenshot` で撮影した実画面です。

| ファイル                                                                         | シミュレーター                       | サイズ    | 内容                                                   |
| -------------------------------------------------------------------------------- | ------------------------------------ | --------- | ------------------------------------------------------ |
| [mac-onboarding.jpg](mac-onboarding.jpg)                                         | Mac（撮影専用の一時ビルド）          | 2560×1600 | Safari 拡張の有効化を案内するアプリ画面                |
| [iphone-onboarding.jpg](iphone-onboarding.jpg)                                   | iPhone 18 Pro Max / iOS 27.0         | 1320×2868 | Safari 拡張の有効化を案内するアプリ画面                |
| [iphone-medium-onboarding-1206x2622.jpg](iphone-medium-onboarding-1206x2622.jpg) | iPhone 18 Pro / iOS 27.0（撮影専用） | 1206×2622 | 同上。Dynamic Island 搭載 iPhone（中型ディスプレイ）用 |
| [ipad-onboarding.jpg](ipad-onboarding.jpg)                                       | iPad Pro 13-inch (M5) / iOS 27.0     | 2064×2752 | 同上                                                   |

JPEG / RGB で、アルファチャンネルはありません。端末の外枠や説明文は合成していません。
画面の案内文は、現在のアプリが実際に表示する英語のままです。

## iPhone のアップロード先

- 「Dynamic Island 搭載 iPhone（中型ディスプレイ）」の 6.1／6.3 インチ欄には `iphone-medium-onboarding-1206x2622.jpg` を登録します。対応サイズは縦向きで 1179×2556 または 1206×2622 です。
- 既存の `iphone-onboarding.jpg` は 1320×2868 のため「Dynamic Island 搭載 iPhone（大型ディスプレイ）」用です。中型欄ではサイズエラーになります。

中型用は既存の大型画像をリサイズせず、撮影専用 iPhone 18 Pro シミュレーターで撮り直しました。
撮影専用シミュレーターは撮影後に終了・削除しています。既存の起動中シミュレーターは変更していません。

## 説明付き Mac 掲載画像

既存の creative と同じ配色で、機能を日本語で説明する静止画像を作成しました。
どちらも 2560×1600 の PNG / RGB で、アルファチャンネルはありません。

| ファイル                                         | 内容                                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [mac-01-markdown-ja.png](mac-01-markdown-ja.png) | 記事から Markdown への変換例。Safari の実画面ではなく、入力と出力を説明する図です。 |
| [mac-02-how-to-ja.png](mac-02-how-to-ja.png)     | 撮影済みの Mac アプリ実画面に、有効化から保存までの手順を添えた画像です。           |

登録先は「Mac → アプリスクリーンショット」です。実画面を含む `mac-02-how-to-ja.png` を先頭に、変換例を補足として配置する構成を想定しています。
「アプリプレビュー」は動画用なので、この静止画像の登録先ではありません。

編集用データは同名の SVG です。次のコマンドで PNG を再生成できます。

```sh
python3 app/assets/app-store/screenshots/render-cards.py
```

## Mac 画像の取得方法

SSH セッションには画面収録・アクセシビリティ権限がないため、デスクトップの画面収録は行っていません。
生成済み Xcode プロジェクトを一時ディレクトリにコピーし、アプリ自身の `WKWebView` を
`takeSnapshot(with:completionHandler:)` で保存する処理だけを追加して起動しました。
表示内容・画像・スタイルは既存アプリのままで、上下の余白を 16:10 に切り出しています。
ウィンドウ枠は含みません。配布用アプリや OS の権限設定は変更していません。

## 追加で撮影する画面

Safari 内の機能拡張の選択・Markdown の保存結果はまだ取得していません。

掲載用には、これらの案内画面に加えて、Safari で変換・保存する機能が分かる画面を撮影してください。
Safari 拡張の有効化設定は変更していません。
撮影用に起動した iPhone・iPad は終了し、もともと起動していた別のシミュレーターは操作していません。

## 撮影中に見つかった修正事項

生成されたホストアプリの `ViewController.swift` にある `extensionBundleIdentifier` は
`jp.co.kupac.web2md.Extension` のままですが、登録・署名済みの拡張 ID は
`jp.co.kupac.web2md.SafariExtension` です。
この参照は拡張の状態取得と Safari 設定への誘導に使われるため、公開前にビルド生成処理で一致させる必要があります。
今回の撮影ではこの処理や配布済みバイナリは修正していません。

## 参照

- [Apple：掲載アセットのベストプラクティス](https://developer.apple.com/app-store/asset-best-practices/)
- [Apple：スクリーンショットの仕様](https://developer.apple.com/jp/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Apple：WebView のスナップショット取得](<https://developer.apple.com/documentation/webkit/wkwebview/takesnapshot(with:completionhandler:)>)
