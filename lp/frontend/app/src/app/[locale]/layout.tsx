import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { routing } from '@/navigation';
import '../globals.css';

const domain = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.xpac.or.jp';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const localizedUrl = `${domain}/${locale}/`;
  const localeCode = locale === 'ja' ? 'ja_JP' : 'en_US';
  
  return {
    metadataBase: new URL(domain),
    applicationName: 'XPAC',
    title: messages.Metadata.title,
    description: messages.Metadata.description,
    keywords: [
      'XPAC',
      '一般社団法人次世代フィジカルAI育成機構',
      '一般社団法人次世代フィジカルＡＩ育成機構',
      '次世代フィジカルAI',
      'Physical AI',
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    icons: {
      icon: '/xpac_icon.png',
      shortcut: '/xpac_icon.png',
      apple: '/xpac_icon.png'
    },
    alternates: {
      canonical: localizedUrl,
      languages: {
        ja: `${domain}/ja/`,
        en: `${domain}/en/`,
        'x-default': `${domain}/ja/`,
      },
    },
    openGraph: {
      title: messages.Metadata.title,
      description: messages.Metadata.description,
      url: localizedUrl,
      siteName: messages.Header.company,
      images: [
        {
          url: `${domain}/xpac_logo.png`,
          width: 1200,
          height: 630,
          alt: messages.Metadata.title,
        },
      ],
      locale: localeCode,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.Metadata.title,
      description: messages.Metadata.description,
      images: [`${domain}/xpac_logo.png`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const messages = await getMessages();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = messages as any;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.Header?.company || 'XPAC',
    legalName: '一般社団法人次世代フィジカルAI育成機構',
    alternateName: [
      '一般社団法人次世代フィジカルＡＩ育成機構',
      '一般社団法人次世代フィジカルAI育成機構',
      'XPAC',
      'クロスパック',
      'Next-Generation Physical AI Consortium',
    ],
    url: domain,
    logo: `${domain}/xpac_logo_2.png`,
    description: t.Metadata?.description,
    email: 'contact@xpac.or.jp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '京都大学国際科学イノベーション棟西館104 ベンチャーインキュベーションセンター内',
      addressLocality: '京都市左京区吉田本町36番地1',
      addressRegion: '京都府',
      postalCode: '606-8317',
      addressCountry: 'JP',
    },
  };

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
