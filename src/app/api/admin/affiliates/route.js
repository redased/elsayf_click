import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

// GET: Fetch generated links statistics
export async function GET(request) {
    try {
        const session = await auth();
        if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });

        // Check access: Admin or Affiliate Access
        if (user.role !== 'ADMIN' && !user.affiliateAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const links = await prisma.affiliateLink.findMany({
            where: user.role === 'ADMIN' ? {} : { creatorId: user.id }, // Admin sees all, others see theirs
            orderBy: { createdAt: 'desc' },
            include: {
                creator: { select: { name: true, email: true } }
            }
        });

        return NextResponse.json({ links });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Generate a new link
export async function POST(request) {
    try {
        const session = await auth();
        if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (user.role !== 'ADMIN' && !user.affiliateAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { platform, sourceType, influencerName, originalUrl } = await request.json();

        // Generate unique code based on metadata
        // Pattern: platform-source-influencer-random
        const cleanStr = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const baseCode = `${cleanStr(platform)}-${cleanStr(sourceType)}-${cleanStr(influencerName)}`;
        const uniqueSuffix = nanoid(6);
        const code = `${baseCode}-${uniqueSuffix}`;

        const newLink = await prisma.affiliateLink.create({
            data: {
                code,
                platform,
                sourceType,
                influencerName,
                originalUrl: originalUrl || '/',
                creatorId: user.id
            }
        });

        return NextResponse.json(newLink);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
