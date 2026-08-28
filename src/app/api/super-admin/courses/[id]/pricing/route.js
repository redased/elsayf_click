import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// PATCH - Mettre à jour le pricing d'un cours
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const updateData = {};

    // Pricing régional
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.priceDZ !== undefined) updateData.priceDZ = data.priceDZ ? parseFloat(data.priceDZ) : null;
    if (data.priceEU !== undefined) updateData.priceEU = data.priceEU ? parseFloat(data.priceEU) : null;

    // Type d'accès
    if (data.isFree !== undefined) updateData.isFree = data.isFree;
    if (data.isFreeWithAds !== undefined) updateData.isFreeWithAds = data.isFreeWithAds;
    if (data.accessType !== undefined) updateData.accessType = data.accessType;

    const course = await prisma.course.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Error updating course pricing:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
