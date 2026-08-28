'use client';
import { useEffect } from 'react';

const SITE_KEY = '6Lciz3IsAAAAAF4micPtkOKBsDaOdaasL0CvPlDv';

/**
 * Composant pour charger reCAPTCHA Enterprise uniquement quand nécessaire.
 * Évite les conflits avec Jitsi Meet et autres scripts externes.
 */
export default function RecaptchaLoader() {
  useEffect(() => {
    // Vérifier si reCAPTCHA est déjà chargé
    if (window.grecaptcha?.enterprise) {
      return;
    }

    // Vérifier si le script est déjà en cours de chargement
    const existingScript = document.querySelector(`script[src*="recaptcha/enterprise.js"]`);
    if (existingScript) {
      return;
    }

    // Créer et charger le script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.id = 'recaptcha-script';

    script.onerror = () => {
      console.warn('[reCAPTCHA] Échec du chargement du script');
    };

    document.head.appendChild(script);

    // Nettoyage au démontage du composant
    return () => {
      // On ne supprime PAS le script pour éviter des rechargements
      // reCAPTCHA reste disponible pour toute la session
    };
  }, []);

  return null; // Ce composant ne rend rien visuellement
}
