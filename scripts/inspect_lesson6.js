const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function main() {
    let lesson;
    for (let i = 1; i <= 5; i++) {
        try {
            console.log(`Tentative de connexion DB (${i}/5)...`);
            lesson = await prisma.lesson.findFirst({
                where: { order: 6, course: { slug: 'python-automatisation-excel-word' } },
                include: { contents: { orderBy: { order: 'asc' } } }
            });
            break;
        } catch (e) {
            console.log(`Échec (${e.message}). Nouveau test dans 3s...`);
            await sleep(3000);
        }
    }
    if (!lesson) {
        console.error("Impossible de récupérer la leçon.");
        return;
    }
    console.log('Lesson:', lesson.title);
    lesson.contents.forEach((c, idx) => {
        console.log(`=== Block ${idx+1}: ${c.title} (${c.contentType}) ===`);
        console.log(c.content.substring(0, 350) + '\n');
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
