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
      take: 200,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            accounts: {
              select: {
                provider: true,
              }
            }
          }
        }
      }
    });

    // 2. Utilisateurs inscrits avec Google ou compte Gmail
    const googleUsers = await prisma.user.findMany({
      where: {
        OR: [
          { accounts: { some: { provider: 'google' } } },
          { email: { endsWith: '@gmail.com' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        lastLoginDate: true,
        accounts: {
          select: {
            provider: true,
          }
        },
        cvProfiles: {
          select: {
            id: true,
            title: true,
            candidateName: true,
            template: true,
            downloadsCount: true,
            updatedAt: true,
            lastAction: true,
          }
        }
      }
    });

    // 3. Activités récentes (Invités ET Membres)
    const recentEvents = await prisma.cvEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 150,
    });

    // 4. Agrégations & Métriques clés
    const [
      totalProfiles, 
      totalEvents, 
      totalPdfDownloads, 
      totalGuestEvents, 
      totalRegisteredEvents,
      totalGoogleUsers
    ] = await Promise.all([
      prisma.cvProfile.count(),
      prisma.cvEvent.count(),
      prisma.cvEvent.count({ where: { eventType: 'DOWNLOAD_PDF' } }),
      prisma.cvEvent.count({ where: { userType: 'GUEST' } }),
      prisma.cvEvent.count({ where: { userType: 'REGISTERED' } }),
      prisma.user.count({
        where: {
          OR: [
            { accounts: { some: { provider: 'google' } } },
            { email: { endsWith: '@gmail.com' } }
          ]
        }
      }),
    ]);

    // Utilisateurs Google ayant créé/sauvegardé au moins 1 CV
    const googleUsersWithCvCount = googleUsers.filter(u => u.cvProfiles && u.cvProfiles.length > 0).length;

    // 5. Distribution par modèles
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
        totalGoogleUsers,
        googleUsersWithCvCount,
        templateCounts,
      },
      profiles,
      googleUsers,
      recentEvents,
    });
  } catch (error) {
    console.error('Erreur API admin stats CV:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
