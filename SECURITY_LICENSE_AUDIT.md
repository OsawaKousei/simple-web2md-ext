# セキュリティ・ライセンス監査

## 監査後の対応（2026-10-12）

- L-01: ビルド時に本体の `LICENSE` と `NOTICE.md` を ZIP へ同梱するよう変更。NOTICE に Readability / Turndown / webextension-polyfill のライセンス全文・帰属情報と、MPL 対象の対応ソース入手先を記載。
- L-02: `package.json` と `package-lock.json` のルートのライセンス宣言を LICENSE と同じ MIT に統一。
- P-01: プライバシーポリシーの作成・公開・登録はユーザーから対応済みと報告あり。公開先の再確認は行っていない。
- S-01: 画像やリンクを保存すること自体は仕様。監査上の懸念は、タイトルや alt の文字列が HTML や別の画像リンクとして解釈されること。保存先のレンダラーにも依存するため、拡張内のコード実行とは区別する。今回の修正対象外。
- S-02: 非表示要素・textarea を含むフォールバック保存は、ユーザーの意図する仕様として扱う。今回の修正対象外。
- Firefox 固有の提出準備・検証は、ユーザーの指示により今回の対象外。

以下は初回監査時点の記録。ZIP の構成、ハッシュ、指摘の対応状況は当時のもの。

## 初回監査

監査日: 2026-10-12（日本時間）  
対象: コミット `f7c8f97` のソース、lockfile、インストール済み依存関係、ローカルの Chrome / Firefox 配布 ZIP。GitHub Releases、Chrome Web Store、Firefox Add-ons、Microsoft Edge Add-ons での頒布を想定。

**本体を現在の LICENSE（MIT）で配布する方針は採用可能。ただし、現在の ZIP はライセンス文書が欠落しており、そのままの公開は推奨しない。** 第三者ライブラリの条件を残し、プライバシー開示と以下の出力処理を整備する必要がある。アプリ全体を MPL に変更する必要はない。

これは確認できた実装・配布物と公式資料に基づく技術監査であり、著作権の帰属やストア審査の承認を保証するものではない。監査に伴うアプリコード、LICENSE、配布 ZIP の変更は行っていない。

## 指摘一覧

優先度は「高: 公開前に対応」「中: 公開前の修正・準備を推奨」「低: 堅牢性改善」。ライセンス・提出手続きの優先度は脆弱性の深刻度とは区別する。

| ID   | 分類・優先度     | 指摘                                                      | 主な根拠                                                                       |
| ---- | ---------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| L-01 | ライセンス・高   | ZIP に本体・第三者のライセンスと MPL ソース入手案内がない | `webpack.config.js:38`、両 ZIP の全エントリー                                  |
| P-01 | ストア要件・高   | プライバシーポリシーが確認できない                        | README、マニフェスト、配布物、Chrome / Edge 公式規約                           |
| S-01 | セキュリティ・中 | Markdown のタイトル・画像 alt・URL の処理が不十分         | `src/logic/markdown-converter.ts:27`、`:39`、`:76`、`:117`                     |
| S-02 | プライバシー・中 | 抽出失敗時に非表示要素・フォーム本文を保存する            | `src/logic/markdown-converter.ts:96`                                           |
| P-02 | Firefox 提出・中 | ビルド前ソースの提出物と再現手順の整備が必要              | `package.json:13`、README の開発手順                                           |
| L-02 | ライセンス・中   | MIT と ISC のメタデータが矛盾している                     | `LICENSE:1`、`package.json:25`、lockfile のルート                              |
| S-03 | 可用性・低       | 不正 URL 一つで変換全体が失敗する                         | `src/logic/markdown-converter.ts:34`、`:47`、`:89`                             |
| S-04 | リソース管理・低 | 入力サイズ無制限、Firefox の Blob URL が解放されない      | `src/logic/markdown-converter.ts:61`、`src/logic/file-downloader.ts:49`、`:62` |

## ライセンス判定

### L-01: 配布物の告知不足

