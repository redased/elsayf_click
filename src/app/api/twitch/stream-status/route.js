import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Cache du token en mémoire (valide ~60 jours)
let tokenCache = { token: null, expiresAt: 0 };

async function getTwitchToken() {
    if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
        return tokenCache.token;
    }

    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('TWITCH_CLIENT_ID ou TWITCH_CLIENT_SECRET manquant dans .env');
    }

    const res = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        { method: 'POST' }
    );

    if (!res.ok) throw new Error('Impossible d\'obtenir le token Twitch');

    const data = await res.json();
    tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 300) * 1000, // 5 min de marge
    };

    return tokenCache.token;
}

export async function GET() {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings?.twitchChannel || !settings.twitchEnabled) {
            return NextResponse.json({ live: false, message: 'Twitch non configuré' });
        }

        const clientId = process.env.TWITCH_CLIENT_ID;
        if (!clientId) {
            return NextResponse.json({ live: false, message: 'TWITCH_CLIENT_ID manquant' });
        }

        const token = await getTwitchToken();
        const channelName = settings.twitchChannel;

        // Appel Helix API — infos du stream en direct
        const streamRes = await fetch(
            `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channelName)}`,
            {
                headers: {
                    'Client-Id': clientId,
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!streamRes.ok) throw new Error('Erreur appel Twitch Helix API');

        const streamData = await streamRes.json();
        const stream = streamData.data?.[0];
        const isLive = !!stream && stream.type === 'live';

        // Infos du channel (avatar, description)
        const userRes = await fetch(
            `https://api.twitch.tv/helix/users?login=${encodeURIComponent(channelName)}`,
            {
                headers: {
                    'Client-Id': clientId,
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        const userData = await userRes.json();
        const user = userData.data?.[0];

        // Sauvegarder dans la DB
        await prisma.twitchStreamStats.create({
            data: {
                isLive,
                viewerCount: isLive ? (stream.viewer_count || 0) : 0,
                streamTitle: isLive ? stream.title : null,
                gameName: isLive ? stream.game_name : null,
                thumbnailUrl: isLive
                    ? stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360')
                    : null,
                startedAt: isLive ? new Date(stream.started_at) : null,
                language: isLive ? stream.language : null,
            },
        });

        // Envoyer notifications si en live
        if (isLive) {
            await sendStreamNotifications(stream.title);
        }

        return NextResponse.json({
            live: isLive,
            channel: channelName,
            title: isLive ? stream.title : settings.twitchTitle,
            gameName: isLive ? stream.game_name : null,
            viewerCount: isLive ? stream.viewer_count : 0,
            startedAt: isLive ? stream.started_at : null,
            thumbnailUrl: isLive
                ? stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360')
                : null,
            profileImage: user?.profile_image_url || null,
            displayName: user?.display_name || channelName,
            description: user?.description || null,
        });

    } catch (error) {
        console.error('Erreur Twitch API:', error.message);
        return NextResponse.json({ live: false, error: error.message }, { status: 500 });
    }
}

async function sendStreamNotifications(streamTitle) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const users = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            streamNotifications: { none: { sentAt: { gte: oneHourAgo } } },
        },
        take: 100,
    });

    if (users.length === 0) return;

    await prisma.streamNotification.createMany({
        data: users.map(user => ({
            userId: user.id,
            streamTitle: streamTitle || 'Stream en direct!',
        })),
    });
}
