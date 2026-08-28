import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { id: lessonId } = await params;
    const comments = await prisma.lessonComment.findMany({
        where: { lessonId },
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { id: true, name: true, image: true, role: true } } }
    });
    return NextResponse.json({ comments });
}

export async function POST(req, { params }) {
    try {
        const session = await auth();
        console.log("Session in POST /api/lessons/comments:", JSON.stringify(session, null, 2));
        if (!session || !session.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        const { id: lessonId } = await params;
        const { content } = await req.json();
        console.log("Submitting comment for userId:", session.user.id, "lessonId:", lessonId);
        if (!content?.trim()) return NextResponse.json({ error: 'Contenu requis' }, { status: 400 });
        const comment = await prisma.lessonComment.create({
            data: { userId: session.user.id, lessonId, content: content.trim() },
            include: { user: { select: { id: true, name: true, image: true, role: true } } }
        });
        return NextResponse.json({ comment });
    } catch (error) {
        console.error("Error in POST /api/lessons/[id]/comments:", error);
        return NextResponse.json({ error: error.message || 'Erreur interne' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('commentId');
    const comment = await prisma.lessonComment.findUnique({ where: { id: commentId } });
    if (!comment) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
    if (comment.userId !== session.user.id && !isAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    await prisma.lessonComment.delete({ where: { id: commentId } });
    return NextResponse.json({ ok: true });
}
