import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const { lessonId, courseId } = await req.json();

        if (!lessonId || !courseId) {
            return NextResponse.json({ error: 'Missing lessonId or courseId' }, { status: 400 });
        }

        // 1. Check if lesson is already completed
        const existingProgress = await prisma.userLessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
        });

        if (existingProgress?.completed) {
            return NextResponse.json({ message: 'Lesson already completed', earnedXp: 0 });
        }

        // 2. Mark lesson as completed
        await prisma.userLessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            update: {
                completed: true,
                completedAt: new Date(),
            },
            create: {
                userId,
                lessonId,
                completed: true,
                completedAt: new Date(),
            },
        });

        // 3. Add XP to User (+10 XP)
        const XP_PER_LESSON = 10;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: XP_PER_LESSON },
            },
        });

        // 4. Update Course Progress
        // Get total lessons in course
        const totalLessons = await prisma.lesson.count({
            where: { courseId },
        });

        // Get completed lessons by user in this course
        // We need to query UserLessonProgress where lesson.courseId is correct
        const completedLessonsCount = await prisma.userLessonProgress.count({
            where: {
                userId,
                completed: true,
                lesson: {
                    courseId,
                },
            },
        });

        let progressPercentage = 0;
        if (totalLessons > 0) {
            progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);
        }

        // Update CourseProgress model
        await prisma.courseProgress.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            update: {
                progress: progressPercentage,
                completed: progressPercentage === 100,
                lastAccessed: new Date(),
            },
            create: {
                userId,
                courseId,
                progress: progressPercentage,
                completed: progressPercentage === 100,
                lastAccessed: new Date(),
            },
        });

        // Bonus XP if course completed just now? (Optional logic, maybe for later)

        return NextResponse.json({
            message: 'Progress updated',
            progress: progressPercentage,
            earnedXp: XP_PER_LESSON,
            newTotalXp: updatedUser.xp
        });

    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
