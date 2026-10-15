'use client';

import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');

  return (
    <section id="overview" className="py-20 bg-[color:var(--background)]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-emerald-950 mb-4 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-emerald-900/75 text-lg max-w-3xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[color:var(--border)] p-6 md:p-10">
            <dl className="space-y-5">
              <div className="grid md:grid-cols-[220px_1fr] gap-3 items-start">
                <dt className="text-sm font-semibold tracking-wide text-emerald-800/90">{t('nameLabel')}</dt>
                <dd className="text-emerald-950">{t('nameValue')}</dd>
              </div>
              <div className="grid md:grid-cols-[220px_1fr] gap-3 items-start">
                <dt className="text-sm font-semibold tracking-wide text-emerald-800/90">{t('akaLabel')}</dt>
                <dd className="text-emerald-950">{t('akaValue')}</dd>
              </div>
              <div className="grid md:grid-cols-[220px_1fr] gap-3 items-start">
                <dt className="text-sm font-semibold tracking-wide text-emerald-800/90">{t('foundedLabel')}</dt>
                <dd className="text-emerald-950">{t('foundedValue')}</dd>
              </div>
              <div className="grid md:grid-cols-[220px_1fr] gap-3 items-start">
                <dt className="text-sm font-semibold tracking-wide text-emerald-800/90">{t('addressLabel')}</dt>
                <dd className="text-emerald-950 leading-relaxed">{t('addressValue')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
