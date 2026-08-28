import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    if (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const [totalStudents, totalEnrollments, totalCompletions, recentActivity, courseStats] = await Promise.all([
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.courseEnrollment.count(),
        prisma.courseProgress.count({ where: { completed: true } }),
        prisma.userLessonProgress.findMany({
            where: { completedAt: { gte: new Date(Date.now() - 7 * 86400000) }, completed: true },
            orderBy: { completedAt: 'desc' },
            take: 20,
            include: {
                user: { select: { id: true, name: true } },
                lesson: { select: { title: true, course: { select: { title: true } } } }
            }
        }),
        prisma.course.findMany({
            where: { isPublished: true },
            select: {
                id: true, title: true, slug: true,
                _count: { select: { enrollments: true } },
                progress: { select: { progress: true, completed: true } }
            }
        })
    ]);

    return NextResponse.json({
        overview: { totalStudents, totalEnrollments, totalCompletions },
        recentActivity: recentActivity.map(a => ({
            userName: a.user?.name, lessonTitle: a.lesson?.title,
            courseTitle: a.lesson?.course?.title, completedAt: a.completedAt
        })),
        courseStats: courseStats.map(c => ({
            id: c.id, title: c.title, slug: c.slug,
            totalEnrolled: c._count.enrollments,
            totalCompleted: c.progress.filter(p => p.completed).length,
            avgProgress: c.progress.length > 0 ? Math.round(c.progress.reduce((s, p) => s + p.progress, 0) / c.progress.length) : 0
        }))
    });
}
