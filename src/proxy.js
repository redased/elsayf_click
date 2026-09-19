import { NextResponse } from 'next/server';

export function proxy(request) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // ─── Détection du domaine mycv.click ───────────────────────────────────────
  const isMyCvDomain =
    host.toLowerCase().includes('mycv.click') ||
    host.toLowerCase().includes('mycv');

  if (isMyCvDomain) {
    // Exclure les routes qui ne doivent PAS être réécrites :
    // - /api/** (NextAuth, tracking, etc.)
    // - /cv/** (déjà les bonnes pages CV)
    // - /cv-builder (redirection déjà gérée)
    // - /login, /register (auth pages)
    // - fichiers statiques (gérés par le matcher)
    const isApiRoute = pathname.startsWith('/api/');
    const isCvRoute = pathname.startsWith('/cv');
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

    // Racine "/" → réécriture interne vers "/cv" (homepage gallery)
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/cv';
      return NextResponse.rewrite(url);
    }

    // Toutes les autres routes sur mycv.click → on les laisse passer normalement
    // (le contenu CV est déjà dans /cv et /cv/builder)
    return NextResponse.next();
  }

  // ─── Domaine elsayf.click → comportement normal ────────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepter toutes les requêtes sauf les fichiers statiques,
     * les images et les favicons.
     */
    '/((?!_next/static|_next/image|favicon.ico|ads.txt|manifest.json|logo.png|sw.js|robots.txt|sitemap.xml).*)',
  ],
};
