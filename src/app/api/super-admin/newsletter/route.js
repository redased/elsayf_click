import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscribers = await prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ subscribers });
    } catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { emails } = await req.json();

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: 'Aucun email fourni' }, { status: 400 });
        }

        const results = { added: 0, duplicates: 0, invalid: 0, details: [] };

        for (const rawEmail of emails) {
            const email = rawEmail.trim().toLowerCase();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                results.invalid++;
                results.details.push({ email: rawEmail, status: 'invalid' });
                continue;
            }

            try {
                await prisma.newsletterSubscriber.create({
                    data: { email, source: 'manual' }
                });
                results.added++;
                results.details.push({ email, status: 'added' });
            } catch (e) {
                if (e.code === 'P2002') {
                    results.duplicates++;
                    results.details.push({ email, status: 'duplicate' });
                } else {
                    throw e;
                }
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error adding newsletter subscribers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();

        await prisma.newsletterSubscriber.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
