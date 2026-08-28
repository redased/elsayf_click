import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Group users by type (preference)
        const preferences = await prisma.user.groupBy({
            by: ['type'],
            _count: {
                type: true,
            },
        });

        const totalUsers = await prisma.user.count();

        // Format data for the frontend graph
        // Expected output format: [{ name: 'En Ligne', value: 10 }, { name: 'Présentiel', value: 5 }]
        const chartData = preferences.map(pref => ({
            name: pref.type === 'online' ? 'En Ligne' : (pref.type === 'onsite' ? 'Présentiel' : 'Hybride'),
            value: pref._count.type
        }));

        return NextResponse.json({
            total: totalUsers,
            distribution: chartData
        });

    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
