/** @type {import('next-sitemap').IConfig} */

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xpac.or.jp';
const locales = ['ja', 'en'];
const defaultLocale = 'ja';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
  
  // SSGでtrailingSlashを使用しているため
  trailingSlash: true,
  
  // ルートページ（リダイレクト用）を除外
  exclude: ['/'],
  
  // robots.txtの設定
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  
  // URLの変換（各言語ページにalternateを適用）
  transform: async (config, path) => {
    // ルートページは除外済みなのでスキップ
    if (path === '/') return null;
    
    // パスから現在のロケールとページパスを抽出
    // 例: /ja/about/ -> locale: 'ja', pagePath: '/about/'
    const match = path.match(/^\/(ja|en)(\/.*)?$/);
    if (!match) return null;
    
    const pagePath = match[2] || '/';
    
    // 各ロケールに対応するalternateRefsを動的に生成
    // hrefIsAbsolute: true でパスの自動追加を防止
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
      changefreq: 'weekly',
      priority: path.match(/^\/(ja|en)\/$/) ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
      alternateRefs,
    };
  },
};
