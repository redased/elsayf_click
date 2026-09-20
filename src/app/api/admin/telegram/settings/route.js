import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTelegramSettings, saveTelegramSettings } from '@/lib/telegram';

export async function GET() {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const settings = getTelegramSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Erreur GET /api/admin/telegram/settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const res = saveTelegramSettings(body);

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Paramètres Telegram mis à jour avec succès !',
      settings: res.settings,
    });
  } catch (error) {
    console.error('Erreur POST /api/admin/telegram/settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
