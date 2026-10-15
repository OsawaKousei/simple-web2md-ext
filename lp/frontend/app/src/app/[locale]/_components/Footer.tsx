'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-[#123524] text-emerald-50 py-12 border-t border-emerald-900/40">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <img src="/xpac_logo_2.png" alt="XPAC logo" className="h-9 w-auto mx-auto mb-4 brightness-0 invert" />
        <p className="text-sm text-emerald-100/85 tracking-wide">{t('copyright')}</p>
      </div>
    </footer>
  );
}
