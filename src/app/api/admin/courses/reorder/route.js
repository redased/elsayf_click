import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// POST - Réorganiser l'ordre des cours
export async function POST(request) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orders } = await request.json();

        // Mettre à jour l'ordre de chaque cours
        const updates = orders.map(({ id, order }) =>
            prisma.course.update({
                where: { id },
                data: { order }
            })
        );

        await prisma.$transaction(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering courses:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
