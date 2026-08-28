
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const courses = await prisma.course.findMany({
            orderBy: { order: 'asc' },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                price: true,
                isPublished: true,
                isFree: true,
                order: true,
                image: true,
                level: true,
                duration: true
            }
        });

        return NextResponse.json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { nanoid } = await import('nanoid');
        const count = await prisma.course.count();
        const title = `Nouvelle Formation ${count + 1}`;
        const slug = `formation-${nanoid(6).toLowerCase()}`;

        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description: "Description de la formation...",
                price: 0,
                level: "Débutant",
                duration: "0h",
                isPublished: false,
                isFree: false
            }
        });

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
