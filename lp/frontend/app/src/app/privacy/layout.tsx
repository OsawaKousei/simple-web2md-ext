import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { COMPANY_NAME_JA, SITE_ROOT } from "@/app/_config/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ROOT),
  title: { default: `プライバシーに関する文書 | ${COMPANY_NAME_JA}`, template: `%s | ${COMPANY_NAME_JA}` },
  robots: { index: true, follow: true },
};

export default async function PrivacyLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale("ja");
  const messages = await getMessages();

  return (
    <html lang="ja">
      <body>
        <NextIntlClientProvider locale="ja" messages={messages}>
          <Header japaneseOnly />
          <main id="top" className="privacy-main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