両 ZIP には `background.js`、`content.js`、`manifest.json`、アイコンのみが入っていた。`LICENSE`、`NOTICE.md`、第三者ライセンス、対応ソースへの案内はいずれも含まれていない。Webpack のコピー対象もマニフェストとアイコンだけで、再ビルドしても改善しない。

既存の `NOTICE.md` は webextension-polyfill の MPL 本文とリポジトリのトップ URL のみ。本体の MIT はもちろん、Readability と Turndown の条件も配布 ZIP で満たす必要がある。

実際の production ビルドのモジュール一覧から、次の構成を確認した。

| 対象                    | 固定されたバージョン | ライセンス     | ブラウザ ZIP への組み込み | 必要な対応                                                          |
| ----------------------- | -------------------- | -------------- | ------------------------- | ------------------------------------------------------------------- |
| 本体                    | 1.0.0 / manifest 1.0 | MIT（LICENSE） | あり                      | `Copyright (c) 2025 n622` を含む LICENSE を同梱                     |
| `@mozilla/readability`  | 0.6.0                | Apache-2.0     | あり                      | Apache-2.0 全文、由来の告知を同梱。元の著作権表示は Arc90 Inc       |
| `turndown`              | 7.2.0                | MIT            | あり、browser 版          | `Copyright (c) 2017 Dom Christie` と MIT 全文を同梱                 |
| `webextension-polyfill` | 0.12.0               | MPL-2.0        | あり、両エントリー        | MPL 全文、対象の特定、対応ソースの取得方法を配布物に含める          |
| `@mixmark-io/domino`    | 2.2.0                | BSD-2-Clause   | なし                      | 今回の ZIP の対象外。将来同梱する場合は著作権・条件・免責文を付ける |

