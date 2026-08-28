import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const session = await auth();

        // Vérification des permissions
        const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                         session?.user?.role === 'ADMIN' ||
                         session?.user?.role === 'R_STAT_ADMIN';

        if (!hasAccess) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        // Récupérer tous les utilisateurs avec accès R Stat
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { role: 'R_STAT_ADMIN' },
                    { rStatAdminAccess: true }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                rStatAdminAccess: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching R Stat users:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs' }, { status: 500 });
    }
}
