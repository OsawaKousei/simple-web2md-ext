import { setRequestLocale } from "next-intl/server";
import Hero from "@/app/_components/Hero";
import About from "@/app/_components/About";
import Services from "@/app/_components/Services";
import Contact from "@/app/_components/Contact";
import { LINKS } from "@/app/_config/links";
import { COMPANY_NAME_EN, COMPANY_NAME_JA, SITE_ROOT } from "@/app/_config/site";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const websiteName = locale === "ja" ? `${COMPANY_NAME_JA} 公式企業サイト` : `${COMPANY_NAME_EN} Official Corporate Website`;
  // Keep every machine-readable alias tied to the legal entity. Do not add the
  // bare community name "KUPAC" here, because it represents a separate entity.
  const alternateCompanyName = locale === "ja" ? COMPANY_NAME_EN : COMPANY_NAME_JA;
  const description = locale === "ja"
    ? "合同会社KUPACは、AIとロボティクス領域の技術開発および事業支援を行う法人です。"
    : "KUPAC LLC is a company providing technology development and business support in AI and robotics.";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Corporation",
        "@id": `${SITE_ROOT}/#organization`,
        name: COMPANY_NAME_JA,
        legalName: COMPANY_NAME_JA,
        alternateName: COMPANY_NAME_EN,
        disambiguatingDescription: locale === "ja"
          ? "AI・ロボティクス領域の技術開発および事業支援を行う合同会社の公式情報です。"
          : "Official information for the Japanese limited liability company providing AI and robotics technology development and business support.",
        description,
        url: `${SITE_ROOT}/ja/`,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ROOT}/KUPACLLC_logo.png`,
          width: 1080,
          height: 1080,
        },
        email: LINKS.email,
        foundingDate: "2025-10-01",
        address: {
          "@type": "PostalAddress",
          postalCode: "606-8317",
          addressRegion: locale === "ja" ? "京都府" : "Kyoto",
          addressLocality: locale === "ja" ? "京都市左京区" : "Sakyo-ku, Kyoto",
          streetAddress: locale === "ja"
            ? "吉田本町36番地1 京都大学国際科学イノベーション棟西館104 ベンチャーインキュベーションセンター１号室"
            : "Room 1, Venture Incubation Center, West Wing 104, International Science Innovation Building, Kyoto University, 36-1 Yoshidahonmachi",
          addressCountry: "JP",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ROOT}/#website`,
        url: SITE_ROOT,
        name: websiteName,
        alternateName: alternateCompanyName,
        publisher: { "@id": `${SITE_ROOT}/#organization` },
        inLanguage: ["ja", "en"],
      },
    ],
  };
  return <div id="top"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Hero /><About /><Services /><Contact /></div>;
}
