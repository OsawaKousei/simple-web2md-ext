import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "合同会社KUPACの一般的なプライバシーポリシー、Google Play向けプライバシーポリシー、Web to Markdownのプライバシーポリシーをご案内します。日本語版のみ提供しています。",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="site-container privacy-container">
      <nav className="privacy-breadcrumb" aria-label="パンくずリスト"><a href="/ja/">ホーム</a><span aria-hidden="true">/</span><span aria-current="page">プライバシーに関する文書</span></nav>
      <header className="privacy-heading">
        <h1>プライバシーに関する文書</h1>
        <p>合同会社KUPACによる個人情報とユーザーデータの取り扱いについて、以下の文書をご確認ください。</p>
        <p className="privacy-language-note">各ポリシーは日本語版のみ提供しています。</p>
      </header>
      <ul className="privacy-document-list">
        <li><a href="/privacy/general/"><h2>一般的なプライバシーポリシー<span aria-hidden="true"> →</span></h2><p>当社ウェブサイト、お問い合わせ、お取引などにおける個人情報の取り扱いについて。</p></a></li>
        <li><a href="/privacy/google-play/"><h2>Google Play向けプライバシーポリシー<span aria-hidden="true"> →</span></h2><p>対象アプリ：Prelis Mobile。アプリにおけるユーザーデータの取り扱いについて。</p></a></li>
        <li><a href="/privacy/chrome-web-store/"><h2>Web to Markdown プライバシーポリシー<span aria-hidden="true"> →</span></h2><p>ブラウザ拡張機能によるページ内容の変換とローカル保存について。</p></a></li>
      </ul>
    </div>
  );
}
