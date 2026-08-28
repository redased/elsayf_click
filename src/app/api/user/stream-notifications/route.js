import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.streamNotification.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                sentAt: 'desc'
            },
            take: 10
        });

        // Count unread
        const unreadCount = await prisma.streamNotification.count({
            where: {
                userId: session.user.id,
                read: false
            }
        });

        return NextResponse.json({
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
    }
}

export async function PUT() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Mark all notifications as read
        await prisma.streamNotification.updateMany({
            where: {
                userId: session.user.id,
                read: false
            },
            data: {
                read: true
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return NextResponse.json({ error: 'Error updating notifications' }, { status: 500 });
    }
}
