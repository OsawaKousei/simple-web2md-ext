import type { Metadata } from "next";
import { COMPANY_NAME_JA, SITE_ROOT } from "@/app/_config/site";

export const metadata: Metadata = {
  title: COMPANY_NAME_JA,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_ROOT}/ja/`,
  },
};

export default function RootPage() {
  return (
    <html lang="ja">
      <head>
        <meta httpEquiv="refresh" content="0; url=/ja/" />
      </head>
      <body>
        <p><a href="/ja/">{COMPANY_NAME_JA}の公式サイトへ移動</a></p>
      </body>
    </html>
  );
}
