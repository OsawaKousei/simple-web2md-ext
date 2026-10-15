'use client';

import { useTranslations } from 'next-intl';

export default function Contents() {
  const t = useTranslations('Contents');

  return (
    <section id="business" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-emerald-950 mb-4 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-emerald-900/75 text-lg max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            <article className="rounded-xl border border-[color:var(--border)] bg-white p-7">
              <h3 className="text-xl font-semibold text-emerald-950 mb-3 tracking-tight">{t('communityTitle')}</h3>
              <p className="text-emerald-900/80 leading-relaxed mb-5">{t('communityDesc')}</p>
              <a
                href="https://www.kupac.org/ja/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-900 underline-offset-4 hover:underline"
              >
                {t('communityLink')}
              </a>
            </article>

            <article className="rounded-xl border border-[color:var(--border)] bg-white p-7">
              <h3 className="text-xl font-semibold text-emerald-950 mb-3 tracking-tight">{t('talentTitle')}</h3>
              <p className="text-emerald-900/80 leading-relaxed">{t('talentDesc')}</p>
            </article>

            <article className="rounded-xl border border-[color:var(--border)] bg-white p-7">
              <h3 className="text-xl font-semibold text-emerald-950 mb-3 tracking-tight">{t('innovationTitle')}</h3>
              <p className="text-emerald-900/80 leading-relaxed">{t('innovationDesc')}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
