const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.course.update({
            where: { slug: 'r-statistics-finance' },
            data: {
                lessons: {
                    deleteMany: {},
                }
            }
        })
        console.log("Deleted old lessons");
    } catch (e) {
        console.log("Course might not exist yet");
    }
}
main().finally(() => prisma.$disconnect())
