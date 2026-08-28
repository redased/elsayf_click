import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher';
import { addXp } from '@/lib/gamification';

export async function GET(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const channelId = searchParams.get('channelId');

        if (!channelId) {
            return NextResponse.json({ error: 'Channel ID required' }, { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: { channelId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' },
            take: 100 // Limite pour commencer
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, channelId } = await request.json();

        if (!content || !channelId) {
            return NextResponse.json({ error: 'Missing content or channelId' }, { status: 400 });
        }

        // Récupérer l'ID utilisateur via Prisma (session.user.email est sûr)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                channelId,
                authorId: user.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        // Trigger Pusher event
        if (pusherServer) {
            try {
                await pusherServer.trigger(
                    `channel-${channelId}`,
                    'new-message',
                    message
                );
            } catch (pusherError) {
                console.error('Pusher trigger error:', pusherError);
                // On ne bloque pas la réponse si Pusher échoue
            }
        } else {
            console.warn('[Forum] Pusher server not available. Message saved but not broadcast.');
        }

        // Gamification : +10 XP pour un message
        // On ne bloque pas la réponse
        addXp(user.id, 10).catch(err => console.error("XP Error", err));

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
