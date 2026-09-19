import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { 
      eventType = 'CREATE', 
      candidateTitle = '', 
      candidateName = '', 
      template = 'developer', 
      data = null, 
      config = null 
    } = body;

    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile|iphone|ipad|android/i.test(userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // Détection du navigateur
    let browser = 'other';
    if (/chrome|crios/i.test(userAgent)) browser = 'chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'firefox';
    else if (/safari/i.test(userAgent)) browser = 'safari';
    else if (/edg/i.test(userAgent)) browser = 'edge';

    const isRegistered = !!session?.user?.id;
    const userId = session?.user?.id || null;
    const userEmail = session?.user?.email || null;
    const userName = session?.user?.name || null;

    // 1. Enregistrement de l'événement d'activité CV (Invités ET Utilisateurs connectés)
    await prisma.cvEvent.create({
      data: {
        eventType,
        userType: isRegistered ? 'REGISTERED' : 'GUEST',
        userId,
        userEmail,
        userName,
        candidateTitle: candidateTitle || (data?.personal?.title) || null,
        candidateName: candidateName || `${data?.personal?.firstName || ''} ${data?.personal?.lastName || ''}`.trim() || null,
        template: template || config?.template || 'developer',
        deviceType,
        browser,
      },
    });

    // 2. Si l'utilisateur est connecté et que les données de son CV sont fournies,
    // on synchronise / sauvegarde son profil dans la base de données
    let savedProfile = null;
    if (isRegistered && data) {
      const title = candidateTitle || data?.personal?.title || 'Mon CV';
      const cName = candidateName || `${data?.personal?.firstName || ''} ${data?.personal?.lastName || ''}`.trim() || userName || '';
      const existingProfile = await prisma.cvProfile.findFirst({
        where: { userId: session.user.id },
      });

      if (existingProfile) {
        savedProfile = await prisma.cvProfile.update({
          where: { id: existingProfile.id },
          data: {
            title,
            candidateName: cName,
            template: config?.template || template || existingProfile.template,
            color: config?.color || existingProfile.color,
            font: config?.font || existingProfile.font,
            dataJson: JSON.stringify(data),
            configJson: config ? JSON.stringify(config) : existingProfile.configJson,
            lastAction: eventType,
            downloadsCount: eventType === 'DOWNLOAD_PDF' ? { increment: 1 } : undefined,
          },
        });
      } else {
        savedProfile = await prisma.cvProfile.create({
          data: {
            userId: session.user.id,
            userEmail: session.user.email,
            userName: session.user.name,
            title,
            candidateName: cName,
            template: config?.template || template || 'developer',
            color: config?.color || '#a78bfa',
            font: config?.font || 'inter',
            dataJson: JSON.stringify(data),
            configJson: config ? JSON.stringify(config) : null,
            lastAction: eventType,
            downloadsCount: eventType === 'DOWNLOAD_PDF' ? 1 : 0,
            isGuest: false,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      profileId: savedProfile?.id || null,
      message: isRegistered ? 'Profil synchronisé avec succès' : 'Événement enregistré avec succès',
    });
  } catch (error) {
    console.error('Erreur API tracking CV:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
