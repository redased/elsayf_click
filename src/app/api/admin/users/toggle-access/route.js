import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, field } = await request.json();

        // Validate field
        const allowedFields = ['analyticsAccess', 'geminiAccess', 'openaiAccess', 'affiliateAccess'];
        if (!allowedFields.includes(field)) {
            return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { [field]: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Toggle the field
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                [field]: !user[field]
            }
        });

        return NextResponse.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error toggling access:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
