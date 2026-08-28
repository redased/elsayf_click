
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(request, { params }) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { content } = await request.json();

        const updatedLesson = await prisma.lesson.update({
            where: { id },
            data: { content }
        });

        return NextResponse.json({ lesson: updatedLesson });
    } catch (error) {
        console.error('Error updating lesson:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
