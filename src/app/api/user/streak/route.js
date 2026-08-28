import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const streak = await prisma.userStreak.findUnique({ where: { userId: session.user.id } });
    return NextResponse.json({ streak: streak || { currentStreak: 0, longestStreak: 0, totalDays: 0, lastActiveDate: null } });
}

export async function POST() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const userId = session.user.id;
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const existing = await prisma.userStreak.findUnique({ where: { userId } });
    if (!existing) {
        const streak = await prisma.userStreak.create({
            data: { userId, currentStreak: 1, longestStreak: 1, totalDays: 1, lastActiveDate: today }
        });
        return NextResponse.json({ streak });
    }

    const lastDate = existing.lastActiveDate ? new Date(existing.lastActiveDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);
    const diffDays = lastDate ? Math.round((today.getTime() - lastDate.getTime()) / 86400000) : 999;

    if (diffDays === 0) return NextResponse.json({ streak: existing });

    let newCurrent = diffDays === 1 ? existing.currentStreak + 1 : 1;
    const streak = await prisma.userStreak.update({
        where: { userId },
        data: {
            currentStreak: newCurrent,
            longestStreak: Math.max(newCurrent, existing.longestStreak),
            totalDays: existing.totalDays + 1,
            lastActiveDate: today
        }
    });
    return NextResponse.json({ streak });
}
