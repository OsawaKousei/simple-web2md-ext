# Safari 向けの SSH ビルドと配布

macOS と iOS の親アプリは `jp.co.kupac.web2md`、Safari 拡張は
`jp.co.kupac.web2md.SafariExtension` を共有します。App Store Connect では
1 つのアプリ登録に iOS と macOS を追加してください。

## ビルド

ローカル側に Python 3、Node.js、OpenSSH（ssh / scp）が必要です。
接続先は Git 管理対象外の `app/scripts/macos/.env` の
`WEB2MD_MAC_HOST`（`SSHユーザー@ホスト名またはIP`）に設定します。
接続先の既定値はありません。
SSH 鍵認証と known_hosts の登録は事前に済ませてください。

```bash
cd app
npm run build:apple
```

ビルドだけを実行します。App Store Connect へのアップロードや公証は行いません。
個別に作成する場合は以下を使います。

```bash
npm run build:macos
npm run build:ios
npm run build:github
```

`build:safari` は WebExtension 部分だけをローカルで作成します。
`build:apple` 等はソースを固定したスナップショットを Mac に転送し、
Mac 上で npm ci、WebExtension ビルド、Xcode プロジェクト生成、アーカイブ、
署名済み成果物のエクスポートを行います。Xcode の公式 Packager が生成した
案内画面を使用し、Bundle ID、バージョン、署名、最低 OS をスクリプトで設定します。
生成プロジェクトを手動編集しても次回ビルドには引き継がれません。

ホストアプリの `ViewController.swift` に生成される `extensionBundleIdentifier` も、
署名対象と同じ `WEB2MD_EXTENSION_ID` に設定します。これにより Mac アプリの
拡張状態の取得と Safari 設定画面への誘導が、埋め込まれた拡張を参照します。
生成テンプレートが変わり、この定義を一意に更新できなくなった場合はビルドを停止します。

最低 OS は macOS 13 / iOS 16、Mac の実行ファイルは arm64 / x86_64 の Universal Binary です。
Node.js は `app/.node-version` に合わせて fnm で用意します。
`DEVELOPER_DIR` の既定値は `/Applications/Xcode.app/Contents/Developer` です。

成果物は `app/release/safari/<ビルドID>/` に回収します。

| ディレクトリ      | 成果物                                           |
| ----------------- | ------------------------------------------------ |
| `macos-appstore/` | Mac App Store 提出用 PKG                         |
| `ios-appstore/`   | iOS 提出用 IPA                                   |
| `github/`         | Developer ID 署名済み・公証前の app.zip と DMG   |
| `logs/`           | プロジェクト生成・アーカイブ・エクスポートのログ |

`build-info.json` と `SHA256SUMS` に成果物のハッシュを記録し、回収時に照合します。
ビルド ID は UTC 時刻とランダム文字列です。Mac 側の作業場所は
`~/web2md-builds/<ビルドID>/` で、生成プロジェクト、xcarchive、ログを保持します。
失敗時も表示された作業場所にログが残ります。

ビルド番号は既定で「2020-01-01 からの日数.UTC 時.UTC 分」です。
同じ分に複数の提出用ビルドを作成する場合などは明示してください。

```bash
npm run build:apple -- --build-number 2500.14.1
```

Safari manifest と package.json のバージョンを一致させてください。
App Store Connect に再提出する際は、以前より大きいビルド番号を指定します。

## 署名ファイルと認証

Mac の SSH ユーザーのホームに次のファイルを置きます。

```text
~/KUPACLLC-Apple-Distribution.p12
~/KUPACLLC-Mac-Installer-Distribution.p12
~/KUPACLLC-Developer-ID-Application.p12
```

プロファイルは `~/.config/web2md/signing/profiles/` に配置します。
このディレクトリには、このアプリの親・拡張用の有効なプロファイルを
iOS / macOS 各 1 セットだけ置いてください。名前は任意です。
App ID、Team、プラットフォーム、期限、配布証明書を検証してから
Xcode の UUID 別の登録先へコピーします。

ローカルの `app/scripts/macos/.env.example` を `.env` にコピーし、権限を 600 にして、
証明書のパスワード等を設定します。既存の `ref/macos/.env` にある
PRELIS_APPSTORE_P12_PASSWORD、PRELIS_APPSTORE_INSTALLER_P12_PASSWORD、
PRELIS_GITHUB_P12_PASSWORD、API キー情報もフォールバックとして読み取れます。
優先順位は WEB2MD_ 環境変数、専用 .env、PRELIS_ 環境変数、参照 .env です。

パスワードは SSH の標準入力で渡します。ソーススナップショットに
.env、証明書、秘密鍵、node_modules、ref は含めません。
Mac で一時 Keychain を作成し、終了時に削除して Keychain 検索リストを復元します。
既定 Keychain は変更しません。Web2MD の署名ビルドは排他実行します。
同じ Mac ユーザーで他プロジェクトの Keychain 設定を変更するジョブも、同時に実行しないでください。
異常終了後の `.signing-lock` は、実行中のビルドがないことを確認してから削除します。

## App Store アップロード（別操作）

Mac の `~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8` と、
ローカル設定の WEB2MD_API_KEY_ID / WEB2MD_API_ISSUER_ID を使います。
ビルド時に API 認証情報は不要です。

```bash
cd app
npm run upload:apple -- release/safari/<ビルドID> --platform macos --validate-only
npm run upload:apple -- release/safari/<ビルドID> --platform ios --validate-only

# 以下は検証後、App Store Connect へ実際にアップロードします。
npm run upload:apple -- release/safari/<ビルドID> --platform macos
npm run upload:apple -- release/safari/<ビルドID> --platform ios
```

ローカルと Mac に保持した成果物のハッシュを照合し、選択した OS だけを処理します。
App Store の審査提出・公開操作は別途 App Store Connect で行ってください。

## GitHub 配布用の公証（別操作）

```bash
cd app
npm run notarize:github -- release/safari/<ビルドID>
```

ZIP / DMG を notarytool で送信し、Accepted を確認してチケットを付与します。
公証申請 ID を保存するため、待機がタイムアウトした場合も同じコマンドで再開できます。
公証済み ZIP / DMG とチェックサムは元の公証前成果物を残したまま
`release/safari/<ビルドID>/notarized/` に回収します。
GitHub Releases への公開はこのコマンドには含まれません。

## 確認

```bash
cd app
npm run lint
npm run format
npm run test:apple
npm run build:chrome
npm run build:firefox
```

署名済みビルドの成功と Safari 上の動作確認は別です。
公開前に Mac と iPhone で拡張の有効化、サイト権限、Markdown の保存先・ファイル名を確認してください。
