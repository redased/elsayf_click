'use client';

import { useEffect, useState } from 'react';
import { Bell, X, Check } from 'lucide-react';

export default function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);

      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 30000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Votre navigateur ne supporte pas les notifications');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        new Notification('🎉 Notifications activées !', {
          body: 'Vous recevrez les nouveautés d\'Elsayf',
          icon: '/logo.png',
          badge: '/logo.png',
          tag: 'notification-enabled'
        });

        setShowPrompt(false);
      } else {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Erreur demande de permission:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('push-prompt-dismissed', Date.now().toString());
  };

  if (permission === 'granted' || permission === 'denied' || !showPrompt) {
    return null;
  }

  return (
    <div
      style={{ animation: 'slideInFromBottom 0.3s ease-out' }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
    >
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-6 text-white relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 rounded-xl p-3 animate-bounce">
            <Bell size={32} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Restez informé !</h3>
            <p className="text-sm text-white/90">
              Recevez les notifications des nouveaux cours
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>Nouveaux cours disponibles</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>Rappels d'apprentissage</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>Progression et achievements</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={requestPermission}
            className="flex-1 bg-white text-green-600 font-semibold py-2 px-4 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            <Bell size={18} />
            Activer
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white/20 text-white font-semibold py-2 px-4 rounded-xl hover:bg-white/30 transition-colors"
          >
            Non merci
          </button>
        </div>

        <div className="mt-3 text-xs text-white/70 text-center">
          🔒 Pas de spam, promis !
        </div>
      </div>
    </div>
  );
}
