const { PrismaClient } = require('@prisma/client');

// SQLite source
const sqliteClient = new PrismaClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } }
});

// PostgreSQL destination
const postgresClient = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function migrate() {
  console.log('🚀 Migration SQLite → PostgreSQL\n');

  try {
    // 1. Users
    console.log('📦 Migration des utilisateurs...');
    const users = await sqliteClient.user.findMany({
      include: { adminPermission: true }
    });
    for (const user of users) {
      const { adminPermission, ...userData } = user;
      await postgresClient.user.create({ data: userData });
      if (adminPermission) {
        await postgresClient.adminPermission.create({
          data: { ...adminPermission, userId: user.id }
        });
      }
    }
    console.log(`✅ ${users.length} utilisateurs migrés\n`);

    // 2. Courses
    console.log('📦 Migration des cours...');
    const courses = await sqliteClient.course.findMany();
    for (const course of courses) {
      await postgresClient.course.create({ data: course });
    }
    console.log(`✅ ${courses.length} cours migrés\n`);

    // 3. Lessons
    console.log('📦 Migration des leçons...');
    const lessons = await sqliteClient.lesson.findMany();
    for (const lesson of lessons) {
      await postgresClient.lesson.create({ data: lesson });
    }
    console.log(`✅ ${lessons.length} leçons migrées\n`);

    // 4. CourseContent
    console.log('📦 Migration des contenus de cours...');
    const contents = await sqliteClient.courseContent.findMany();
    for (const content of contents) {
      await postgresClient.courseContent.create({ data: content });
    }
    console.log(`✅ ${contents.length} contenus migrés\n`);

    // 5. Quizzes
    console.log('📦 Migration des quiz...');
    const quizzes = await sqliteClient.quiz.findMany();
    for (const quiz of quizzes) {
      await postgresClient.quiz.create({ data: quiz });
    }
    console.log(`✅ ${quizzes.length} quiz migrés\n`);

    // 6. Questions
    console.log('📦 Migration des questions...');
    const questions = await sqliteClient.question.findMany();
    for (const question of questions) {
      await postgresClient.question.create({ data: question });
    }
    console.log(`✅ ${questions.length} questions migrées\n`);

    // 7. Answers
    console.log('📦 Migration des réponses...');
    const answers = await sqliteClient.answer.findMany();
    for (const answer of answers) {
      await postgresClient.answer.create({ data: answer });
    }
    console.log(`✅ ${answers.length} réponses migrées\n`);

    // 8. CourseEnrollments
    console.log('📦 Migration des inscriptions...');
    const enrollments = await sqliteClient.courseEnrollment.findMany();
    for (const enrollment of enrollments) {
      await postgresClient.courseEnrollment.create({ data: enrollment });
    }
    console.log(`✅ ${enrollments.length} inscriptions migrées\n`);

    // 9. CourseProgress
    console.log('📦 Migration de la progression...');
    const progress = await sqliteClient.courseProgress.findMany();
    for (const p of progress) {
      await postgresClient.courseProgress.create({ data: p });
    }
    console.log(`✅ ${progress.length} progressions migrées\n`);

    // 10. UserLessonProgress
    console.log('📦 Migration progression leçons...');
    const lessonProgress = await sqliteClient.userLessonProgress.findMany();
    for (const lp of lessonProgress) {
      await postgresClient.userLessonProgress.create({ data: lp });
    }
    console.log(`✅ ${lessonProgress.length} progressions leçons migrées\n`);

    // 11. AffiliateLinks
    console.log('📦 Migration des liens affiliés...');
    const affiliateLinks = await sqliteClient.affiliateLink.findMany();
    for (const link of affiliateLinks) {
      await postgresClient.affiliateLink.create({ data: link });
    }
    console.log(`✅ ${affiliateLinks.length} liens affiliés migrés\n`);

    // 12. AffiliateClicks
    console.log('📦 Migration des clics affiliés...');
    const clicks = await sqliteClient.affiliateClick.findMany();
    for (const click of clicks) {
      await postgresClient.affiliateClick.create({ data: click });
    }
    console.log(`✅ ${clicks.length} clics affiliés migrés\n`);

    // 13. Payments
    console.log('📦 Migration des paiements...');
    const payments = await sqliteClient.payment.findMany();
    for (const payment of payments) {
      await postgresClient.payment.create({ data: payment });
    }
    console.log(`✅ ${payments.length} paiements migrés\n`);

    // 14. Settings
    console.log('📦 Migration des paramètres...');
    const settings = await sqliteClient.settings.findMany();
    for (const setting of settings) {
      await postgresClient.settings.create({ data: setting });
    }
    console.log(`✅ ${settings.length} paramètres migrés\n`);

    // 15. Faculty
    console.log('📦 Migration des facultés...');
    const faculties = await sqliteClient.faculty.findMany();
    for (const faculty of faculties) {
      await postgresClient.faculty.create({ data: faculty });
    }
    console.log(`✅ ${faculties.length} facultés migrées\n`);

    // 16. PythonRegistration
    console.log('📦 Migration des inscriptions Python...');
    const pythonRegs = await sqliteClient.pythonRegistration.findMany();
    for (const reg of pythonRegs) {
      await postgresClient.pythonRegistration.create({ data: reg });
    }
    console.log(`✅ ${pythonRegs.length} inscriptions Python migrées\n`);

    // 17. NewsletterSubscriber
    console.log('📦 Migration des abonnés newsletter...');
    const newsletters = await sqliteClient.newsletterSubscriber.findMany();
    for (const sub of newsletters) {
      await postgresClient.newsletterSubscriber.create({ data: sub });
    }
    console.log(`✅ ${newsletters.length} abonnés newsletter migrés\n`);

    console.log('🎉 Migration terminée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

migrate();
