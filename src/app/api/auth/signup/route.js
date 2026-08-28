import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Un compte avec cet email existe déjà.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cookieStore = await cookies();
        const refCode = cookieStore.get('ref_code')?.value;
        const refClickId = cookieStore.get('ref_click_id')?.value;

        const userData = { name, email, password: hashedPassword, role: 'STUDENT' };

        if (refCode) {
            const link = await prisma.affiliateLink.findUnique({ where: { code: refCode } });
            if (link) {
                userData.referredByCode = refCode;
                await prisma.affiliateLink.update({
                    where: { code: refCode },
                    data: { registrations: { increment: 1 } }
                });
                if (refClickId) {
                    await prisma.affiliateClick.updateMany({
                        where: { id: refClickId, linkId: link.id },
                        data: { converted: true, convertedAt: new Date() }
                    });
                }
            }
        }

        const freeCourses = await prisma.course.findMany({
            where: { isFree: true, isPublished: true },
            select: { id: true }
        });

        const user = await prisma.user.create({ data: userData });

        for (const course of freeCourses) {
            await prisma.courseEnrollment.upsert({
                where: { userId_courseId: { userId: user.id, courseId: course.id } },
                update: {},
                create: { userId: user.id, courseId: course.id, enrollmentType: 'FREE' }
            });
        }

        return NextResponse.json({ message: 'Compte créé avec succès.' }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
    }
}
