import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Détection du domaine mycv.click ou www.mycv.click
  const isMyCvDomain = host.toLowerCase().includes('mycv.click');

  if (isMyCvDomain) {
    // Si l'utilisateur accède à la racine "/" sur mycv.click,
    // on réécrit en interne vers la page du studio CV ("/cv")
    // tout en gardant "mycv.click/" dans l'URL du navigateur.
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/cv', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepter toutes les requêtes sauf les fichiers statiques,
     * les images, l'API et les favicons.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|ads.txt|manifest.json|logo.png|sw.js).*)',
  ],
};
