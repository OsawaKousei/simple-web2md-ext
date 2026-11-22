import type { Metadata } from "next";
import "./globals.css";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://web2md.prj.kupac.co.jp";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Web to Markdown | ページをワンクリックで保存",
    template: "%s | Web to Markdown",
  },
  description:
    "閲覧中のウェブページをMarkdownファイルに保存。Chrome、Edge、Firefox、Safari対応のブラウザ拡張機能。Safari版はMac・iPhone・iPad向けにApp Storeで公開中。",
  alternates: { canonical: "/" },
  icons: { icon: "/icon_128.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
