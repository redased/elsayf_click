import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import OpenAI from 'openai';

export const maxDuration = 60;

export async function POST(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { content, title } = await req.json();
    if (!content) return NextResponse.json({ error: 'Contenu requis' }, { status: 400 });

    const client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: { 'HTTP-Referer': 'https://elsayf.statlabo.com', 'X-Title': 'Elsayf Platform' }
    });

    const text = content.replace(/[#*`]/g, '').slice(0, 4000);
    const completion = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
        messages: [
            { role: 'system', content: 'Tu es un assistant pédagogique. Résume la leçon en 5 points clés max, en français, avec des puces (•). Sois concis.' },
            { role: 'user', content: `Leçon: "${title}"\n\n${text}` }
        ],
        max_tokens: 400,
        temperature: 0.3
    });
    return NextResponse.json({ summary: completion.choices[0].message.content });
}
