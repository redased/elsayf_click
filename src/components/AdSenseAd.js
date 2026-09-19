'use client';
import { useEffect, useRef } from 'react';

export default function AdSenseAd({ slot, format = 'auto', className = '', label = true }) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense non chargé ou bloqueur de publicité actif
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1168470266191675';

  // Ne pas afficher d'espace vide si le client ID n'est pas encore configure
  if (!clientId) {
    return null;
  }

  return (
    <div className={`w-full max-w-5xl mx-auto my-8 px-4 flex flex-col items-center ${className}`}>
      {label && (
        <span className="text-[10px] uppercase font-semibold tracking-widest text-gray-500 mb-1.5 select-none">
          Publicité
        </span>
      )}
      <div className="w-full min-h-[90px] flex justify-center items-center overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
