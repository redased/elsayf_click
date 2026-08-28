const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  const courses = await prisma.course.findMany({ select: { id: true, slug: true, isFree: true } });

  let added = 0, skipped = 0;
  for (const user of users) {
    for (const course of courses) {
      try {
        await prisma.courseEnrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            enrollmentType: course.isFree ? 'FREE' : 'GRANTED'
          }
        });
        added++;
      } catch(e) {
        if (e.code === 'P2002') skipped++;
        else throw e;
      }
    }
  }
  console.log('Ajoutés:', added, '| Déjà existants:', skipped);

  const enrollments = await prisma.courseEnrollment.findMany({
    include: { user: { select: { email: true } }, course: { select: { slug: true } } }
  });
  const byUser = {};
  enrollments.forEach(e => {
    if (!byUser[e.user.email]) byUser[e.user.email] = [];
    byUser[e.user.email].push(e.course.slug);
  });
  for (const [email, courses] of Object.entries(byUser)) {
    console.log(email, ':', courses.length, 'cours');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
