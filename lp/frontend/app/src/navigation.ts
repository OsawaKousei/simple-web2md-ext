import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// ルーティング設定
export const routing = defineRouting({
  locales: ['ja', 'en'],
  defaultLocale: 'ja'
});

export type Locale = (typeof routing.locales)[number];
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

// ナビゲーションヘルパー
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);