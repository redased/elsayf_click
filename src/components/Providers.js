'use client';

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from '@/context/LanguageContext';

export function Providers({ children }) {
    // Sur mycv.click, NextAuth doit pointer vers l'URL de l'API auth du même serveur
    // trustHost: true dans auth.ts permet les requêtes cross-domain
    return (
        <SessionProvider
            // Évite les erreurs de session sur les domaines secondaires (mycv.click)
            // en laissant Next-Auth utiliser l'URL relative courante
            refetchInterval={0}
            refetchOnWindowFocus={false}
        >
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </SessionProvider>
    );
}

