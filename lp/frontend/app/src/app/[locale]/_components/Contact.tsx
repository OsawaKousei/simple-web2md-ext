'use client';

import { useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations('Contact');

  return (
    <section id="contact" className="py-20 bg-[color:var(--background)]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-emerald-950 mb-4 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-emerald-900/75 text-lg">
              {t('description')}
            </p>
          </div>

          <a
            href="mailto:contact@xpac.or.jp"
            className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors"
          >
            {t('button')}
          </a>
          <p className="mt-4 text-sm text-emerald-900/70">{t('note')}</p>
        </div>
      </div>
    </section>
  );
}
