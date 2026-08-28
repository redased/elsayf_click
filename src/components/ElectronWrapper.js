'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, RefreshCw, X } from 'lucide-react';

export default function ElectronWrapper({ children }) {
  const router = useRouter();
  const [updateState, setUpdateState] = useState(null);
  // null | { type: 'downloading', version } | { type: 'progress', percent } | { type: 'ready', version }

  useEffect(() => {
    if (typeof window === 'undefined' || !window.electronAPI) return;

    window.electronAPI.getAppVersion().then((version) => {
      console.log('[Electron] Version:', version);
    });

    if (!window.electronAPI.on) return;

    // Navigation depuis le menu natif
    window.electronAPI.on('navigate', (path) => {
      router.push(path);
    });

    // Mise à jour en cours de téléchargement
    window.electronAPI.on('update-downloading', ({ version }) => {
      setUpdateState({ type: 'downloading', version });
    });

    // Progression du téléchargement
    window.electronAPI.on('update-progress', ({ percent }) => {
      setUpdateState((prev) => ({ ...prev, type: 'progress', percent }));
    });

    // Mise à jour prête à installer
    window.electronAPI.on('update-ready', ({ version }) => {
      setUpdateState({ type: 'ready', version });
    });
  }, [router]);

  const handleApplyUpdate = () => {
    if (window.electronAPI?.send) {
      window.electronAPI.send('apply-update');
    }
  };

  const handleDismiss = () => setUpdateState(null);

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  return (
    <>
      {children}

      {/* Banner de mise à jour Electron */}
      {isElectron && updateState && (
        <div className="fixed bottom-6 right-6 z-[9999] w-80">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600 rounded-2xl shadow-2xl p-4">

            {updateState.type === 'downloading' && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 rounded-xl p-2 flex-shrink-0">
                  <Download size={18} className="text-blue-400 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">Mise à jour v{updateState.version}</p>
                  <p className="text-slate-400 text-xs">Téléchargement en cours...</p>
                </div>
                <button onClick={handleDismiss} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={14} className="text-slate-400" />
                </button>
              </div>
            )}

            {updateState.type === 'progress' && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 rounded-xl p-2 flex-shrink-0">
                  <Download size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">Téléchargement...</p>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${updateState.percent}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{updateState.percent}%</p>
                </div>
              </div>
            )}

            {updateState.type === 'ready' && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500/20 rounded-xl p-2 flex-shrink-0">
                    <Download size={18} className="text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">v{updateState.version} prête !</p>
                    <p className="text-slate-400 text-xs">Redémarrez pour appliquer</p>
                  </div>
                  <button onClick={handleDismiss} className="p-1 hover:bg-white/10 rounded-full">
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyUpdate}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Redémarrer
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="flex-1 bg-white/10 hover:bg-white/15 text-slate-300 font-semibold py-2 px-3 rounded-xl text-sm transition-colors"
                  >
                    Plus tard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
