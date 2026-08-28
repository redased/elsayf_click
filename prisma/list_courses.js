require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient({
    datasources: { db: { url: "postgresql://neondb_owner:npg_0sbNrcknMjy7@ep-shiny-glade-agld3qhw-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30" } }
})
p.course.findMany({ select: { id: true, title: true, slug: true, isPublished: true, isFree: true, price: true } })
    .then(cs => {
        console.log('\n=== COURS EN BASE ===')
        cs.forEach(c => console.log(`- [${c.isPublished ? 'PUB' : 'DRAFT'}] ${c.slug} | "${c.title}" | ${c.isFree ? 'GRATUIT' : c.price + ' DZD'}`))
        console.log('\nTotal :', cs.length, 'cours')
    })
    .finally(() => p.$disconnect())
