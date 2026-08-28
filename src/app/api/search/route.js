import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    if (!q || q.length < 2) return NextResponse.json({ results: [] });

    const [courses, lessons] = await Promise.all([
        prisma.course.findMany({
            where: {
                isPublished: true,
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } }
                ]
            },
            select: { id: true, title: true, description: true, slug: true, level: true },
            take: 5
        }),
        prisma.lesson.findMany({
            where: {
                course: { isPublished: true },
                OR: [{ title: { contains: q, mode: 'insensitive' } }]
            },
            select: {
                id: true, title: true,
                course: { select: { id: true, title: true, slug: true } }
            },
            take: 8
        })
    ]);

    return NextResponse.json({
        results: [
            ...courses.map(c => ({ type: 'course', ...c, url: `/courses/${c.slug}` })),
            ...lessons.map(l => ({ type: 'lesson', id: l.id, title: l.title, courseTitle: l.course.title, url: `/dashboard/courses/${l.course.slug}` }))
        ]
    });
}
