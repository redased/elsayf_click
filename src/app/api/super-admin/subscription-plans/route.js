import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer tous les plans (public pour la page /pricing)
export async function GET(request) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'SUPER_ADMIN';

    const [plans, courses] = await Promise.all([
      prisma.subscriptionPlan.findMany({
        // Les non-admins ne voient que les plans actifs
        where: isAdmin ? {} : { isActive: true },
        orderBy: [{ region: 'asc' }, { price: 'asc' }]
      }),
      isAdmin
        ? prisma.course.findMany({ select: { id: true, title: true, slug: true }, orderBy: { title: 'asc' } })
        : Promise.resolve([])
    ]);

    return NextResponse.json({ success: true, plans, courses });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un nouveau plan
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const data = await request.json();
    const {
      name, name_ar, name_en, name_ja,
      description, description_ar, description_en, description_ja,
      region, price, priceDzd, priceUsd, currency,
      duration, features, courseIds, isActive
    } = data;

    if (!name || !region || price === undefined || !currency) {
      return NextResponse.json({
        error: 'Nom, région, prix et devise sont requis'
      }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name, name_ar, name_en, name_ja,
        description, description_ar, description_en, description_ja,
        region,
        price: parseFloat(price),
        priceDzd: parseFloat(priceDzd || 0),
        priceUsd: parseFloat(priceUsd || 0),
        currency,
        duration: duration || 30,
        features: features ? JSON.stringify(features) : null,
        courseIds: courseIds ? JSON.stringify(courseIds) : null,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ success: true, plan }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
