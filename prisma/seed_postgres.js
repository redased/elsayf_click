const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PostgreSQL database...\n');

  // 1. Create Settings
  console.log('Creating settings...');
  await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      aiProvider: 'gemini',
      googleAnalyticsEnabled: false,
      twitchEnabled: false
    }
  });

  // 2. Create Super Admin
  console.log('Creating super admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'progdev97@gmail.com' },
    update: {},
    create: {
      email: 'progdev97@gmail.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  });

  // 3. Create test users
  console.log('Creating test users...');
  const testUsers = [
    { email: 'progdev99@gmail.com', name: 'Test Student', role: 'STUDENT' },
    { email: 'sedratir@gmail.com', name: 'Admin User', role: 'ADMIN' },
  ];

  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: hashedPassword }
    });
  }

  // 4. Create Courses
  console.log('Creating courses...');
  const courses = [
    {
      id: 'course-google-sheets',
      title: 'Google Sheets: De Zéro à l\'Expert',
      slug: 'google-sheets-mastery',
      description: 'Maîtrisez Google Sheets sans programmation',
      level: 'Tous niveaux',
      duration: '20h',
      price: 0,
      isFree: true,
      isPublished: true
    },
    {
      id: 'course-python-novice',
      title: 'Python pour Débutants',
      slug: 'python-novice',
      description: 'Apprenez Python de zéro',
      level: 'Débutant',
      duration: '15h',
      price: 0,
      isFree: true,
      isPublished: true
    },
    {
      id: 'course-python-integral',
      title: 'Python Intégral',
      slug: 'python-integral',
      description: 'Formation Python complète',
      level: 'Intermédiaire',
      duration: '40h',
      price: 15000,
      isFree: false,
      isPublished: true
    },
    {
      id: 'course-r-stats',
      title: 'R pour Statistiques & Finance',
      slug: 'r-statistics-finance',
      description: 'Statistiques avancées avec R',
      level: 'Avancé',
      duration: '25h',
      price: 0,
      isFree: true,
      isPublished: true
    }
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course
    });
  }

  // 5. Create Lessons for each course
  console.log('Creating lessons...');
  const googleSheetsLessons = [
    { title: 'Introduction à Google Sheets', duration: 30, order: 1, content: 'Découvrez les bases de Google Sheets' },
    { title: 'Formules et fonctions', duration: 45, order: 2, content: 'Les formules essentielles' },
    { title: 'Tableaux croisés dynamiques', duration: 60, order: 3, content: 'Créez des TCD puissants' },
  ];

  for (const lesson of googleSheetsLessons) {
    await prisma.lesson.upsert({
      where: { id: `lesson-gs-${lesson.order}` },
      update: {},
      create: {
        id: `lesson-gs-${lesson.order}`,
        ...lesson,
        courseId: 'course-google-sheets'
      }
    });
  }

  const pythonLessons = [
    { title: 'Variables et types de données', duration: 40, order: 1, content: 'Les bases de Python' },
    { title: 'Conditions et boucles', duration: 50, order: 2, content: 'Structures de contrôle' },
    { title: 'Fonctions', duration: 45, order: 3, content: 'Créez vos propres fonctions' },
  ];

  for (const lesson of pythonLessons) {
    await prisma.lesson.upsert({
      where: { id: `lesson-py-${lesson.order}` },
      update: {},
      create: {
        id: `lesson-py-${lesson.order}`,
        ...lesson,
        courseId: 'course-python-novice'
      }
    });
  }

  // 6. Enroll all users in all free courses
  console.log('Creating enrollments...');
  const users = await prisma.user.findMany();
  const freeCourses = await prisma.course.findMany({ where: { isFree: true } });

  for (const user of users) {
    for (const course of freeCourses) {
      await prisma.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          courseId: course.id,
          enrollmentType: 'FREE'
        }
      });
    }
  }

  // 7. Newsletter subscribers
  console.log('Creating newsletter subscribers...');
  const emails = [
    'm.ouenzar@yahoo.com',
    'katia.ach111@gmail.com',
    'yasminebenounnas99@gmail.com',
    'zidounihssene2003@gmail.com',
    'lforthopedagogue@gmail.com',
  ];

  for (const email of emails) {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, source: 'manual' }
    });
  }

  console.log('\n✅ Seeding completed!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${courses.length} courses`);
  console.log(`Created ${emails.length} newsletter subscribers`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
