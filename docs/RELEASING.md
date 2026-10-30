# リリース管理メモ

## 次回は 1.2 / 1.2.0

2026年10月31日の方針：**次回リリースは Chrome / Edge / Firefox を `1.2`、Safari・npm パッケージを `1.2.0` とする。**
GitHub のタグ候補は `v1.2.0`。今回はまだソースのバージョンを `1.2` に変更しない。

| 更新対象                                           | 次回の値 |
| -------------------------------------------------- | -------- |
| `app/public/manifest.chrome.json`（Edge と共用）   | `1.2`    |
| `app/public/manifest.firefox.json`                 | `1.2`    |
| `app/public/manifest.safari.json`                  | `1.2.0`  |
| `app/package.json`                                 | `1.2.0`  |
| `app/package-lock.json` のルート・ルートパッケージ | `1.2.0`  |
| App Store Connect の macOS / iOS バージョン        | `1.2.0`  |

Safari のビルドスクリプトは、Safari manifest と package.json のバージョンが一致することを検証する。
次回は App Store Connect の表示版とネイティブアプリの内部バージョンも揃える。
提出済みのものより大きいビルド番号で再ビルドし、その成果物に対して公証とアップロードを行う。

## 今回の 1.1

- Chrome / Edge / Firefox：拡張バージョン `1.1`。
- Safari：App Store Connect では `1.1` 登録済み（2026年10月31日、ユーザー確認）。今回この表示はそのまま使用する。
- 公証済み Mac アプリ：内部バージョン `1.0.0`、ビルド `2494.16.15`、ビルド ID `20261030T161516Z-6124befa`。
- 現在の Safari manifest / npm パッケージは次のビルド用に `1.1.0` だが、今回の Mac 配布物は既に公証済みの上記ビルドを使用する。

リリース本文は [releases/1.1.md](releases/1.1.md)。GitHub に貼り付ける文章だけを記載している。
添付する成果物と本文のコピーは `app/release/github/1.1/` にまとめている。

### GitHub のタグ

既存の [v1.1 リリース](https://github.com/OsawaKousei/simple-web2md-ext/releases/tag/v1.1) は 2026年10月12日の別リリース。
今回のタグ候補は **`v1.1.0`**、表示タイトルは **`Web to Markdown 1.1`** とする。
既存タグの差し替えや既存アセットの上書きは行わない。
公開時には今回の変更を含むコミットをタグの対象に指定する。

### 添付ファイル

`app/release/github/1.1/` の以下のファイルを添付する。

- `simple-web2md-ext-1.1-chrome-edge.zip`
- `simple-web2md-ext-1.1-chrome.crx`
- `simple-web2md-ext-1.1-firefox.zip`
- `simple-web2md-ext-1.1-firefox-source.zip`
- `WebToMarkdown-1.0.0-2494.16.15-github.dmg`
- `WebToMarkdown-1.0.0-2494.16.15-github.app.zip`
- `SHA256SUMS`

同じフォルダーの `RELEASE.md` をリリース本文に使う。Mac の添付物は `notarized/` から取得している。
Chrome Web Store は Verified CRX Uploads のため、登録済みの鍵で署名した `.crx` を提出する。Edge は `.zip` を使用する。
`build-info.json`、`submissions.json`、署名用ファイルなどの作業用情報は添付しない。

元ファイルの場所：

- ブラウザ用：`app/release/stores/1.1/`
- Mac 用：`app/release/safari/20261030T161516Z-6124befa/notarized/`

この作業では本文と添付ファイルの準備までを行い、GitHub のタグ作成・リリース公開は実行していない。
