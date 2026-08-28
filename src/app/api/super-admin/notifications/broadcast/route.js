import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

export async function POST(request) {
    const session = await auth();
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    try {
        const { title, body, type, actionUrl } = await request.json();

        if (!title?.trim() || !body?.trim() || !type) {
            return NextResponse.json({ error: 'Titre, message et type requis' }, { status: 400 });
        }

        const validTypes = ['new_course', 'live_session', 'twitch'];
        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
        }

        // Sauvegarder en base
        const notification = await prisma.broadcastNotification.create({
            data: {
                title: title.trim(),
                body: body.trim(),
                type,
                actionUrl: actionUrl?.trim() || null,
                sentBy: session.user.id,
            },
        });

        // Diffuser via Pusher à tous les utilisateurs connectés
        if (pusherServer) {
            await pusherServer.trigger('global-notifications', 'new-notification', {
                id: notification.id,
                title: notification.title,
                body: notification.body,
                type: notification.type,
                actionUrl: notification.actionUrl,
                sentAt: notification.sentAt,
            });
        } else {
            console.warn('[Notifications] Pusher server not available. Notification saved but not broadcast.');
        }

        return NextResponse.json({ success: true, notification });

    } catch (error) {
        console.error('[Notifications] Erreur broadcast:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function GET() {
    const session = await auth();
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    try {
        const notifications = await prisma.broadcastNotification.findMany({
            orderBy: { sentAt: 'desc' },
            take: 20,
        });
        return NextResponse.json({ notifications });
    } catch (error) {
        console.error('[Notifications] Erreur GET:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
