import { Download, Globe, Monitor, Smartphone, Terminal } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Télécharger Elsayf Desktop',
  description: 'Téléchargez l\'application desktop Elsayf pour une expérience optimale',
};

export default function TelechargerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050a14] to-[#0a1428] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl">
              <Download size={64} />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Télécharger Elsayf Desktop
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Profitez d'une expérience native avec l'application desktop Elsayf
          </p>
        </div>

        {/* Options de téléchargement */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">

          {/* Option 1: PWA */}
          <div className="bg-gradient-to-br from-[#0f1a2e] to-[#1a2744] rounded-3xl p-8 border border-[rgba(255,255,255,0.1)] hover:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Globe className="text-blue-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Application Web (PWA)</h2>
                <p className="text-gray-400">Installation rapide via navigateur</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Installation en 2 secondes ⚡</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Très léger (&lt; 5 MB)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Fonctionne hors-ligne</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Compatible tous appareils</span>
              </div>
            </div>

            <div className="bg-[#050a14] rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">Comment installer :</p>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Ouvrez elsayf.com dans Chrome/Edge</li>
                <li>Cliquez sur 📥 "Installer" dans la barre d'adresse</li>
                <li>Voilà ! C'est installé</li>
              </ol>
            </div>

            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-center py-3 px-6 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>

          {/* Option 2: Desktop App */}
          <div className="bg-gradient-to-br from-[#0f1a2e] to-[#1a2744] rounded-3xl p-8 border border-[rgba(255,255,255,0.1)] hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Monitor className="text-purple-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Application Desktop</h2>
                <p className="text-gray-400">Expérience 100% native</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Interface 100% native</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Menu personnalisé</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Raccourcis clavier</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Notifications desktop</span>
              </div>
            </div>

            {/* Download buttons */}
            <div className="space-y-3">
              {/* Windows */}
              <a
                href="/dist/Elsayf-1.0.0-win.exe"
                className="flex items-center justify-between bg-[#050a14] hover:bg-[#0a1428] p-4 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Monitor size={20} className="text-blue-400" />
                  <div>
                    <div className="font-semibold">Windows</div>
                    <div className="text-xs text-gray-500">.exe - 150 MB</div>
                  </div>
                </div>
                <Download size={20} className="text-gray-500 group-hover:text-white transition-colors" />
              </a>

              {/* macOS */}
              <a
                href="/dist/Elsayf-1.0.0-mac.dmg"
                className="flex items-center justify-between bg-[#050a14] hover:bg-[#0a1428] p-4 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className="text-gray-300" />
                  <div>
                    <div className="font-semibold">macOS</div>
                    <div className="text-xs text-gray-500">.dmg - 160 MB</div>
                  </div>
                </div>
                <Download size={20} className="text-gray-500 group-hover:text-white transition-colors" />
              </a>

              {/* Linux */}
              <a
                href="/dist/Elsayf-1.0.0-linux.AppImage"
                className="flex items-center justify-between bg-[#050a14] hover:bg-[#0a1428] p-4 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Terminal size={20} className="text-yellow-400" />
                  <div>
                    <div className="font-semibold">Linux</div>
                    <div className="text-xs text-gray-500">.AppImage - 140 MB</div>
                  </div>
                </div>
                <Download size={20} className="text-gray-500 group-hover:text-white transition-colors" />
              </a>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-6">
              <p className="text-sm text-yellow-200">
                ⚠️ <strong>Note:</strong> Les fichiers de téléchargement seront disponibles après le premier build.
                Utilisez le dossier <code className="bg-yellow-500/20 px-2 py-1 rounded">electron-app</code> pour créer les installateurs.
              </p>
            </div>
          </div>

        </div>

        {/* Comparison table */}
        <div className="bg-[#0f1a2e] rounded-3xl p-8 border border-[rgba(255,255,255,0.1)]">
          <h3 className="text-2xl font-bold mb-6 text-center">Comparaison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.1)]">
                  <th className="text-left py-3 px-4">Fonctionnalité</th>
                  <th className="text-center py-3 px-4">PWA</th>
                  <th className="text-center py-3 px-4">Desktop</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  <td className="py-3 px-4">Installation</td>
                  <td className="text-center py-3 px-4 text-green-400">⚡ 2 secondes</td>
                  <td className="text-center py-3 px-4 text-yellow-400">📦 1-2 min</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  <td className="py-3 px-4">Taille</td>
                  <td className="text-center py-3 px-4 text-green-400">&lt; 5 MB</td>
                  <td className="text-center py-3 px-4 text-yellow-400">150-200 MB</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  <td className="py-3 px-4">Mode hors-ligne</td>
                  <td className="text-center py-3 px-4 text-green-400">✓ Oui</td>
                  <td className="text-center py-3 px-4 text-green-400">✓ Oui</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  <td className="py-3 px-4">Menu personnalisé</td>
                  <td className="text-center py-3 px-4 text-red-400">✗ Non</td>
                  <td className="text-center py-3 px-4 text-green-400">✓ Oui</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Accès système complet</td>
                  <td className="text-center py-3 px-4 text-red-400">✗ Non</td>
                  <td className="text-center py-3 px-4 text-green-400">✓ Oui</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
