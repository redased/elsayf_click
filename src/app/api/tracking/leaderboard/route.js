import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const leaderboard = await prisma.user.findMany({
            orderBy: {
                xp: 'desc',
            },
            take: 10,
            select: {
                id: true,
                name: true,
                image: true,
                xp: true,
                level: true,
                badges: true, // Assuming this is JSON or string
                faculty: {
                    select: {
                        shortName: true,
                        name: true
                    }
                }
            },
        });

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
