import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Get user's enrollments with progress
        const enrollments = await prisma.courseEnrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        duration: true,
                        lessons: true
                    }
                }
            }
        });

        // Calculate stats
        const coursesCount = enrollments.length;
        
        // Calculate total hours (approximate from duration strings)
        let totalHours = 0;
        enrollments.forEach(e => {
            const duration = e.course?.duration || '';
            const match = duration.match(/(\d+)/);
            if (match) {
                totalHours += parseInt(match[1]);
            }
        });

        // Get completed lessons count
        const completedLessons = await prisma.userLessonProgress.count({
            where: { 
                userId,
                completed: true 
            }
        });

        // Calculate average progress from CourseProgress model
        const courseProgressRecords = await prisma.courseProgress.findMany({
            where: {
                userId,
                courseId: { in: enrollments.map(e => e.courseId) }
            }
        });
        const totalProgress = courseProgressRecords.reduce((sum, cp) => sum + (cp.progress || 0), 0);
        const averageProgress = coursesCount > 0 ? Math.round(totalProgress / coursesCount) : 0;

        // Get certificates (courses completed)
        const certificates = courseProgressRecords.filter(cp => cp.progress >= 100).length;

        return NextResponse.json({
            coursesCount,
            hoursSpent: `${totalHours}h`,
            completedLessons,
            averageProgress,
            certificates,
            xp: session.user.xp || 0,
            level: session.user.level || 1
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch stats',
            coursesCount: 0,
            hoursSpent: '0h',
            completedLessons: 0,
            averageProgress: 0,
            certificates: 0
        }, { status: 500 });
    }
}
