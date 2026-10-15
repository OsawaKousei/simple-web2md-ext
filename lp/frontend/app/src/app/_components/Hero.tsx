import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />
      <div className="site-container hero-inner">
        <div className="hero-copy">
          <div className="hero-brand-lockup">
            <Image src="/KUPACLLC_logo.png" alt="" width={76} height={76} priority />
            <div><p className="hero-company">{t("companyName")}</p></div>
          </div>
          <p className="eyebrow"><span /> AI × ROBOTICS</p>
          <h1 id="hero-title">{t("headline")}</h1>
          <p className="hero-description">{t("description")}</p>
          <a href="#services" className="text-link">{t("cta")} <ArrowDownRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-ring ring-outer" /><div className="visual-ring ring-inner" />
          <div className="visual-axis axis-x" /><div className="visual-axis axis-y" />
          <div className="visual-core" />
          <span className="node node-one" /><span className="node node-two" /><span className="node node-three" />
          <span className="visual-label label-ai">AI / 01</span><span className="visual-label label-robotics">ROBOTICS / 02</span>
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">01 — 04</div>
    </section>
  );
}
