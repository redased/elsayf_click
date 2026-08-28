import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/super-admin/affiliate-links
 * Get all affiliate links with creator info
 */
export async function GET(request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const links = await prisma.affiliateLink.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                clickEvents: {
                    select: {
                        id: true,
                        deviceType: true,
                        source: true,
                        converted: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: {
                        usersReferred: true
                    }
                }
            },
            orderBy: { clicks: 'desc' }
        });

        return NextResponse.json({
            success: true,
            links,
            total: links.length
        });

    } catch (error) {
        console.error('Error fetching affiliate links:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
