import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action, path, courseId, lessonId, courseSlug, lessonSlug, lessonTitle, duration } = body;

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
            || request.headers.get('x-real-ip') 
            || '';
        const userAgent = request.headers.get('user-agent') || '';

        let resolvedCourseId = courseId || null;
        let resolvedLessonId = lessonId || null;
        let finalCourseSlug = courseSlug || '';
        let finalLessonSlug = lessonSlug || '';
        let finalLessonTitle = lessonTitle || '';

        // If path is provided, try to resolve courseSlug from pathname
        if (path && (!resolvedCourseId || !finalCourseSlug)) {
            const courseMatch = path.match(/\/(?:dashboard\/)?courses\/([^/]+)/);
            if (courseMatch) {
                finalCourseSlug = courseMatch[1];
                
                // If it's a specific lesson URL or sub-path, extract that too if it's there
                // Note: The UI is single-page dashboard mostly, but this serves as fallback
                const parts = path.split('/');
                const coursesIndex = parts.indexOf('courses');
                if (coursesIndex !== -1 && parts.length > coursesIndex + 2) {
                    finalLessonSlug = parts[coursesIndex + 2];
                }
            }
        }

        // Lookup course in DB if we have a slug but no ID
        if (finalCourseSlug && !resolvedCourseId) {
            try {
                const course = await prisma.course.findUnique({
                    where: { slug: finalCourseSlug },
                    select: { id: true, title: true }
                });
                if (course) {
                    resolvedCourseId = course.id;
                }
            } catch (e) {
                console.error('Failed to lookup course by slug:', e);
            }
        }

        // If we have a lesson slug but no lesson ID, try to lookup lesson
        if (finalLessonSlug && resolvedCourseId && !resolvedLessonId) {
            try {
                const lesson = await prisma.lesson.findFirst({
                    where: { 
                        courseId: resolvedCourseId,
                        OR: [
                            { id: finalLessonSlug },
                            { title: { contains: finalLessonSlug } } // fallback
                        ]
                    },
                    select: { id: true, title: true }
                });
                if (lesson) {
                    resolvedLessonId = lesson.id;
                    if (!finalLessonTitle) finalLessonTitle = lesson.title;
                }
            } catch (e) {
                console.error('Failed to lookup lesson:', e);
            }
        }

        // Save activity log
        const log = await prisma.activityLog.create({
            data: {
                action: action, // e.g. "STUDENT_VIEW_PAGE", "STUDENT_VIEW_LESSON", "STUDENT_HEARTBEAT"
                userId: session.user.id,
                targetId: resolvedLessonId || resolvedCourseId || null,
                targetType: resolvedLessonId ? 'Lesson' : resolvedCourseId ? 'Course' : null,
                ipAddress: ipAddress,
                userAgent: userAgent,
                details: JSON.stringify({
                    path: path || '',
                    courseSlug: finalCourseSlug,
                    lessonSlug: finalLessonSlug,
                    lessonTitle: finalLessonTitle,
                    duration: duration || 0,
                    timestamp: new Date().toISOString()
                })
            }
        });

        return NextResponse.json({ success: true, id: log.id });

    } catch (error) {
        console.error('Error tracking activity:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
