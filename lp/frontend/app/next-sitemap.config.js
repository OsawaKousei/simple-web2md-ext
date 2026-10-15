/** @type {import('next-sitemap').IConfig} */

const siteUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kupac.co.jp').replace(/\/$/, '');
const locales = ['ja', 'en'];
const defaultLocale = 'ja';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  autoLastmod: false,
  outDir: 'out',
  trailingSlash: true,
  exclude: ['/'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  transform: async (config, path) => {
    if (path === '/') return null;
    // Privacy documents are published only in Japanese, outside locale routes.
    if (path === '/privacy' || path.startsWith('/privacy/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.5 };
    }
    const match = path.match(/^\/(ja|en)(\/.*)?$/);
    if (!match) return null;
    const pagePath = match[2] || '/';
    const alternateRefs = [
      ...locales.map((locale) => ({
        href: `${siteUrl}/${locale}${pagePath}`,
        hreflang: locale,
        hrefIsAbsolute: true,
      })),
      {
        href: `${siteUrl}/${defaultLocale}${pagePath}`,
        hreflang: 'x-default',
        hrefIsAbsolute: true,
      },
    ];
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 1.0,
      alternateRefs,
    };
  },
};
