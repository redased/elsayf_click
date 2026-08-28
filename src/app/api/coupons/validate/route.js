import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const { code, courseId } = await req.json();
    if (!code) return NextResponse.json({ valid: false, message: 'Code requis' });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });
    if (!coupon) return NextResponse.json({ valid: false, message: 'Code invalide' });
    if (!coupon.active) return NextResponse.json({ valid: false, message: 'Code désactivé' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return NextResponse.json({ valid: false, message: 'Code expiré' });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ valid: false, message: 'Code épuisé' });
    if (coupon.courseId && coupon.courseId !== courseId) return NextResponse.json({ valid: false, message: 'Code non valide pour ce cours' });

    return NextResponse.json({ valid: true, discount: coupon.discount, message: `Réduction de ${coupon.discount}%` });
}
