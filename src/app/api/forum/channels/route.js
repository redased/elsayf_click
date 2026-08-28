import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const channels = await prisma.channel.findMany({
            orderBy: [
                { position: 'asc' },
                { name: 'asc' }
            ]
        });

        return NextResponse.json({ channels });
    } catch (error) {
        console.error('Error fetching channels:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
