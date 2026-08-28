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

        // Get user's enrollments with course details
        const enrollments = await prisma.courseEnrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        description: true,
                        duration: true,
                        level: true,
                        image: true,
                        lessons: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                enrolledAt: 'desc'
            }
        });

        // Get progress for each enrollment
        const enrollmentsWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                const totalLessons = enrollment.course?.lessons?.length || 0;
                
                const completedLessons = await prisma.userLessonProgress.count({
                    where: {
                        userId,
                        lesson: {
                            courseId: enrollment.courseId
                        },
                        completed: true
                    }
                });

                const progress = totalLessons > 0 
                    ? Math.round((completedLessons / totalLessons) * 100) 
                    : 0;

                return {
                    ...enrollment,
                    progress,
                    completedLessons,
                    totalLessons,
                    course: {
                        ...enrollment.course,
                        color: getCourseColor(enrollment.course?.slug)
                    }
                };
            })
        );

        return NextResponse.json({
            enrollments: enrollmentsWithProgress
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Error fetching user enrollments:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch enrollments',
            enrollments: []
        }, { status: 500 });
    }
}

function getCourseColor(slug) {
    const colors = {
        'google-sheets-mastery': 'from-green-600 to-emerald-600',
        'python-novice': 'from-blue-600 to-cyan-600',
        'python-google-sheets-automation': 'from-purple-600 to-pink-600',
        'python-integral': 'from-indigo-600 to-blue-600',
        'django-expert': 'from-orange-600 to-red-600',
        'r-statistics-finance': 'from-yellow-600 to-orange-600',
        'python-data-science-ai-mastery': 'from-pink-600 to-rose-600',
        'r-statistics-complete-mastery': 'from-teal-600 to-cyan-600',
        'mastering-django-docker': 'from-violet-600 to-purple-600',
        'algorithmes-fondamentaux': 'from-amber-600 to-orange-600',
        'python-complet': 'from-sky-600 to-indigo-600'
    };
    return colors[slug] || 'from-gray-600 to-gray-800';
}
