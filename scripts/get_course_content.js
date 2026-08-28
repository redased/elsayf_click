const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findUnique({
        where: { slug: 'python-integral' },
        include: {
            lessons: {
                orderBy: { order: 'asc' },
                include: {
                    contents: true
                }
            }
        }
    });

    if (!course) {
        console.error('Course not found');
        return;
    }

    console.log('Course ID:', course.id);
    console.log('Course Title:', course.title);
    console.log('Course Description:', course.description);

    for (const lesson of course.lessons) {
        console.log('---');
        console.log('Lesson Title:', lesson.title);
        console.log('Lesson Content (main):', lesson.content);
        console.log('Lesson Content (AR):', lesson.content_ar);
        console.log('Lesson Content (EN):', lesson.content_en);
        if (lesson.contents && lesson.contents.length > 0) {
            console.log('Sub-contents:');
            for (const c of lesson.contents) {
                console.log(`  - [${c.contentType}] ${c.title}: ${c.content.substring(0, 100)}...`);
            }
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
