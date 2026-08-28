import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const session = await auth();

        // Seul le Super Admin peut révoquer l'accès R Stat
        if (session?.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
        }

        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Ne pas permettre de révoquer l'accès d'un Super Admin
        if (user.role === 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Impossible de révoquer l\'accès d\'un Super Admin' }, { status: 403 });
        }

        // Si le rôle est R_STAT_ADMIN, le changer en STUDENT
        let updateData = { rStatAdminAccess: false };

        if (user.role === 'R_STAT_ADMIN') {
            updateData.role = 'STUDENT';
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                rStatAdminAccess: true
            }
        });

        // Supprimer l'enrollment au cours r-statistics-finance
        const rStatCourse = await prisma.course.findUnique({
            where: { slug: 'r-statistics-finance' },
            select: { id: true }
        });

        if (rStatCourse) {
            await prisma.courseEnrollment.deleteMany({
                where: {
                    userId: userId,
                    courseId: rStatCourse.id
                }
            });
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: `Accès R Stat révoqué pour ${user.email}`
        });

    } catch (error) {
        console.error('Error revoking R Stat access:', error);
        return NextResponse.json({ error: 'Erreur lors de la révocation de l\'accès' }, { status: 500 });
    }
}
