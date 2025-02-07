/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://closerbrasil.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://closerbrasil.com/server-sitemap.xml',
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'],
  alternateRefs: [
    {
      href: 'https://closerbrasil.com',
      hreflang: 'pt-BR',
    },
  ],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }
  },
};
