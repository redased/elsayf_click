import { NextResponse } from 'next/server';

// Reçoit les erreurs client-side (global-error.js) et les log côté serveur
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, stack, digest, url, ua, time } = body;

    // Log structuré côté serveur (visible dans les logs Docker/PM2)
    console.error('[CLIENT_ERROR]', JSON.stringify({
      message,
      digest,
      url,
      ua: ua?.slice(0, 120),
      time,
      // stack uniquement en dev pour éviter de polluer les logs prod
      ...(process.env.NODE_ENV === 'development' && { stack }),
    }));

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
