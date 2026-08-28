import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

function isAdmin(role) { return role === 'ADMIN' || role === 'SUPER_ADMIN'; }

export async function GET() {
    const session = await auth();
    if (!session || !isAdmin(session.user?.role)) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        include: { course: { select: { id: true, title: true } } }
    });
    return NextResponse.json({ coupons });
}

export async function POST(req) {
    const session = await auth();
    if (!session || !isAdmin(session.user?.role)) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    const { code, discount, maxUses, courseId, expiresAt } = await req.json();
    if (!code || discount == null) return NextResponse.json({ error: 'code et discount requis' }, { status: 400 });
    const coupon = await prisma.coupon.create({
        data: {
            code: code.toUpperCase().trim(),
            discount: parseFloat(discount),
            maxUses: maxUses ? parseInt(maxUses) : null,
            courseId: courseId || null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            active: true
        }
    });
    return NextResponse.json({ coupon });
}

export async function DELETE(req) {
    const session = await auth();
    if (!session || !isAdmin(session.user?.role)) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
