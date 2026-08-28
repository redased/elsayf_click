const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function upsertUser(email, plainPassword, role, extraFields = {}) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        await prisma.user.update({
            where: { email },
            data: { 
                password: hashedPassword,
                role,
                ...extraFields
            }
        });
        console.log(`✅ Password and role updated for ${email}`);
    } else {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                name: email.split('@')[0],
                ...extraFields
            }
        });
        console.log(`✅ User ${email} created with role ${role}`);
    }
}

async function main() {
    console.log('Setting up admin passwords...');

    // Admin password
    await upsertUser('progdev97@gmail.com', 'Admin123!', 'SUPER_ADMIN', {
        rStatAdminAccess: true,
        analyticsAccess: true,
        rStatAccess: true,
        pythonAccess: true,
        geminiAccess: true,
        openaiAccess: true,
        vscodeAccess: true,
        affiliateAccess: true
    });

    // Marketing password
    await upsertUser('Chanezhatateba@gmail.com', 'Marketing2024!', 'MARKETING_ADMIN', {
        analyticsAccess: true,
        affiliateAccess: true
    });

    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
