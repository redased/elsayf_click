import { NextResponse } from 'next/server';

const SITE_KEY     = '6Lciz3IsAAAAAF4micPtkOKBsDaOdaasL0CvPlDv';
const API_KEY      = process.env.RECAPTCHA_API_KEY;        // clé serveur Google Cloud
const PROJECT_ID   = process.env.RECAPTCHA_PROJECT_ID;     // ex: "mon-projet-gcloud"
const MIN_SCORE    = 0.5; // seuil minimum acceptable (0.0 bot → 1.0 humain)

export async function POST(request) {
  try {
    const { token, action } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token manquant' }, { status: 400 });
    }

    // Si les clés serveur ne sont pas configurées → on accepte (dégradé gracieux)
    if (!API_KEY || !PROJECT_ID) {
      console.warn('[reCAPTCHA] RECAPTCHA_API_KEY ou RECAPTCHA_PROJECT_ID non configuré – vérification ignorée');
      return NextResponse.json({ success: true, score: null, reason: 'not_configured' });
    }

    // Appel API Google reCAPTCHA Enterprise
    const res = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            token,
            siteKey: SITE_KEY,
            expectedAction: action,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[reCAPTCHA] API error:', err);
      return NextResponse.json({ success: false, error: 'Erreur API reCAPTCHA' }, { status: 500 });
    }

    const data = await res.json();
    const score       = data?.riskAnalysis?.score ?? 0;
    const tokenValid  = data?.tokenProperties?.valid === true;
    const actionMatch = !action || data?.tokenProperties?.action === action;

    console.log('[reCAPTCHA]', { action, score, tokenValid, actionMatch });

    if (!tokenValid || !actionMatch || score < MIN_SCORE) {
      return NextResponse.json({
        success: false,
        score,
        error: !tokenValid ? 'Token invalide' : !actionMatch ? 'Action incorrecte' : 'Score trop bas',
      }, { status: 403 });
    }

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error('[reCAPTCHA] Exception:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 });
  }
}
