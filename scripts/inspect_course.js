const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const c = await prisma.course.findUnique({
        where: { slug: 'python-automatisation-excel-word' },
        include: {
            lessons: {
                orderBy: { order: 'asc' },
                include: { contents: { orderBy: { order: 'asc' } } }
            }
        }
    });
    c.lessons.forEach(l => {
        console.log('\n=== L#' + l.order + ': ' + l.title + ' (' + l.contents.length + ' blocs) ===');
        l.contents.forEach(b => console.log('  [' + b.contentType + '] ' + b.title.substring(0, 80)));
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
