import { LINKS } from "@/app/_config/links";
import { COMPANY_NAME_JA } from "@/app/_config/site";

export function PrivacyContact() {
  return (
    <address className="privacy-contact">
      {COMPANY_NAME_JA} 個人情報お問い合わせ窓口<br />
      <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
    </address>
  );
}

export default function PolicyDocument({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="site-container privacy-container">
      <nav className="privacy-breadcrumb" aria-label="パンくずリスト"><a href="/ja/">ホーム</a><span aria-hidden="true">/</span><a href="/privacy/">プライバシーに関する文書</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <article className="policy-document">
        <header className="privacy-heading">
          <h1>{title}</h1>
          <p className="privacy-date">制定日：<time dateTime="2026-10-12">2026年10月12日</time></p>
        </header>
        {children}
      </article>
      <a className="text-link privacy-back-link" href="/privacy/">プライバシーに関する文書の一覧へ戻る</a>
    </div>
  );
}
