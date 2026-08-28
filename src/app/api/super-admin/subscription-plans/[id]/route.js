import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// PATCH - Mettre à jour un plan
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.name_ar !== undefined) updateData.name_ar = data.name_ar;
    if (data.name_en !== undefined) updateData.name_en = data.name_en;
    if (data.name_ja !== undefined) updateData.name_ja = data.name_ja;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.description_ar !== undefined) updateData.description_ar = data.description_ar;
    if (data.description_en !== undefined) updateData.description_en = data.description_en;
    if (data.description_ja !== undefined) updateData.description_ja = data.description_ja;
    if (data.region !== undefined) updateData.region = data.region;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.priceDzd !== undefined) updateData.priceDzd = parseFloat(data.priceDzd);
    if (data.priceUsd !== undefined) updateData.priceUsd = parseFloat(data.priceUsd);
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.duration !== undefined) updateData.duration = parseInt(data.duration);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.features !== undefined) {
      updateData.features = data.features ? JSON.stringify(data.features) : null;
    }
    if (data.courseIds !== undefined) {
      updateData.courseIds = data.courseIds ? JSON.stringify(data.courseIds) : null;
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un plan
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;

    // Vérifier s'il y a des abonnements actifs
    const activeSubscriptions = await prisma.userSubscription.count({
      where: {
        planId: id,
        status: 'active'
      }
    });

    if (activeSubscriptions > 0) {
      return NextResponse.json({
        error: `Impossible de supprimer : ${activeSubscriptions} abonnement(s) actif(s)`
      }, { status: 400 });
    }

    await prisma.subscriptionPlan.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Plan supprimé' });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
