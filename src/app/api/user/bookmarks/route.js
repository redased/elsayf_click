import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const bookmarks = await prisma.userBookmark.findMany({
        where: { userId: session.user.id },
        include: {
            lesson: {
                select: {
                    id: true, title: true, order: true,
                    course: { select: { id: true, title: true, slug: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ bookmarks });
}

export async function POST(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { lessonId } = await req.json();
    if (!lessonId) return NextResponse.json({ error: 'lessonId requis' }, { status: 400 });

    const existing = await prisma.userBookmark.findUnique({
        where: { userId_lessonId: { userId: session.user.id, lessonId } }
    });
    if (existing) {
        await prisma.userBookmark.delete({ where: { id: existing.id } });
        return NextResponse.json({ bookmarked: false });
    }
    await prisma.userBookmark.create({ data: { userId: session.user.id, lessonId } });
    return NextResponse.json({ bookmarked: true });
}
