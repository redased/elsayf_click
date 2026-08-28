const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const updated = await prisma.course.update({
        where: { slug: 'python-automatisation-excel-word' },
        data: {
            isFree: true,
            isFreeWithAds: false,
            accessType: 'FREE',
            price: 0,
            priceDZ: 0,
            priceEU: 0,
        },
    });
    console.log('✅ Cours passé en gratuit :');
    console.log(`   ${updated.title}`);
    console.log(`   isFree : ${updated.isFree}`);
    console.log(`   accessType : ${updated.accessType}`);
    console.log(`   price : ${updated.price}`);
}

main()
    .catch((e) => { console.error('❌', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
