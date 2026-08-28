import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const session = await auth();

        // Seul le Super Admin peut attribuer l'accès R Stat
        if (session?.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email requis' }, { status: 400 });
        }

        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Mettre à jour l'utilisateur avec l'accès R Stat
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                rStatAdminAccess: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                rStatAdminAccess: true
            }
        });

        // Créer l'enrollment au cours r-statistics-finance si pas déjà fait
        const rStatCourse = await prisma.course.findUnique({
            where: { slug: 'r-statistics-finance' },
            select: { id: true }
        });

        if (rStatCourse) {
            await prisma.courseEnrollment.upsert({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: rStatCourse.id
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    courseId: rStatCourse.id,
                    enrollmentType: 'INVITATION'
                }
            });
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: `Accès R Stat accordé à ${email}`
        });

    } catch (error) {
        console.error('Error granting R Stat access:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'attribution de l\'accès' }, { status: 500 });
    }
}
