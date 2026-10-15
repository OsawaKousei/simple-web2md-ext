'use client';

import { useTranslations } from 'next-intl';

export default function Officers() {
  const t = useTranslations('Officers');

  const members = [
    {
      role: t('representative'),
      name: t('osawa'),
      affiliation: t('osawaAffiliation'),
      image: '/osawa_pic.jpg'
    },
    {
      role: t('director'),
      name: t('yagi'),
      affiliation: t('yagiAffiliation'),
      image: '/yagi_pic.jpg'
    },
    {
      role: t('director'),
      name: t('hiratuka'),
      affiliation: t('hiratukaAffiliation'),
      image: '/hiratuka_pic.jpg'
    }
  ];

  return (
    <section id="officers" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-emerald-950 mb-4 tracking-tight">{t('title')}</h2>
            <p className="text-emerald-900/75 text-lg max-w-3xl mx-auto">{t('description')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {members.map((member) => (
              <article
                key={member.name}
                className="rounded-xl border border-[color:var(--border)] bg-white p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-36 w-36 object-cover rounded-full mx-auto mb-5 border border-[color:var(--border)]"
                />
                <p className="text-sm text-emerald-800/90 font-semibold mb-2 tracking-wide">{member.role}</p>
                <h3 className="text-xl text-emerald-950 font-semibold">{member.name}</h3>
                <p className="mt-2 text-sm text-emerald-900/75 leading-relaxed whitespace-pre-line">{member.affiliation}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
