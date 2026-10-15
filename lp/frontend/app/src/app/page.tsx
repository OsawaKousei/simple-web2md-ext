import Link from "next/link";
import Image from "next/image";

const releaseUrl = "https://github.com/OsawaKousei/simple-web2md-ext/releases";

export default function Home() {
  return (
    <>
      <header className="site-header wrap">
        <Link className="brand" href="/">
          <Image src="/icon_128.png" alt="" width={34} height={34} />
          Web to Markdown
        </Link>
        <nav aria-label="メインナビゲーション">
          <a href="#features">特徴</a>
          <a href="#how-to">使い方</a>
          <Link href="/privacy/">プライバシー</Link>
        </nav>
      </header>
      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">CHROME · EDGE · FIREFOX</p>
            <h1>
              気になったページを、
              <br />
              <span>Markdownで手元に。</span>
            </h1>
            <p className="lead">
              ツールバーのアイコンをクリックするだけ。記事の本文を読みやすいMarkdownに変換し、
              <code>.md</code> ファイルとして保存するブラウザ拡張機能です。
            </p>
            <div className="hero-actions">
              <a
                className="button primary"
                href={releaseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Releases から入手 <span aria-hidden="true">↗</span>
              </a>
              <a className="button secondary" href="#how-to">
                使い方を見る <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="small-note">
              無料・オープンソース。Chrome / Edge / Firefox に対応。
            </p>
          </div>
          <div className="hero-preview">
            <div className="window">
              <div className="window-bar">
                <i />
                <i />
                <i />
                <span>example.com/article</span>
              </div>
              <div className="window-body">
                <p className="mock-label">WEB PAGE</p>
                <div className="mock-heading" />
                <div className="mock-line long" />
                <div className="mock-line" />
                <div className="mock-line short" />
                <div className="mock-image" />
              </div>
            </div>
            <div className="conversion-arrow" aria-hidden="true">
              →
            </div>
            <div className="window code-window">
              <div className="window-bar">
                <i />
                <i />
                <i />
                <span>article.md</span>
              </div>
              <div className="code-body">
                <p>
                  <b>#</b> 記事のタイトル
                </p>
                <p>
                  読みやすい本文を
                  <br />
                  Markdownで保存。
                </p>
                <p>
                  <b>##</b> 見出し
                </p>
                <p>
                  - リンクも画像も
                  <br />- 編集しやすい形式に
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="features section">
          <div className="wrap">
            <p className="eyebrow">WHY WEB TO MARKDOWN</p>
            <h2>保存を、もっとシンプルに。</h2>
            <div className="feature-grid">
              <article>
                <span className="feature-icon">01</span>
                <h3>ワンクリックで保存</h3>
                <p>
                  保存したいページでアイコンを押すだけ。ページタイトルを使ったファイル名でダウンロードします。
                </p>
              </article>
              <article>
                <span className="feature-icon">02</span>
                <h3>記事の本文を抽出</h3>
                <p>
                  Mozilla
                  Readabilityで本文の抽出を試み、見出し・段落・リンク・画像をMarkdownに変換します。
                </p>
              </article>
              <article>
                <span className="feature-icon">03</span>
                <h3>ブラウザ内で処理</h3>
                <p>
                  ページ内容を開発者のサーバーに送信しません。変換したファイルは端末のダウンロード先に保存されます。
                </p>
              </article>
            </div>
          </div>
        </section>
        <section id="how-to" className="section how-to">
          <div className="wrap how-grid">
            <div>
              <p className="eyebrow">HOW IT WORKS</p>
              <h2>
                3ステップで、
                <br />
                あとから使える情報に。
              </h2>
              <p className="section-copy">
                調べもののメモや、あとで編集したい記事の保存に。ブラウザの内部ページなど、拡張機能の実行が許可されていないページでは利用できません。
              </p>
            </div>
            <ol>
              <li>
                <span>1</span>
                <div>
                  <h3>拡張機能を追加</h3>
                  <p>
                    GitHub
                    Releasesからブラウザ用ZIPを入手し、解凍して読み込みます。
                  </p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <h3>ページを開く</h3>
                  <p>保存したいウェブページをブラウザで開きます。</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <h3>アイコンをクリック</h3>
                  <p>Markdownファイルがダウンロードされます。</p>
                </div>
              </li>
            </ol>
          </div>
        </section>
        <section className="cta">
          <div className="wrap cta-inner">
            <div>
              <p className="eyebrow">START SAVING</p>
              <h2>
                ウェブの情報を、
                <br />
                自分のファイルに。
              </h2>
            </div>
            <a
              className="button light"
              href={releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              拡張機能を入手 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer wrap">
        <span>© 2026 KUPAC LLC</span>
        <div>
          <Link href="/privacy/">プライバシーポリシー</Link>
          <a
            href="https://github.com/OsawaKousei/simple-web2md-ext"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </footer>
    </>
  );
}
