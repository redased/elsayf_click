const BASE_URL = 'https://elsayf.click';

export default function robots() {
  return {
    rules: [
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: [
          '/',
          '/courses',
          '/courses/',
          '/pricing',
          '/formation-ia',
          '/cv',
          '/privacy',
          '/terms',
          '/about',
          '/contact',
          '/register',
          '/login',
          '/ads.txt',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/super-admin/',
          '/api/',
          '/auth-redirect',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
