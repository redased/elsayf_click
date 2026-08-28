const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Temporairement utiliser SQLite
const prisma = new PrismaClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } }
});

async function exportData() {
  console.log('📦 Export des données SQLite...\n');

  const data = {
    users: await prisma.user.findMany({ include: { adminPermission: true } }),
    courses: await prisma.course.findMany(),
    lessons: await prisma.lesson.findMany(),
    courseContents: await prisma.courseContent.findMany(),
    quizzes: await prisma.quiz.findMany(),
    questions: await prisma.question.findMany(),
    answers: await prisma.answer.findMany(),
    enrollments: await prisma.courseEnrollment.findMany(),
    courseProgress: await prisma.courseProgress.findMany(),
    lessonProgress: await prisma.userLessonProgress.findMany(),
    affiliateLinks: await prisma.affiliateLink.findMany(),
    affiliateClicks: await prisma.affiliateClick.findMany(),
    payments: await prisma.payment.findMany(),
    settings: await prisma.settings.findMany(),
    faculties: await prisma.faculty.findMany(),
    pythonRegistrations: await prisma.pythonRegistration.findMany(),
    newsletters: await prisma.newsletterSubscriber.findMany(),
  };

  fs.writeFileSync('prisma/sqlite_export.json', JSON.stringify(data, null, 2));

  console.log('✅ Export terminé: prisma/sqlite_export.json\n');
  console.log('Statistiques:');
  Object.entries(data).forEach(([key, val]) => {
    console.log(`  - ${key}: ${val.length}`);
  });

  await prisma.$disconnect();
}

exportData().catch(console.error);
