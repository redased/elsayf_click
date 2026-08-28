import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Health Check API
 * GET /api/health
 */
export async function GET(request) {
    const healthcheck = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        environment: process.env.NODE_ENV,
        status: 'ok'
    };

    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        healthcheck.database = 'connected';

        // Count users
        const userCount = await prisma.user.count();
        healthcheck.users = userCount;

        return NextResponse.json(healthcheck);
    } catch (error) {
        healthcheck.status = 'error';
        healthcheck.error = error.message;
        return NextResponse.json(healthcheck, { status: 503 });
    }
}
