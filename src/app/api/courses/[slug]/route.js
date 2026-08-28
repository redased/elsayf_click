
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;

        const course = await prisma.course.findUnique({
            where: { slug },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                    include: {
                        contents: { orderBy: { order: 'asc' } },
                        userProgress: {
                            where: { userId: session.user.id }
                        },
                        quizzes: {
                            include: {
                                questions: {
                                    include: {
                                        answers: {
                                            select: { id: true, text: true } // Don't send isCorrect to client
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Check enrollment
        const enrollment = await prisma.courseEnrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: course.id
                }
            }
        });

        const isEnrolled = !!enrollment || session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN' || session.user.role === 'R_STAT_ADMIN';

        // Security: Mask sensitive content if not enrolled
        if (!isEnrolled) {
            course.lessons = course.lessons.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                duration: lesson.duration,
                order: lesson.order,
                content: null, // Masked
                videoUrl: null, // Masked
                quizzes: [], // Masked
                userProgress: []
            }));
        }

        return NextResponse.json({ course, isEnrolled });
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
