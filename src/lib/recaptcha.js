const SITE_KEY = '6Lciz3IsAAAAAF4micPtkOKBsDaOdaasL0CvPlDv';

/**
 * Génère un token reCAPTCHA Enterprise pour l'action donnée.
 * Retourne null si reCAPTCHA n'est pas chargé (dégradé gracieux).
 * @param {'LOGIN'|'REGISTER'|'INVITATION'|string} action
 * @returns {Promise<string|null>}
 */
export async function getRecaptchaToken(action) {
  if (typeof window === 'undefined') return null;
  if (!window.grecaptcha?.enterprise) return null;

  try {
    return await new Promise((resolve) => {
      window.grecaptcha.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha.enterprise.execute(SITE_KEY, { action });
          resolve(token);
        } catch (e) {
          console.warn('[reCAPTCHA] execute error:', e);
          resolve(null);
        }
      });
    });
  } catch (e) {
    console.warn('[reCAPTCHA] ready error:', e);
    return null;
  }
}

/**
 * Vérifie le token côté serveur via notre propre API.
 * @returns {Promise<{success:boolean, score?:number}>}
 */
export async function verifyRecaptchaToken(token, action) {
  if (!token) return { success: true }; // dégradé gracieux si pas de token

  const res = await fetch('/api/recaptcha/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, action }),
  });

  return res.json();
}