Readability のインストール済みパッケージには独立した NOTICE ファイルは見当たらなかった。Apache-2.0 はライセンス本文の提供を要求し、元に NOTICE がある場合にはその告知の保持も要求する。依存元ファイルを変更する場合は変更の表示も必要。今回確認した由来・著作権表示を第三者告知へまとめると管理しやすい。[Apache-2.0 第4条](https://www.apache.org/licenses/LICENSE-2.0)

MIT は再配布・商用利用を認める一方、著作権表示と許諾文の保持が条件。本体を MIT にすることによって第三者ライブラリの条件が消えるわけではない。[MIT 本文](https://opensource.org/license/mit)

MPL は今回のような別ソースファイルからの組み込みで、本体すべての MPL 化を求めるものではない。ただし圧縮 JavaScript は MPL 上の実行形式であり、MPL 対象部分のソース入手方法を利用者に知らせる必要がある。MPL 本文だけを追加しても、この案内の代わりにはならない。[Mozilla MPL FAQ Q8・Q11・Q16](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)

具体的には、第三者告知に `webextension-polyfill 0.12.0` と [対応する公式ソース](https://github.com/mozilla/webextension-polyfill/tree/0.12.0) を記載する。配布者側でも対応するソースを Release の別添として保存しておくと、入手可能性を維持しやすい。変更した場合は変更後の対象ソースを MPL で提供する。最新版へのリンクだけで済ませない。

推奨する配布構成は、各 ZIP に本体の `LICENSE` と第三者告知、各ライセンス全文、MPL 対象ソースの入手案内を同梱する形。Webpack のコピー処理と、ZIP 内の必須ファイル検査を追加する。GitHub のリポジトリに LICENSE があることだけに依存しない。

開発依存の全ライブラリが ZIP に入るわけではない。Webpack のモジュール一覧で同梱範囲を判断した。`node_modules` 全体を別途配布する場合は、今回の表より広いライセンス確認が必要になる。

### L-02: ライセンス宣言と権利者の整理

`package.json` と `package-lock.json` のルートの `license` は `ISC`。現在の LICENSE を採用するなら両方を `MIT` に揃え、README に本体と第三者ライセンスの区別を記載する。

LICENSE の権利者は `n622`、README / Firefox manifest の公開者は `KUPAC LLC`。著作権者と公開者が違うこと自体は問題ではなく、公開者に合わせて既存の著作権者を機械的に置換する必要もない。会社への権利移転、外部制作物、寄稿者の許諾はリポジトリだけでは確認できない。

アイコンは PNG が4点あり、制作元・利用条件を説明する資料は確認できなかった。第三者素材なら出典と再配布権を確認し、自作ならその記録を残す。MIT の年が2025年であることは、それだけでは欠陥ではない。

## セキュリティとプライバシー

### 確認できた良い点

- 権限は `activeTab`、`scripting`、`downloads`。現在の機能に用途があり、常時全サイトへのアクセス権限は要求していない。
- ユーザーのツールバー操作で content script を注入する。常駐のページ巡回や閲覧履歴収集は確認できない。
- 自前ソースに解析サービス・広告 SDK・外部サーバーへの送信処理は見当たらない。`fetch()` の引数は内部生成の `data:` URL であり、この呼び出しは外部サーバー送信ではない。
- 外部コード取得、`eval`、`new Function`、ページからの `window.postMessage` を特権処理へ渡す経路は自前ソースに見当たらない。
- content script のコマンドは限定され、外部メッセージ受信ハンドラーはない。`sender` チェックがないことだけを、任意 Web ページから呼び出せる脆弱性とは判定しない。
- 保存ファイル名はスラッシュ等を除去し、拡張子を `.md` に固定する。ページタイトルによるパストラバーサルは確認できない。

ネットワークトラフィックを網羅的に捕捉した監査ではない。「外部送信処理が見当たらない」は、ブラウザや後から Markdown を開くアプリまで含めた通信ゼロの保証ではない。

### S-01: 未エスケープの Markdown と URL

ページは信頼できない入力。タイトルをそのまま見出しへ、画像の `alt` をそのまま画像記法へ挿入し、URL は `new URL()` で解決するだけで許可スキームを制限していない。`new URL()` は安全性検査にはならない。

実際の変換コードを一時的にブラウザ用にビルドし、Chrome 155.0.8059.39 の headless 実行で確認した。長い通常記事を持つ入力では Readability 成功時にも以下の結果になった。

| 入力                                           | 実際の出力例                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| タイトル文字列 `<img src=x onerror=alert(1)>`  | `# <img src=x onerror=alert(1)>`                                     |
| 画像 alt `](<https://attacker.test/track>) ![` | `![](<https://attacker.test/track>) ![](https://example.test/a.png)` |
| リンク `href="data:text/html,test"`            | `[click](data:text/html,test)`                                       |

さらに本文が `<div hidden><a href="javascript:alert(1)">click</a></div>` の場合、Readability が抽出を断念し、フォールバック出力に `[click](javascript:alert(1))` が残った。通常経路では Readability が除去する JavaScript リンクも、フォールバックで復活する。

影響は保存された Markdown を使う段階で生じる。安全化しないレンダラーでは HTML / 危険なリンクが解釈される可能性があり、画像を自動取得するビューアーでは画像 alt から注入された URL にアクセスする可能性がある。拡張機能内でのスクリプト実行や、安全化された Markdown ビューアーでの XSS は実証していない。

対応: タイトル・alt を Markdown のテキストとしてエスケープする。リンクは `http:` / `https:`、必要なら `mailto:` など目的に合う許可リストを定め、画像は別の許可リストにする。拒否したリンクはラベルだけを残し、不許可の画像は除去する。URL の括弧・区切り文字も安全に出力する。通常経路とフォールバックに同じ安全化処理を適用する。

既存の正規表現による script タグ削除は完全なサニタイザーではない。ただし、この拡張は変換結果を HTML として画面へ挿入していないため、それだけを根拠に「拡張機能で XSS が発生する」とは判定しない。

### S-02: 非表示内容のローカル保存

Readability が失敗すると `document.body.innerHTML` 全体を使う。`hidden`、`aria-hidden`、フォーム、編集領域などを明示的には除去しない。

Chrome で本文を `<div hidden>HIDDEN_SECRET_TOKEN</div><textarea>PRIVATE_DRAFT</textarea>` とした場合、Readability が抽出を断念し、両方の文字列が Markdown に残った。実際の入力後のフォーム値すべてを抽出することを示したものではなく、この検証は HTML 内の textarea 本文を対象にしている。

ユーザーが見ていない情報が保存され、後から共有・アップロードすると意図しない開示につながる。拡張が開発者へ送信する証拠はない。フォールバックでも不要・非表示・フォーム要素を DOM ベースで除外し、記事が得られなければ保存を中止して知らせる選択肢を検討する。外部 CSS による非表示も別途検証する。

### S-03: 不正 URL で変換失敗

`href="http://["` を含む記事では、`new URL()` が例外になる。catch 内で同じルールのフォールバックを再実行するため、再度例外となり保存に至らないことを Chrome で確認した。

URL ごとに例外を処理し、該当要素だけをテキストへ戻す。変換・保存に失敗したことをユーザーへ知らせる処理も有用。

### S-04: サイズ制限と Blob の寿命

`maxElemsToParse: 0` は無制限。DOM 複製、HTML、Markdown、UTF-8 配列、各バイトの文字列配列、Base64 など複数の表現を作るため、大きなページで CPU / メモリ負荷が増える。クラッシュさせる負荷試験や発生サイズの測定は行っていない。

Firefox 側は `URL.createObjectURL()` 後に `URL.revokeObjectURL()` を呼んでおらず、バックグラウンド文書の寿命中に Blob が保持され得る。ダウンロード完了・中断に応じて解放する。`downloads.download()` が ID を返した直後は完了とは限らないため、その時点で即時解放しない。入力・出力サイズと連続実行にも上限を設ける。

## ストア・GitHub 配布

### P-01: プライバシー開示

Web ページの内容を読み取り、ローカルファイルに保存する実装なので、「サーバーに送らない」ことだけを理由にプライバシーポリシーを省略できない。Chrome の公式 FAQ はローカル処理・保存だけでも開示とポリシーが必要と明示している。[Chrome User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)

ポリシーには、クリック時に読む本文・タイトル・リンク・画像 URL、端末内の変換、Markdown の保存先、開発者への送信・分析の有無、保存ファイルをユーザーが削除すること、問い合わせ先を記載する。画像 URL は保存後のビューアーが取得し得るため、画像自体をオフライン保存する機能と混同させない。ストア上のデータ申告、権限理由、説明文と内容を一致させる。Google の Limited Use に関する説明も整備する。

Edge もデータの取り扱いを説明するプライバシーポリシーを要求している。Edge 向けの掲載内容では対象ブラウザを適切に説明する。[Microsoft Edge 開発者ポリシー 1.5](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)

### P-02: Firefox 審査用ソース

Webpack と TypeScript を使っているため、AMO には圧縮済み ZIP に加えて、対応するビルド前ソースと再現手順を提出する必要がある。これは MPL 対象ソースを一般の受領者へ提供する義務とは別で、AMO の審査用ソースは一般公開されない。[Mozilla ソース提出手順](https://extensionworkshop.com/documentation/publish/source-code-submission/)

現在は2種類の拡張 ZIP を作るスクリプトのみ。審査用アーカイブに `src`、`public`、ビルド設定、package.json、lockfile、Node バージョン、ライセンス、具体的なビルド手順を含める。現環境は Node 24.19.0 / npm 11.17.0。依存関係復元は `npm ci` を推奨する。

`npm run build:firefox` の prebuild はネットワーク依存の `npm audit` も実行するため、将来の脆弱性 DB の変更や通信障害によって審査時の再ビルドが止まる可能性がある。リリース時の品質ゲートを維持しつつ、審査担当者用には、lockfile から復元して同じ Webpack production 出力を作る手順も明記する。

### 配布経路ごとの準備

| 配布先                 | このプロジェクトで準備するもの                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| GitHub Releases        | ライセンスを含むブラウザ別 ZIP、対応コミット / タグ、MPL ソース入手案内。SHA-256 の併記も推奨        |
| Chrome Web Store       | Chrome 用 ZIP、公開プライバシーポリシー URL、単一目的・3権限の理由、データ取扱い申告、ストア掲載素材 |
| Firefox Add-ons        | Firefox 用 ZIP、別途ソースアーカイブとビルド手順、データ申告、署名・審査                             |
| Microsoft Edge Add-ons | Chrome 用 ZIP を候補として Edge で実機確認し、Partner Center の掲載情報・プライバシー項目を整備      |

Firefox manifest は既に固定 ID と `data_collection_permissions.required: ["none"]` を持つ。開発者への送信がない現実装とは整合的と考えられるが、ローカル出力の仕様を含めて審査時に説明する。新規提出のデータ申告要件は既に導入済み。`none` の拡張に対し、この項目だけを理由に Firefox 140 以上へ引き上げる必要があるとは判定しない。送信を追加する場合は再評価する。[Firefox データ同意の公式説明](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/)

GitHub の ZIP を解凍して使う Chrome / Edge 向けの開発者モード案内は、ストアからの通常インストールとは区別する。[Chrome の配布・インストール方法](https://developer.chrome.com/docs/extensions/how-to/distribute/install-extensions)

Firefox の `about:debugging` による読み込みは一時利用向け。通常版 Firefox で継続利用する一般配布には Mozilla の署名が必要で、GitHub から直接配布する場合も署名済み XPI を用意する。ZIP の拡張子を変えるだけでは署名にならない。[Mozilla 署名・配布手順](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)

Edge の提出 UI では ZIP、掲載情報、プライバシー等を設定する。ストアアカウントの確認や提出状態は今回アクセスしていない。[Edge 公開手順](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)

## 検証結果・監査の範囲

| 検証                                     | 結果                                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm audit --json`（dev を含む）         | 既知脆弱性 0件。npm レジストリへ照会成功。報告された total dependencies は279                         |
| `npm run lint`                           | 成功                                                                                                  |
| `tsc --noEmit`                           | 成功                                                                                                  |
| `npm run format`                         | 監査開始時の作業ツリーで成功                                                                          |
| Chrome / Firefox production ビルド       | 同じ Webpack 設定で一時ディレクトリへビルド成功、エラー・警告なし                                     |
| ZIP と再ビルド結果の比較                 | 両 ZIP 内の全ファイルが一致。ZIP 容器自体のバイト一致を主張するものではない                           |
| 配布依存の特定                           | Webpack の compilation modules で Readability / Turndown browser / polyfill を確認。domino は同梱なし |
| lockfile の取得先                        | `resolved` のホストは npm 公式レジストリのみ。`hasInstallScript` の宣言なし                           |
| 現行ソースの限定的な秘密情報パターン検査 | 秘密鍵・代表的なトークンのパターン該当なし。全履歴の秘密情報監査は未実施                              |
| Markdown 出力の検証                      | Chrome headless で S-01 / S-02 / S-03 を再現                                                          |

Markdown 検証は、実際の `markdown-converter.ts` と同じ依存をブラウザ向けにビルドし、ローカルの合成 HTML で実行した。検証 HTML の CSP で外部リソースを遮断し、攻撃先通信や生成物のスクリプト実行は行っていない。拡張のインストールからボタンクリック、ダウンロード完了までの E2E 試験ではない。Firefox / Edge の実機動作、ストアバリデーター、アカウント設定、公開済み GitHub Release の実体、外部画像の権利は未確認。

最初の npm 監査は環境の DNS 制限で失敗したが、ネットワークアクセス可能な実行で再照会して0件を確認した。依存脆弱性0件は、独自コードや未知の脆弱性がないことを意味しない。

監査中に追加された `assets/ストアの掲載情報.md` は作成途中の掲載案で、アプリ・配布物の判定対象には含めていない。

監査対象の SHA-256:

```text
Chrome ZIP   d2eaaa91f2f1b3b97195cd692fc8acf6c4150d2990c82ed7de07af16d912ab6e
Firefox ZIP  ab474bad0d7b8a5b32a3e2e0aebbdd7b8a6c671ba0ec8fe918b7d2c244b682b0
lockfile     6845290cab24a4b3c28790f8844696f90df22f1a24b9b0a1daea405eacc0e850
```

公開前の対応順序は、ライセンス同梱と宣言修正、Markdown とフォールバックの安全化、プライバシー開示、Firefox 審査用ソース作成、3ブラウザでの変換・保存試験と最終 ZIP 検査を推奨する。
