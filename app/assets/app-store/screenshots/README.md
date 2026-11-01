# App Store 向けスクリーンショット

## アップロード後の現状（2026年11月1日）

ユーザー申告では、iPhone・iPadの掲載画像とApp Previewの動画は登録済みです。審査用の動画案内はこれからです。
現在のワークスペースに残っているMP4は [29秒の全編早送り版](ios-app-preview-full-29s-886x1920-h264.mp4) です。
以下の履歴に出てくる通常速度の43秒版、25秒抜粋版、元の実機録画は、現在のフォルダにはありません。
審査への返信では、残っている全編版を添付するか共有URLで案内し、約1.487倍速であることを記載します。
App Previewへの登録に加え、Notesに6項目への回答と動画の参照を入れます。入力案は [審査情報](../審査情報.md) を参照してください。

## iPadシミュレーターで追加した掲載画像（2026年11月1日）

iPhone版と同じ配色・見出し・説明付きレイアウトで、iPad用の画像2枚を作成しました。
どちらも **2064×2752のPNG / RGB、透明部分なし** です。

| ファイル                                                           | 内容                                                                  |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| [ipad-01-safari-ja-2064x2752.png](ipad-01-safari-ja-2064x2752.png) | Safariの機能拡張メニューにWeb to Markdownが表示された画面。先頭に配置 |
| [ipad-02-setup-ja-2064x2752.png](ipad-02-setup-ja-2064x2752.png)   | アプリ本体の有効化案内画面。2枚目に配置                               |

登録先は **App Store Connect → iPad → 13インチディスプレイ → アプリスクリーンショット** です。
実際のiPadシミュレーター画面を使い、縦横比と画面内容を保って説明文を添えています。
iPhone画像の転用や、Safariの画面・メニューの描き直しは行っていません。
元の画面は [ipad-safari-raw.png](ipad-safari-raw.png) と [ipad-onboarding-raw.png](ipad-onboarding-raw.png) に保存しています。

撮影環境はiPad Pro 13インチ（M5）・iOS/iPadOS 27.0シミュレーター・Xcode 27.1です。
提出済み `1.0.0 (2494.16.15)` の生成プロジェクトを撮影用の一時ディレクトリへコピーし、シミュレーター向けにビルドしました。
拡張の `manifest.json`、`background.js`、`content.js` のSHA-256は、保存済みの提出用IPAと一致します。
撮影環境・バージョン・ハッシュは [ipad-capture-info.json](ipad-capture-info.json) に記録しています。

アプリ起動、拡張の有効化、Safariの拡張メニュー表示、Markdownの保存をシミュレーター上で確認しました。
製品ページの変換では1970バイトの `.md` が保存され、記事タイトルを含むことを確認しています。
掲載画像のSafari画面には、文章中心の自社プライバシーページを表示しています。
これはシミュレーターでの確認記録です。実機QAの結果としては扱いません。

編集元は同名のSVGです。次のコマンドで再生成できます。

```sh
python3 app/assets/app-store/screenshots/render-cards.py \
  ipad-01-safari-ja-2064x2752.svg \
  ipad-02-setup-ja-2064x2752.svg
```

## 実機素材から作成したファイル（作成時の履歴、2026年11月1日）

ユーザー提供の `../IMG_0003.PNG`、`../IMG_0004.PNG` は、ともに750×1334のRGB画像です。
元の画像はiPhone SE用の正しいサイズで、Media Managerの「ホームボタン搭載iPhone（中型ディスプレイ）」欄で使用できます。
必須の「Dynamic Island搭載iPhone（中型ディスプレイ）」欄へ入れる場合はサイズが異なります。

その掲載欄用に、実機画面の縦横比と内容を保ち、見出し・説明を添えた1206×2622のPNGを作成しました。
端末の外枠やDynamic Islandは合成せず、iPhone SEの実機画面を使った説明付き画像であることを記載しています。
AI生成や画面内容の描き直しは行っていません。元画像・元動画は変更していません。

| ファイル                                                                                 | 用途・登録先                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [iphone-01-safari-ja-1206x2622.png](iphone-01-safari-ja-1206x2622.png)                   | 掲載用スクリーンショット。Safariの機能拡張メニュー。先頭に配置                        |
| [iphone-02-setup-ja-1206x2622.png](iphone-02-setup-ja-1206x2622.png)                     | 掲載用スクリーンショット。有効化の案内画面。2枚目に配置                               |
| [ios-app-preview-full-29s-886x1920-h264.mp4](ios-app-preview-full-29s-886x1920-h264.mp4) | 掲載用「App Preview」の全編早送り版。886×1920、約29秒、H.264、30fps、AACステレオ48kHz |
| `ios-app-preview-886x1920-h264.mp4`（現在のフォルダにはなし）                            | 掲載用動画の旧案。約25秒の抜粋版。全編早送り版を使用する場合は登録不要                |
| `ios-review-demo-h264.mp4`（現在のフォルダにはなし）                                     | 審査用動画。750×1334、約43秒、H.264、30fps、AAC。外部の再生URLをNotesに記載           |

PNG2枚はRGBで透明部分がなく、画像サイズ・形式を確認済みです。
App Store Connectの「iPhone → Dynamic Island搭載iPhone（中型ディスプレイ）」で、PNGはスクリーンショット、29秒の全編早送り版MP4はApp Previewへ登録します。
既存の案内画面だけの掲載画像に代えて、Safariの操作画面を先頭にします。
この作業ではApp Store Connectへのアップロードは行っていません。

