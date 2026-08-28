import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer un utilisateur
export async function GET(request, { params }) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                analyticsAccess: true,
                rStatAccess: true,
                pythonAccess: true,
                geminiAccess: true,
                openaiAccess: true,
                affiliateAccess: true,
                rStatAdminAccess: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Mettre à jour un utilisateur
export async function PATCH(request, { params }) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized - Super Admin only' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const user = await prisma.user.update({
            where: { id },
            data: {
                role: data.role,
                analyticsAccess: data.analyticsAccess,
                rStatAccess: data.rStatAccess,
                pythonAccess: data.pythonAccess,
                geminiAccess: data.geminiAccess,
                openaiAccess: data.openaiAccess,
                affiliateAccess: data.affiliateAccess,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                analyticsAccess: true,
                rStatAccess: true,
                pythonAccess: true,
                geminiAccess: true,
                openaiAccess: true,
                affiliateAccess: true,
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request, { params }) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized - Super Admin only' }, { status: 401 });
        }

        const { id } = await params;

        // Empêcher la suppression du dernier SUPER_ADMIN
        const userToDelete = await prisma.user.findUnique({
            where: { id }
        });

        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (userToDelete.role === 'SUPER_ADMIN') {
            const superAdminCount = await prisma.user.count({
                where: { role: 'SUPER_ADMIN' }
            });

            if (superAdminCount <= 1) {
                return NextResponse.json({
                    error: 'Impossible de supprimer le dernier Super Admin'
                }, { status: 400 });
            }
        }

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
