'use client';

import { sendNotification, notifyNewCourse, notifyLearningReminder, notifyCertificate, notifyPromotion, scheduleNotification } from '@/lib/notifications';
import { Bell, BookOpen, Trophy, Flame } from 'lucide-react';

export default function NotificationTester() {
  // Ce composant est pour les tests uniquement
  // À retirer ou à mettre derrière une auth admin

  const testNotifications = [
    {
      label: 'Nouveau cours',
      icon: <BookOpen size={20} />,
      action: () => notifyNewCourse({ id: 1, title: 'Python Machine Learning', slug: 'python-ml' }),
      color: 'from-blue-600 to-cyan-600'
    },
    {
      label: 'Rappel apprentissage',
      icon: <Bell size={20} />,
      action: () => notifyLearningReminder(),
      color: 'from-green-600 to-emerald-600'
    },
    {
      label: 'Certificat obtenu',
      icon: <Trophy size={20} />,
      action: () => notifyCertificate('Python pour Débutants'),
      color: 'from-yellow-600 to-orange-600'
    },
    {
      label: 'Promotion',
      icon: <Flame size={20} />,
      action: () => notifyPromotion('-50% sur tous les cours cette semaine !'),
      color: 'from-red-600 to-pink-600'
    }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <details className="group">
        <summary className="cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all">
          🔔 Test Notifications
        </summary>

        <div className="mt-2 bg-[#0f1a2e] rounded-xl p-4 shadow-2xl border border-[rgba(255,255,255,0.1)]">
          <p className="text-sm text-gray-400 mb-3">Cliquez pour tester:</p>

          <div className="space-y-2">
            {testNotifications.map((notif, index) => (
              <button
                key={index}
                onClick={notif.action}
                className={`w-full flex items-center gap-3 bg-gradient-to-r ${notif.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity`}
              >
                {notif.icon}
                <span className="text-sm font-medium">{notif.label}</span>
              </button>
            ))}

            <button
              onClick={() => scheduleNotification(
                '⏰ Notification programmée !',
                'Cette notification a été planifiée il y a 3 secondes',
                3000
              )}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Bell size={20} />
              <span className="text-sm font-medium">Dans 3 secondes...</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Visible uniquement en développement
          </p>
        </div>
      </details>
    </div>
  );
}
