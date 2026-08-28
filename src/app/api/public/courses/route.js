import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: {
                isPublished: true
            },
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
                _count: {
                    select: {
                        lessons: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Add colors and format
        const formattedCourses = courses.map(course => ({
            ...course,
            color: getCourseColor(course.slug),
            lessonsCount: course._count.lessons
        }));

        return NextResponse.json({
            courses: formattedCourses
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Error fetching public courses:', error);
        
        // Return default courses if DB fails
        return NextResponse.json({
            courses: [
                { id: 1, title: 'Google Sheets: De Zéro à l\'Expert', slug: 'google-sheets-mastery', level: 'Tous niveaux', duration: '20h', description: 'Maîtrisez Google Sheets sans programmation', isFree: true, color: 'from-green-600 to-emerald-600' },
                { id: 2, title: 'Python Intégral', slug: 'python-integral', level: 'Débutant', duration: '20h', description: 'Maîtrisez les bases et la POO', isFree: true, color: 'from-blue-600 to-cyan-600' },
                { id: 3, title: 'Django Expert', slug: 'django-expert', level: 'Avancé', duration: '35h', description: 'Créez des applications web complexes', isFree: true, color: 'from-purple-600 to-pink-600' },
                { id: 4, title: 'R pour la Finance', slug: 'r-statistics-finance', level: 'Intermédiaire', duration: '15h', description: 'Statistiques avancées et analyse financière', isFree: true, color: 'from-orange-600 to-red-600' },
            ]
        });
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
        'automatisation-excel-comptabilite-detaillee': 'from-emerald-600 to-teal-700',
        'cybersecurite-protection-systemes-defensive': 'from-red-600 to-rose-700',
        'ethical-hacking-securite-web-pentest': 'from-cyan-600 to-blue-700',
        'power-bi-business-intelligence-data-analytics': 'from-yellow-600 to-amber-600'
    };
    return colors[slug] || 'from-blue-600 to-indigo-700';
}
