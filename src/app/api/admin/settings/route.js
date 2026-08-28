import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let settings = await prisma.settings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    aiProvider: 'gemini',
                    geminiApiKey: process.env.GEMINI_API_KEY || '',
                    openaiApiKey: process.env.OPENAI_API_KEY || '',
                    zaiApiKey: process.env.Z_AI_API_KEY || '',
                }
            });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        let settings = await prisma.settings.findFirst();

        if (settings) {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            });
        } else {
            settings = await prisma.settings.create({
                data: {
                    ...data,
                    geminiApiKey: process.env.GEMINI_API_KEY || '',
                    openaiApiKey: process.env.OPENAI_API_KEY || '',
                    zaiApiKey: process.env.Z_AI_API_KEY || '',
                }
            });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
