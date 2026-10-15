import { ArrowUpRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { LINKS } from "../_config/links";

export default function Contact() {
  const t = useTranslations("Contact");
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-grid" aria-hidden="true" />
      <div className="site-container contact-inner">
        <div><p className="section-number">03</p><p className="eyebrow light"><span /> CONTACT</p><h2 id="contact-title">{t("title")}</h2></div>
        <div className="contact-copy"><p>{t("description")}</p><a href={`mailto:${LINKS.email}`} className="contact-button"><span><Mail size={19} /> {t("button")}</span><ArrowUpRight size={20} /></a><p className="contact-email">{LINKS.email}</p></div>
      </div>
    </section>
  );
}
