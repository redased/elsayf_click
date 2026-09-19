import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST() {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 401 });
    }

    const testMessage = `
🤖 <b>Connexion Elsayf Telegram Réussie !</b>
✅ Le bot Telegram est correctement configuré et prêt à vous envoyer les alertes et statistiques d'étudiants et du créateur de CV.
🕒 Date : ${new Date().toLocaleString('fr-FR')}
    `.trim();

    const result = await sendTelegramMessage(testMessage);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || result.reason || 'Erreur lors de l\'envoi du message de test',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Message de test envoyé sur votre Telegram avec succès !',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
