import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [totalStudents, totalUsers, enrollments, completedCourses] = await Promise.all([
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count(),
            prisma.courseEnrollment.count(),
            prisma.courseProgress.count({ where: { completed: true } })
        ]);

        return NextResponse.json({
            totalUsers,
            totalStudents,
            totalEnrollments: enrollments,
            completedCourses
        });
    } catch (error) {
        console.error('Error fetching full stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
