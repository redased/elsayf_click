import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.cvSiteSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = {
        id: 'default',
        theme: 'dark-cyber',
        primaryColor: '#a78bfa',
        accentColor: '#10b981',
        heroTitle: 'Générateur de CV Professionnel & Dynamique',
        heroSubtitle: 'Créez un CV élégant, structuré et conforme aux attentes des recruteurs. Choisissez un modèle, pré-remplissez votre profil en 1 clic et exportez votre PDF instantanément.',
        defaultTemplate: 'developer',
        showAtsGuide: true,
        showTemplates: true,
        showFaq: true,
        showAds: true,
      };
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Erreur API settings CV:', error);
    return NextResponse.json({
      success: false,
      settings: {
        id: 'default',
        theme: 'dark-cyber',
        primaryColor: '#a78bfa',
        accentColor: '#10b981',
        heroTitle: 'Générateur de CV Professionnel & Dynamique',
        heroSubtitle: 'Créez un CV élégant, structuré et conforme aux attentes des recruteurs.',
        defaultTemplate: 'developer',
        showAtsGuide: true,
        showTemplates: true,
        showFaq: true,
        showAds: true,
      }
    });
  }
}
