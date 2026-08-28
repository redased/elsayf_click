
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET Course Details (Admin)
export async function GET(request, { params }) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const course = await prisma.course.findUnique({
            where: { id }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// UPDATE Course Details (Admin)
export async function PUT(request, { params }) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const course = await prisma.course.update({
            where: { id },
            data: {
                title: data.title,
                title_ar: data.title_ar,
                title_en: data.title_en,
                title_ja: data.title_ja,
                description: data.description,
                description_ar: data.description_ar,
                description_en: data.description_en,
                description_ja: data.description_ja,
                fullDescription: data.fullDescription,
                fullDescription_ar: data.fullDescription_ar,
                fullDescription_en: data.fullDescription_en,
                fullDescription_ja: data.fullDescription_ja,
                learningOutcomes: JSON.stringify(data.learningOutcomes),
                learningOutcomes_ar: data.learningOutcomes_ar,
                learningOutcomes_en: data.learningOutcomes_en,
                learningOutcomes_ja: data.learningOutcomes_ja,
                requirements: JSON.stringify(data.requirements),
                requirements_ar: data.requirements_ar,
                requirements_en: data.requirements_en,
                requirements_ja: data.requirements_ja,
                price: parseFloat(data.price),
                level: data.level,
                duration: data.duration,
                image: data.image,
                isPublished: data.isPublished,
                isFree: data.isFree
            }
        });

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH Course (partial update - for quick toggles like isPublished)
export async function PATCH(request, { params }) {
    try {
        const session = await auth();
        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const course = await prisma.course.update({
            where: { id },
            data
        });

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error patching course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
