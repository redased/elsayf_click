import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      theme = 'dark-cyber',
      primaryColor = '#a78bfa',
      accentColor = '#10b981',
      heroTitle = 'Générateur de CV Professionnel & Dynamique',
      heroSubtitle = 'Créez un CV élégant, structuré et conforme aux attentes des recruteurs.',
      defaultTemplate = 'developer',
      showAtsGuide = true,
      showTemplates = true,
      showFaq = true,
      showAds = true,
    } = body;

    const settings = await prisma.cvSiteSetting.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        theme,
        primaryColor,
        accentColor,
        heroTitle,
        heroSubtitle,
        defaultTemplate,
        showAtsGuide,
        showTemplates,
        showFaq,
        showAds,
      },
      update: {
        theme,
        primaryColor,
        accentColor,
        heroTitle,
        heroSubtitle,
        defaultTemplate,
        showAtsGuide,
        showTemplates,
        showFaq,
        showAds,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Paramètres du design mis à jour avec succès !',
      settings,
    });
  } catch (error) {
    console.error('Erreur sauvegarde réglages CV:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
