
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const lesson = await prisma.lesson.findFirst({
        select: { id: true, title: true }
    });
    console.log(JSON.stringify(lesson, null, 2));
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
