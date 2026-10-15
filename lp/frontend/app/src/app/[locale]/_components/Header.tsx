'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  return (
    <header className="site-header sticky top-0 z-50 border-b border-[color:var(--border)]">
      <div className="w-full px-4 md:px-8 h-[4.5rem] md:h-20 flex items-center">
        <nav className="flex justify-between items-center w-full gap-4">
          <a href="#top" className="flex items-center gap-3 min-w-0">
            <img src="/xpac_logo_2.png" alt="XPAC logo" className="h-10 w-auto" />
            <span className="hidden lg:block text-xs md:text-sm text-emerald-950/75 truncate tracking-wide">
              {t('company')}
            </span>
          </a>
          <div className="hidden md:flex space-x-7 items-center">
            <a
              href="#overview"
              className="text-sm text-emerald-950/70 hover:text-emerald-900 transition-colors"
            >
              {t('overview')}
            </a>
            <a
              href="#officers"
              className="text-sm text-emerald-950/70 hover:text-emerald-900 transition-colors"
            >
              {t('officers')}
            </a>
            <a
              href="#business"
              className="text-sm text-emerald-950/70 hover:text-emerald-900 transition-colors"
            >
              {t('business')}
            </a>
            <a
              href="#contact"
              className="text-sm border border-emerald-700 text-emerald-800 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors"
            >
              {t('contact')}
            </a>
            <div className="flex space-x-2 ml-1 items-center text-sm">
              <span className="text-emerald-900/60">{t('lang')}</span>
              <Link
                href={pathname}
                locale="ja"
                className="text-emerald-900 hover:text-emerald-700 transition-colors"
              >
                JP
              </Link>
              <span className="text-emerald-900/40">|</span>
              <Link
                href={pathname}
                locale="en"
                className="text-emerald-900 hover:text-emerald-700 transition-colors"
              >
                EN
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
