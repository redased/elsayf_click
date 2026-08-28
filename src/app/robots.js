const BASE_URL = 'https://elsayf.click';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/courses',
          '/courses/',
          '/pricing',
          '/formation-ia',
          '/register',
          '/login',
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
