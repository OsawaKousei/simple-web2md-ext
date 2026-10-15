import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  return (
    <footer className="footer">
      <div className="site-container footer-inner">
        <a className="brand footer-brand" href={`/${locale}/#top`}><Image src="/KUPACLLC_logo.png" alt="" width={42} height={42} /><span>{t("companyName")}</span></a>
        <a className="footer-policy-link" href="/privacy/" hrefLang="ja">{t("privacy")}</a>
        <p>{t("copyright")}</p>
      </div>
    </footer>
  );
}
