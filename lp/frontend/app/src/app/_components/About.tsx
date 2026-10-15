import { useTranslations } from "next-intl";

const profileKeys = ["company", "founded", "address", "representative"] as const;
const historyKeys = ["oct2025", "may2026", "current"] as const;

export default function About() {
  const t = useTranslations("About");
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="site-container">
        <div className="section-heading split-heading">
          <div><p className="section-number">01</p><p className="eyebrow"><span /> COMPANY</p><h2 id="about-title">{t("title")}</h2></div>
          <p>{t("lead")}</p>
        </div>
        <div className="company-layout">
          <dl className="profile-table">
            {profileKeys.map((key) => (
              <div key={key} className="profile-row">
                <dt>{t(`profile.${key}.label`)}</dt>
                <dd className={key === "address" ? "profile-address" : undefined}>{t(`profile.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
          <div className="history">
            <h3>{t("historyTitle")}</h3>
            <ol>
              {historyKeys.map((key) => (
                <li key={key}>
                  <time>{t(`history.${key}.date`)}</time>
                  <p>
                    {key === "oct2025"
                      ? t.rich("history.oct2025.text", {
                          link: (chunks) => <a href="https://www.kupac.org" target="_blank" rel="noopener noreferrer">{chunks}</a>,
                        })
                      : t(`history.${key}.text`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
