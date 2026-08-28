import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request) {
    try {
        const settings = await prisma.settings.findFirst();
        return NextResponse.json(settings || {});
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await auth();
        // Check if super admin (or at least admin with permissions)
        // For now, checking if role is ADMIN or SUPER_ADMIN
        if (!session || !session.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Upsert settings (update if exists, create if not)
        // Since we don't know the ID, we use findFirst then update, or create.
        // Prisma upsert needs a unique where input. ID is unique but we might not have it.
        // BUT, we likely only have ONE settings row.

        const existing = await prisma.settings.findFirst();

        let result;
        if (existing) {
            result = await prisma.settings.update({
                where: { id: existing.id },
                data: {
                    aiProvider: data.aiProvider,
                    geminiApiKey: data.geminiApiKey,
                    openaiApiKey: data.openaiApiKey,
                    zaiApiKey: data.zaiApiKey,
                    googleAnalyticsId: data.googleAnalyticsId,
                    googleAnalyticsEnabled: data.googleAnalyticsEnabled,
                    googleClientId: data.googleClientId,
                    googleSecret: data.googleSecret,
                    emailFrom: data.emailFrom,
                    smtpHost: data.smtpHost,
                    smtpPass: data.smtpPass,
                    smtpPort: data.smtpPort,
                    smtpUser: data.smtpUser,
                    // Twitch fields
                    twitchChannel: data.twitchChannel,
                    twitchEnabled: data.twitchEnabled,
                    twitchShowOffline: data.twitchShowOffline,
                    twitchTitle: data.twitchTitle
                }
            });
        } else {
            result = await prisma.settings.create({
                data: {
                    aiProvider: data.aiProvider || 'gemini',
                    geminiApiKey: data.geminiApiKey,
                    openaiApiKey: data.openaiApiKey,
                    zaiApiKey: data.zaiApiKey,
                    googleAnalyticsId: data.googleAnalyticsId,
                    googleAnalyticsEnabled: data.googleAnalyticsEnabled || false,
                    googleClientId: data.googleClientId,
                    googleSecret: data.googleSecret,
                    emailFrom: data.emailFrom,
                    smtpHost: data.smtpHost,
                    smtpPass: data.smtpPass,
                    smtpPort: data.smtpPort,
                    smtpUser: data.smtpUser,
                    // Twitch fields
                    twitchChannel: data.twitchChannel,
                    twitchEnabled: data.twitchEnabled || false,
                    twitchShowOffline: data.twitchShowOffline || true,
                    twitchTitle: data.twitchTitle
                }
            });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ error: 'Error updating settings' }, { status: 500 });
    }
}
