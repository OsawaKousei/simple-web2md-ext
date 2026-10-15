import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "Web to Markdown ブラウザ拡張機能のプライバシーポリシー。",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="site-header wrap">
        <Link className="brand" href="/">
          Web to Markdown
        </Link>
        <nav aria-label="メインナビゲーション">
          <Link href="/">ホーム</Link>
        </nav>
      </header>
      <main className="policy-main wrap">
        <Link className="back-link" href="/">
          ← ホームに戻る
        </Link>
        <h1>プライバシーポリシー</h1>
        <p className="policy-date">制定日：2026年10月12日</p>
        <article>
          <p>
            合同会社KUPAC（以下「当社」）は、ブラウザ拡張機能「Web to
            Markdown」（以下「本拡張機能」）が取り扱うユーザーデータについて、以下のとおり説明します。
          </p>
          <section>
            <h2>1. 適用範囲と機能</h2>
            <p>
              本ポリシーは本拡張機能に適用されます。本拡張機能は、ユーザーがツールバーのアイコンをクリックしたときに、開いているタブのウェブページをMarkdownに変換し、端末に{" "}
              <code>.md</code> ファイルとして保存します。
            </p>
          </section>
          <section>
            <h2>2. 取り扱うデータと利用目的</h2>
            <p>
              ユーザーが変換を指示したタブのページ内容、ページタイトルおよびURLを、本文の抽出、Markdownへの変換、リンクや画像の参照先の変換、ファイル名の作成に必要な範囲でブラウザ内で処理します。ページ内容には個人情報が含まれる場合があります。
            </p>
            <p>
              変換結果はユーザーの端末のダウンロード先に保存されます。閲覧履歴を継続的に収集したり、広告、行動分析、追跡にページ内容を利用したりしません。アカウントの作成やログインは必要ありません。
            </p>
          </section>
          <section>
            <h2>3. 権限の用途</h2>
            <ul>
              <li>
                <code>activeTab</code>
                ：アイコンをクリックしたタブに一時的にアクセスします。
              </li>
              <li>
                <code>scripting</code>
                ：そのタブでページ本文を抽出し、Markdownに変換するスクリプトを実行します。
              </li>
            </ul>
            <p>
              ファイルの保存には、ページ上で生成したファイルのダウンロードリンクを使用します。
              <code>downloads</code>{" "}
              権限は要求しません。すべてのウェブサイトへの常時アクセス権も要求しません。変換用コードとライブラリは拡張機能に同梱しており、リモートコードは使用しません。
            </p>
          </section>
          <section>
            <h2>4. 外部への送信・共有</h2>
            <p>
              ページ内容、タイトル、URLおよび変換結果を当社または第三者のサーバーへ送信しません。広告・アクセス解析のためのSDKも使用せず、これらのデータを第三者へ販売・共有しません。当社の担当者が、処理したページ内容や変換結果を閲覧することもありません。
            </p>
            <p>
              ユーザーが保存ファイルを共有した場合や、ブラウザ・端末側の同期設定により別のサービスへ保存された場合は、そのサービスの設定とポリシーに従います。
            </p>
          </section>
          <section>
            <h2>5. 保存期間・削除と安全管理</h2>
            <p>
              ページ内容は変換のためにブラウザ内で一時的に処理します。当社はページ内容や変換結果を収集・保存しないため、当社側に削除対象のデータはありません。ダウンロードしたファイルはユーザーが端末上で管理・削除できます。
            </p>
          </section>
          <section>
            <h2>6. 限定的な使用</h2>
            <p>
              ユーザーデータの利用は、ユーザーが指示したページをMarkdownファイルとして保存する機能の提供に限定します。広告、信用力の判断、融資など、機能と無関係な目的には利用しません。
            </p>
          </section>
          <section>
            <h2>7. お問い合わせ</h2>
            <p>
              お問い合わせをいただいた場合、送信元のメールアドレス、内容および任意で提供された情報を回答と対応のために取り扱います。お問い合わせ情報については
              <a href="https://www.kupac.co.jp/privacy/general/">
                当社の一般的なプライバシーポリシー
              </a>
              もご確認ください。件名または本文に「Web to
              Markdown」とご記載ください。
            </p>
            <address>
              合同会社KUPAC 個人情報お問い合わせ窓口
              <br />
              <a href="mailto:contact@kupac.co.jp">contact@kupac.co.jp</a>
            </address>
            <p>
              製品については
              <a
                href="https://forms.gle/vuYW9xgBGa9h6E956"
                target="_blank"
                rel="noopener noreferrer"
              >
                お問い合わせフォーム
              </a>
              からもご連絡いただけます。
            </p>
          </section>
          <section>
            <h2>8. ポリシーの変更</h2>
            <p>
              機能やデータの取り扱いを変更する場合は、変更内容と施行日を本ページに掲載します。必要な場合は拡張機能内でも事前に説明し、同意を得ます。
            </p>
          </section>
        </article>
      </main>
      <footer className="site-footer wrap">
        <span>© 2026 KUPAC LLC</span>
        <Link href="/">ホーム</Link>
      </footer>
    </>
  );
}
