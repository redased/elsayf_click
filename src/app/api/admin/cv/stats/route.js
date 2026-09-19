import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    // 1. Profils enregistrés par les utilisateurs connectés
    const profiles = await prisma.cvProfile.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          }
        }
      }
    });

    // 2. Activités récentes (Invités ET Membres)
    const recentEvents = await prisma.cvEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 150,
    });

    // 3. Agrégations & Métriques clés
    const [totalProfiles, totalEvents, totalPdfDownloads, totalGuestEvents, totalRegisteredEvents] = await Promise.all([
      prisma.cvProfile.count(),
      prisma.cvEvent.count(),
      prisma.cvEvent.count({ where: { eventType: 'DOWNLOAD_PDF' } }),
      prisma.cvEvent.count({ where: { userType: 'GUEST' } }),
      prisma.cvEvent.count({ where: { userType: 'REGISTERED' } }),
    ]);

    // 4. Distribution par modèles
    const templateCounts = {};
    recentEvents.forEach(ev => {
      const t = ev.template || 'developer';
      templateCounts[t] = (templateCounts[t] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalProfiles,
        totalEvents,
        totalPdfDownloads,
        totalGuestEvents,
        totalRegisteredEvents,
        templateCounts,
      },
      profiles,
      recentEvents,
    });
  } catch (error) {
    console.error('Erreur API admin stats CV:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
