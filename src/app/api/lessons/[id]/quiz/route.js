import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { id: lessonId } = await params;

    const quiz = await prisma.quiz.findFirst({
        where: { lessonId },
        include: {
            questions: {
                include: { answers: { select: { id: true, text: true } } }
            }
        }
    });

    if (!quiz) return NextResponse.json({ quiz: null });

    const bestResult = await prisma.userQuizResult.findFirst({
        where: { userId: session.user.id, quizId: quiz.id, passed: true },
        orderBy: { score: 'desc' }
    });
    const lastResult = await prisma.userQuizResult.findFirst({
        where: { userId: session.user.id, quizId: quiz.id },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ quiz, bestResult, lastResult });
}
