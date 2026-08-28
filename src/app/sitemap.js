import prisma from '@/lib/prisma';

const BASE_URL = 'https://elsayf.click';

export default async function sitemap() {
  // Pages statiques publiques
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/formation-ia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/register/python`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Pages dynamiques : cours publics
  let coursePages = [];
  try {
    const courses = await prisma.course.findMany({
      select: { slug: true, updatedAt: true },
    });
    coursePages = courses.map((course) => ({
      url: `${BASE_URL}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (e) {
    // DB indisponible lors du build statique
  }

  return [...staticPages, ...coursePages];
}
