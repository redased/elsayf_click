import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Alias route for backwards compatibility - same as /api/public/courses
export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                duration: true,
                level: true,
                image: true,
                price: true,
                isFree: true,
                _count: { select: { lessons: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedCourses = courses.map(course => ({
            ...course,
            color: getCourseColor(course.slug),
            lessonsCount: course._count.lessons
        }));

        return NextResponse.json({ courses: formattedCourses }, {
            headers: { 'Cache-Control': 'no-store' }
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ courses: [] }, { status: 500 });
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
        'python-complet': 'from-sky-600 to-indigo-600',
        'google-antigravity-mastery': 'from-cyan-500 to-indigo-600',
        'recherche-operationnelle-python-ia': 'from-indigo-600 to-emerald-600'
    };
    return colors[slug] || 'from-gray-600 to-gray-800';
}
