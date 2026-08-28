import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();

        if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current stream status
        const currentStats = await prisma.twitchStreamStats.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        // Get stats for the last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const weeklyStats = await prisma.twitchStreamStats.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Calculate metrics
        const totalStreams = weeklyStats.filter(s => s.isLive).length;
        const avgViewers = weeklyStats.length > 0
            ? Math.round(weeklyStats.reduce((sum, s) => sum + s.viewerCount, 0) / weeklyStats.length)
            : 0;
        const peakViewers = Math.max(...weeklyStats.map(s => s.viewerCount), 0);

        // Get notification stats
        const totalNotifications = await prisma.streamNotification.count();
        const unreadNotifications = await prisma.streamNotification.count({
            where: { read: false }
        });

        // Daily breakdown
        const dailyStats = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayStats = weeklyStats.filter(s => {
                const statDate = new Date(s.createdAt);
                return statDate >= date && statDate < nextDate;
            });

            dailyStats.push({
                date: date.toISOString().split('T')[0],
                streams: dayStats.filter(s => s.isLive).length,
                avgViewers: dayStats.length > 0
                    ? Math.round(dayStats.reduce((sum, s) => sum + s.viewerCount, 0) / dayStats.length)
                    : 0,
                peakViewers: Math.max(...dayStats.map(s => s.viewerCount), 0)
            });
        }

        return NextResponse.json({
            current: currentStats,
            weekly: {
                totalStreams,
                avgViewers,
                peakViewers,
                dailyBreakdown: dailyStats
            },
            notifications: {
                total: totalNotifications,
                unread: unreadNotifications
            }
        });

    } catch (error) {
        console.error('Error fetching Twitch stats:', error);
        return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
    }
}
