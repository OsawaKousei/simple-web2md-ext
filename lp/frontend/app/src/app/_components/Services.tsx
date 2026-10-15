import { useTranslations } from "next-intl";

const services = [
  { key: "development", code: "01" },
  { key: "consulting", code: "02" },
  { key: "hr", code: "03" },
  { key: "research", code: "04" },
] as const;

export default function Services() {
  const t = useTranslations("Services");
  return (
    <section id="services" className="section services-section" aria-labelledby="services-title">
      <div className="site-container">
        <div className="section-heading"><p className="section-number">02</p><p className="eyebrow"><span /> BUSINESS</p><h2 id="services-title">{t("title")}</h2><p>{t("lead")}</p></div>
        <div className="service-grid">
          {services.map(({ key, code }) => (
            <article className="service-card" key={key}>
              <div className="service-card-top">
                <span className="service-icon" aria-hidden="true">{code}</span>
                <span className="service-code">SERVICE / {code}</span>
              </div>
              <h3>{t(`${key}.title`)}</h3><p>{t(`${key}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
