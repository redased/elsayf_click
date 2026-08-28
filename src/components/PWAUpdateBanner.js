'use client';

import { useEffect, useState, useRef } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';

const AUTO_DELAY = 8;

export default function PWAUpdateBanner() {
  const [visible, setVisible]   = useState(false);
  const [countdown, setCountdown] = useState(AUTO_DELAY);
  const [updating, setUpdating] = useState(false);

  const newWorkerRef  = useRef(null);
  const dismissed     = useRef(false);
  const timerRef      = useRef(null);

  /* ── detect SW update ─────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            newWorkerRef.current = nw;
            if (!dismissed.current) {
              setCountdown(AUTO_DELAY);
              setVisible(true);
            }
          }
        });
      });

      // poll every 30 min
      const poll = setInterval(() => reg.update(), 30 * 60 * 1000);
      return () => clearInterval(poll);
    });

    // when controller changes → SW activated → reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, []);

  /* ── countdown tick ───────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    timerRef.current = setInterval(() => {
      setCountdown((p) => Math.max(0, p - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [visible]);

  /* ── auto-apply when countdown hits 0 ────────────────── */
  useEffect(() => {
    if (visible && countdown === 0 && !updating) {
      applyUpdate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, visible]);

  const applyUpdate = () => {
    if (updating) return;
    setUpdating(true);
    clearInterval(timerRef.current);
    const worker = newWorkerRef.current || navigator.serviceWorker?.controller;
    if (worker) {
      worker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    dismissed.current = true;
    clearInterval(timerRef.current);
    setVisible(false);
  };

  if (!visible) return null;

  const R   = 16;
  const circ = 2 * Math.PI * R;
  const dash = (countdown / AUTO_DELAY) * circ;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4"
      style={{ animation: 'pwaSlideDown .3s ease-out' }}
    >
      <style>{`
        @keyframes pwaSlideDown {
          from { opacity:0; transform:translateX(-50%) translateY(-20px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
      `}</style>

      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl shadow-2xl shadow-indigo-900/40 p-4 border border-indigo-500/30">

        {/* header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/15 rounded-xl p-2.5 flex-shrink-0">
            <Download size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">Mise à jour disponible</p>
            <p className="text-white/70 text-xs">Nouvelle version d'Elsayf prête</p>
          </div>

          {/* countdown ring */}
          {!updating && (
            <div className="relative w-9 h-9 flex-shrink-0">
              <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r={R}
                  fill="none" stroke="white" strokeWidth="2.5"
                  strokeDasharray={circ} strokeDashoffset={circ - dash}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                {countdown}
              </span>
            </div>
          )}

          <button onClick={handleDismiss} className="p-1 hover:bg-white/20 rounded-full transition-colors" title="Ignorer">
            <X size={16} className="text-white/70" />
          </button>
        </div>

        {/* buttons */}
        <div className="flex gap-2">
          <button
            onClick={applyUpdate}
            disabled={updating}
            className="flex-1 bg-white text-indigo-700 font-bold py-2 px-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RefreshCw size={15} className={updating ? 'animate-spin' : ''} />
            {updating ? 'Mise à jour…' : 'Maintenant'}
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white/15 text-white font-semibold py-2 px-3 rounded-xl hover:bg-white/25 transition-colors text-sm"
          >
            Plus tard
          </button>
        </div>

        <p className="text-center text-white/50 text-xs mt-2">
          Automatique dans {countdown}s · Aucune donnée perdue
        </p>
      </div>
    </div>
  );
}
