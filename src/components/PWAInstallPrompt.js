'use client';

import { useEffect, useState, useRef } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function isDismissed() {
  try {
    const ts = localStorage.getItem('pwa-prompt-dismissed');
    return ts && Date.now() - parseInt(ts) < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    // Déjà installé en mode standalone → on n'affiche rien
    if (isStandalone()) return;

    // Déjà refusé récemment → on n'affiche rien
    if (isDismissed()) return;

    const handler = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const appInstalledHandler = () => {
      setShowPrompt(false);
      deferredPromptRef.current = null;
    };

    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    prompt.prompt();
    const { outcome } = await prompt.userChoice;

    deferredPromptRef.current = null;
    setShowPrompt(false);

    if (outcome === 'dismissed') {
      // Mémoriser le refus
      try { localStorage.setItem('pwa-prompt-dismissed', Date.now().toString()); } catch {}
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try { localStorage.setItem('pwa-prompt-dismissed', Date.now().toString()); } catch {}
  };

  if (!showPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      style={{ animation: 'slideInUp 0.35s ease-out' }}
    >
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl shadow-indigo-900/50 p-5 text-white border border-indigo-500/30">
        <button
          onClick={handleDismiss}
          aria-label="Fermer"
          className="absolute top-3 right-3 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/15 rounded-xl p-3 flex-shrink-0">
            <Smartphone size={28} />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">Installer Elsayf</h3>
            <p className="text-white/80 text-sm mt-0.5">
              Accès rapide depuis votre écran d'accueil
            </p>
          </div>
        </div>

        <ul className="text-xs text-white/70 mb-4 space-y-1 pl-1">
          <li>⚡ Installation en 2 secondes, moins de 5 Mo</li>
          <li>📶 Fonctionne hors-ligne (cours mis en cache)</li>
          <li>🔔 Notifications de nouvelles leçons</li>
        </ul>

        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 bg-white text-indigo-700 font-bold py-2.5 px-4 rounded-xl hover:bg-indigo-50 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Download size={15} />
            Installer
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white/15 text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-white/25 transition-colors text-sm"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
