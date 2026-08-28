import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Code required' }, { status: 400 });
        }

        const affiliateLink = await prisma.affiliateLink.findUnique({
            where: { code }
        });

        if (!affiliateLink) {
            return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
        }

        // Increment clicks (Views)
        await prisma.affiliateLink.update({
            where: { code },
            data: { clicks: { increment: 1 } }
        });

        // Set Cookie (30 days validity)
        cookies().set('ref_code', code, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Tracking Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
