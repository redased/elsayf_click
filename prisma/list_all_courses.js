require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

p.course.findMany({ select: { id: true, title: true, slug: true, isPublished: true } })
    .then(cs => {
        console.log('\n=== COURS EN BASE ===')
        cs.forEach(c => console.log(`- [${c.isPublished ? 'PUB' : 'DRAFT'}] ${c.slug} | "${c.title}"`))
        console.log('\nTotal :', cs.length, 'cours')
    })
    .catch(console.error)
    .finally(() => p.$disconnect())
