import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// PATCH - Mettre à jour l'accès d'une leçon
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const updateData = {};

    // Type d'accès: INHERIT (hérite du cours), FREE (gratuit), PAID (payant), FREE_WITH_ADS
    if (data.accessType !== undefined) updateData.accessType = data.accessType;
    if (data.isFree !== undefined) updateData.isFree = data.isFree;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    console.error('Error updating lesson access:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET - Récupérer toutes les leçons d'un cours avec leurs paramètres d'accès
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId requis' }, { status: 400 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        order: true,
        isFree: true,
        accessType: true,
        duration: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ success: true, lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
