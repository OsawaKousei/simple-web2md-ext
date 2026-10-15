import type { Metadata } from "next";
import "../globals.css";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { COMPANY_NAME_EN, COMPANY_NAME_JA, SITE_ROOT } from "@/app/_config/site";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const metadata = messages.Metadata as { title?: string; description?: string };
  const canonicalUrl = `${SITE_ROOT}/${locale}/`;
  const companyName = locale === "ja" ? COMPANY_NAME_JA : COMPANY_NAME_EN;
  return {
    metadataBase: new URL(SITE_ROOT),
    applicationName: companyName,
    title: metadata?.title,
    description: metadata?.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ja: `${SITE_ROOT}/ja/`,
        en: `${SITE_ROOT}/en/`,
        "x-default": `${SITE_ROOT}/ja/`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: metadata?.title,
      description: metadata?.description,
      type: "website",
      url: canonicalUrl,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"],
      siteName: companyName,
      images: [
        {
          url: `${SITE_ROOT}/KUPACLLC_logo.png`,
          width: 1080,
          height: 1080,
          alt: locale === "ja" ? `${COMPANY_NAME_JA} ロゴ` : `${COMPANY_NAME_EN} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: metadata?.title,
      description: metadata?.description,
      images: [`${SITE_ROOT}/KUPACLLC_logo.png`],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
