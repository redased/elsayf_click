require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_0sbNrcknMjy7@ep-shiny-glade-agld3qhw-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30"
        }
    }
})

async function main() {
    const course = await prisma.course.update({
        where: { slug: 'antigravity-business-excel' },
        data: { isFree: true, price: 0 }
    })
    console.log('Cours mis en gratuit : ' + course.title)
    console.log('isFree = ' + course.isFree + ' | price = ' + course.price)
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
