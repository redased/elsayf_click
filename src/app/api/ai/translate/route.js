import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text, sourceLang, targetLang } = await request.json();

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
        }

        // Get AI settings
        const settings = await prisma.settings.findFirst();
        const apiKey = settings?.zaiApiKey || process.env.Z_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Z-AI API Key not configured' }, { status: 500 });
        }

        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://open.bigmodel.cn/api/paas/v4/"
        });

        const systemPrompt = `You are a professional translator for technical and educational content.
Translate the input from ${sourceLang || 'auto'} to ${targetLang}.
Maintain formatting (markdown, html tags).
Return ONLY the translated text.`;

        const completion = await client.chat.completions.create({
            model: "glm-4-flash",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            temperature: 0.3,
        });

        const translatedText = completion.choices[0].message.content;

        return NextResponse.json({ translatedText });

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
