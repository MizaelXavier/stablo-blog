// Configurações de SEO para o Closer Brasil
export const defaultSEOConfig = {
  titleTemplate: '%s | Closer Brasil',
  defaultTitle: 'Closer Brasil - Notícias e Análises Exclusivas',
  description: 'Portal de notícias com cobertura jornalística completa e atualizada sobre os principais acontecimentos no Brasil e no mundo.',
  canonical: 'https://closerbrasil.com.br',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://closerbrasil.com.br',
    siteName: 'Closer Brasil',
    images: [
      {
        url: '/img/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Closer Brasil - Portal de Notícias',
      },
    ],
  },
  twitter: {
    handle: '@closerbrasil',
    site: '@closerbrasil',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'notícias brasil, jornalismo, atualidades, política, economia, cultura, tecnologia',
    },
    {
      name: 'author',
      content: 'Closer Brasil',
    },
    {
      name: 'language',
      content: 'pt-BR',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'alternate',
      hrefLang: 'pt-BR',
      href: 'https://closerbrasil.com.br',
    },
  ],
}; 