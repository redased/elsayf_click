import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const session = await auth();

        // Vérification des permissions
        const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                         session?.user?.role === 'ADMIN' ||
                         session?.user?.pythonAccess === true;

        if (!hasAccess) {
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

        // Révoquer l'accès Python
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                pythonAccess: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                pythonAccess: true
            }
        });

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: `Accès Python révoqué pour ${user.email}`
        });

    } catch (error) {
        console.error('Error revoking Python access:', error);
        return NextResponse.json({ error: 'Erreur lors de la révocation' }, { status: 500 });
    }
}
