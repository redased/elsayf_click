import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendDailyTelegramReport, sendTelegramMessage } from '@/lib/telegram';

export async function POST(request) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    // Autoriser soit un admin authentifié, soit un secret cron (ex: tâche programmée VPS)
    const authHeader = request.headers.get('authorization');
    const isCronAuthorized = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isAdmin && !isCronAuthorized) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 401 });
    }

    const result = await sendDailyTelegramReport();

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || result.reason || 'Erreur lors de l\'envoi Telegram',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Rapport statistique envoyé avec succès sur Telegram !',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Erreur API Telegram Report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  // Même logique en GET pour faciliter les pings de cron externes
  return POST(request);
}
