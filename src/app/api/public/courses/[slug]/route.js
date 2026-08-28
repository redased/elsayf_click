import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const session = await auth();
        // Get language from query param or header
        // Get language from query param or header
        const lang = request.nextUrl.searchParams.get('lang') || 'fr'; // Default to 'fr'

        const course = await prisma.course.findUnique({
            where: { slug },
            include: {
                lessons: {
                    select: {
                        id: true,
                        title: true,
                        title_en: true,
                        title_ar: true,
                        duration: true,
                        order: true
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // --- Translation Logic ---
        const translate = (obj, field) => {
            if (lang === 'fr') return obj[field]; // Default field is usually FR content but we kept specific fields too
            const localizedField = `${field}_${lang}`;
            return obj[localizedField] || obj[field] || obj[`${field}_fr`] || '';
        };

        // Parse JSON fields if they are strings
        const parseJSON = (field) => {
            if (!field || field === 'null') return [];
            try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        };

        const translatedCourse = {
            ...course,
            title: translate(course, 'title'),
            description: translate(course, 'description'),
            fullDescription: translate(course, 'fullDescription') || course.description,
            learningOutcomes: parseJSON(translate(course, 'learningOutcomes')),
            requirements: parseJSON(translate(course, 'requirements')),
            lessons: course.lessons.map(lesson => ({
                ...lesson,
                title: translate(lesson, 'title')
            }))
        };

        let isEnrolled = false;
        let invitationStatus = null;

        if (session && session.user) {
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            if (user) {
                const enrollment = await prisma.courseEnrollment.findUnique({
                    where: {
                        userId_courseId: {
                            userId: user.id,
                            courseId: course.id
                        }
                    }
                });
                isEnrolled = !!enrollment;

                if (!isEnrolled) {
                    const invitation = await prisma.courseInvitation.findUnique({
                        where: {
                            email_courseId: {
                                email: session.user.email,
                                courseId: course.id
                            }
                        }
                    });
                    if (invitation) {
                        invitationStatus = invitation.status;
                    }
                }
            }
        }

        return NextResponse.json({ course: translatedCourse, isEnrolled, invitationStatus });
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message, stack: error.stack }, { status: 500 });
    }
}
