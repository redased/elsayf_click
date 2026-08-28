import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

export const maxDuration = 90;

export async function POST(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    if (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const { lessonId, numQuestions = 5 } = await req.json();
    if (!lessonId) return NextResponse.json({ error: 'lessonId requis' }, { status: 400 });

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { contents: { orderBy: { order: 'asc' } } }
    });
    if (!lesson) return NextResponse.json({ error: 'Leçon introuvable' }, { status: 404 });

    const text = lesson.contents.map(c => c.content).join('\n').replace(/[`#*]/g, '').slice(0, 5000);

    const client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: { 'HTTP-Referer': 'https://elsayf.statlabo.com', 'X-Title': 'Elsayf Platform' }
    });

    const completion = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
        messages: [{
            role: 'user',
            content: `Génère exactement ${numQuestions} questions QCM en français pour évaluer la compréhension de cette leçon.
Leçon: "${lesson.title}"
Contenu: ${text}

Réponds UNIQUEMENT avec un JSON valide (sans markdown) de ce format:
[{"text":"Question?","answers":[{"text":"Bonne réponse","isCorrect":true},{"text":"Mauvaise 1","isCorrect":false},{"text":"Mauvaise 2","isCorrect":false},{"text":"Mauvaise 3","isCorrect":false}]}]`
        }],
        max_tokens: 2000,
        temperature: 0.4
    });

    let questions;
    try {
        const raw = completion.choices[0].message.content.replace(/```json\n?|\n?```/g, '').trim();
        questions = JSON.parse(raw);
    } catch { return NextResponse.json({ error: 'Erreur parsing IA' }, { status: 500 }); }

    const existing = await prisma.quiz.findFirst({ where: { lessonId } });
    if (existing) await prisma.quiz.delete({ where: { id: existing.id } });

    const quiz = await prisma.quiz.create({
        data: {
            title: `Quiz: ${lesson.title}`,
            lessonId,
            questions: { create: questions.map(q => ({ text: q.text, answers: { create: q.answers } })) }
        },
        include: { questions: { include: { answers: true } } }
    });

    return NextResponse.json({ quiz, message: `${questions.length} questions générées` });
}
