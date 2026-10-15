import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.xpac.or.jp';

export const metadata: Metadata = {
  metadataBase: new URL(domain),
  title: 'XPAC | 一般社団法人次世代フィジカルAI育成機構',
  description: 'XPAC（一般社団法人次世代フィジカルAI育成機構）の公式サイトです。',
  alternates: {
    canonical: `${domain}/ja/`,
    languages: {
      ja: `${domain}/ja/`,
      en: `${domain}/en/`,
      'x-default': `${domain}/ja/`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootPage() {
  redirect('/ja/');
}
