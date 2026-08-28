
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Total Courses Completed
        const totalCoursesCompleted = await prisma.courseProgress.count({
            where: { completed: true }
        });

        // 2. Total XP distributed
        const result = await prisma.user.aggregate({
            _sum: { xp: true }
        });
        const totalXp = result._sum.xp || 0;

        // 3. Leaderboard (Top 5)
        const leaderboard = await prisma.user.findMany({
            orderBy: { xp: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                xp: true,
                level: true,
                image: true
            }
        });

        return NextResponse.json({
            totalCoursesCompleted,
            totalXp,
            leaderboard
        });

    } catch (error) {
        console.error('Error fetching gamification stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
