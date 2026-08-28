import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const completedCourses = await prisma.courseProgress.findMany({
            where: {
                userId: session.user.id,
                completed: true
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        image: true,
                        duration: true,
                        level: true
                    }
                }
            }
        });

        return NextResponse.json({ certificates: completedCourses });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