### 動画の用途と編集内容

元動画 `../ScreenRecording_11-01-2026 18-01-58_1.mp4` は、750×1334・約43秒・HEVC（H.265）・可変フレームレートでした。
App Previewは15〜30秒で、MP4の場合H.264を使う必要があります。そのため、元動画を掲載用動画の欄へそのまま登録できません。

審査用H.264版は全編を保持し、再生速度・画面サイズを変えずに30fpsへ変換しました。容量は約7.9MBです。
アプリ起動、有効化設定、Safariでの実行、ダウンロード、保存結果のプレビューを確認できます。
この全編版はApp Preview欄へ入れず、再生できるHTTPSのURLをApp Review InformationのNotesへ記載してください。

掲載用App Previewの全編早送り版は、ユーザーの希望に合わせて元動画全体を約1.487倍速にし、約29秒に収めました。区間の切り取りは行っていません。
音声も同じ倍率で時間を縮め、音程を保っています。縦横比を保って886×1920のキャンバスへ収めています。
旧案の25秒版は元動画の2.5〜5.5秒と18〜40秒を順に抜粋したもので、そのまま別ファイルとして残しています。
作成時は、審査担当者に渡す動画URLに通常速度の約43秒の全編版を使う想定でした。現在は冒頭の現状メモに従い、残っている29秒の全編早送り版を明示します。

端末の機種はユーザー申告のiPhone SE（第2世代）です。OS・インストールしたビルド番号は、この素材だけでは確定していません。
NotesのOS等の未記入欄は実機・TestFlightで確認して入力してください。
iPad用には、このページ冒頭のシミュレーター撮影画像を使います。このiPhone画像をiPad画像として転用するものではありません。

### 説明付き画像の再生成

編集元は同名のSVGです。既存のlibrsvg/Cairoレンダラーを使います。

```sh
python3 app/assets/app-store/screenshots/render-cards.py \
  iphone-01-safari-ja-1206x2622.svg \
  iphone-02-setup-ja-1206x2622.svg
```

### 審査用動画の再変換

FFmpegが利用できる環境で、次のコマンドを実行します。`-n` は既存ファイルの上書きを防ぎます。

```sh
ffmpeg -n \
  -i 'app/assets/app-store/ScreenRecording_11-01-2026 18-01-58_1.mp4' \
  -map 0:v:0 -map '0:a?' \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 128k -movflags +faststart \
  app/assets/app-store/screenshots/ios-review-demo-h264.mp4
```

### 掲載用の29秒全編早送り版の再変換

```sh
ffmpeg -n \
  -i 'app/assets/app-store/ScreenRecording_11-01-2026 18-01-58_1.mp4' \
  -filter_complex '[0:v:0]setpts=(PTS-STARTPTS)/1.487,fps=30,scale=886:-2,pad=886:1920:0:(oh-ih)/2:color=0x123047,setsar=1[v];[0:a:0]atempo=1.487,asetpts=PTS-STARTPTS[a]' \
  -map '[v]' -map '[a]' \
  -c:v libx264 -preset medium -b:v 10M -maxrate 12M -bufsize 20M \
  -profile:v high -level:v 4.0 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart \
  app/assets/app-store/screenshots/ios-app-preview-full-29s-886x1920-h264.mp4
```

仕様の参照：[スクリーンショット](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)、[App Preview](https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications)、[説明文を添えた実画面の掲載](https://developer.apple.com/app-store/asset-best-practices/)。

## iOS 再提出時の注意（2026年11月1日）

Guideline 2.1 への対応として、最新正式 OS の実機でアプリ起動から Safari での変換・保存結果までを画面収録します。既存のシミュレーター画像は、この審査用動画の代わりにはなりません。
ストア掲載用スクリーンショットも引き続き必要です。案内画面に加えて、Safari の機能拡張メニューなど実際の利用画面を補ってください。
手順と収集対象は [iOS 審査の準備資料](../../../../docs/IOS_APP_REVIEW.md)、Notes の入力案は [審査情報](../審査情報.md)を参照してください。

## 取得済み画像

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

2026年10月31日のシミュレーター撮影では、Safari内の機能拡張の選択・Markdownの保存結果は未取得でした。
2026年11月1日にユーザー提供の実機画像・動画でSafari内の操作と保存結果を確認し、上記の提出用ファイルを作成しました。

掲載用には、これらの案内画面に加えて、上記のSafari操作画面を使用してください。
Safari 拡張の有効化設定は変更していません。
撮影用に起動した iPhone・iPad は終了し、もともと起動していた別のシミュレーターは操作していません。

## 撮影中に見つかった問題と修正

生成されたホストアプリの `ViewController.swift` にある `extensionBundleIdentifier` は
`jp.co.kupac.web2md.Extension` のままですが、登録・署名済みの拡張 ID は
`jp.co.kupac.web2md.SafariExtension` です。
この参照は拡張の状態取得と Safari 設定への誘導に使われます。
2026年10月31日にビルド生成処理を修正し、署名する拡張と同じ ID をホストアプリにも設定するようにしました。
撮影に使った旧ビルドには、この修正は含まれていません。撮影済み画像の表示内容は変更していません。

## 参照

- [Apple：掲載アセットのベストプラクティス](https://developer.apple.com/app-store/asset-best-practices/)
- [Apple：スクリーンショットの仕様](https://developer.apple.com/jp/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Apple：WebView のスナップショット取得](<https://developer.apple.com/documentation/webkit/wkwebview/takesnapshot(with:completionhandler:)>)
