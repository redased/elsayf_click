'use client';
import Link from 'next/link';
import { Shield, BookOpen, FileText, Mail, Heart, ExternalLink, Terminal, Sparkles } from 'lucide-react';

export default function Footer() {
  const openCookieSettings = () => {
    try {
      localStorage.removeItem('cookieConsent');
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <footer className="bg-[#050914] border-t border-gray-800/80 text-gray-400 text-sm">
      {/* Grille principale */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Colonne 1: Identité & Mission (2 cols sur large) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                <img src="/logo.png?v=2" alt="Elsayf Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                  eL Sayf
                </span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                  E-Learning & IA Platform
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Plateforme d'apprentissage interactif par la pratique. Formations gratuites d'élite en Data Science,
              Cybersécurité, Intelligence Artificielle et Gestion d'Entreprise avec simulateur de code en ligne.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                10 Formations en libre accès
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                <Sparkles size={12} /> Simulateur de code Cloud
              </span>
            </div>
          </div>

          {/* Colonne 2: Formations Principales */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Filières de Formation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/courses/power-bi-business-intelligence-data-analytics" className="hover:text-purple-400 transition-colors">
                  Power BI & Data Analytics
                </Link>
              </li>
              <li>
                <Link href="/courses/cybersecurite-protection-systemes-defensive" className="hover:text-purple-400 transition-colors">
                  Cybersécurité & SOC (Blue Team)
                </Link>
              </li>
              <li>
                <Link href="/courses/ethical-hacking-securite-web-pentest" className="hover:text-purple-400 transition-colors">
                  Ethical Hacking & Pentest OWASP
                </Link>
              </li>
              <li>
                <Link href="/courses/automatisation-excel-comptabilite-detaillee" className="hover:text-purple-400 transition-colors">
                  Comptabilité & Automatisation
                </Link>
              </li>
              <li>
                <Link href="/courses/google-antigravity-mastery" className="hover:text-purple-400 transition-colors">
                  Google Antigravity & IA
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 pt-1">
                  Voir tout le catalogue →
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Outils & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Outils & Pratique
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/cv" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <FileText size={14} className="text-purple-400" /> Studio CV Pro A4
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <Terminal size={14} className="text-blue-400" /> Éditeur Python en Ligne
                </Link>
              </li>
              <li>
                <Link href="/parents" className="hover:text-purple-400 transition-colors">
                  Espace Parents
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-purple-400 transition-colors">
                  Grille Tarifaire & Options
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-emerald-400 hover:underline">
                  Créer un compte gratuit
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Conformité & Légal (Crucial AdSense) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Informations Légales
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors font-medium">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple-400 transition-colors font-medium">
                  Conditions d'Utilisation (CGU)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors font-medium">
                  À Propos d'Elsayf
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors font-medium">
                  Contact & Assistance
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookieSettings}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer text-gray-500"
                >
                  Gérer les Cookies
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Ligne inférieure de copyright et conformité */}
      <div className="border-t border-gray-900 bg-[#03060c] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Elsayf (elsayf.click). Tous droits réservés.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>Conforme Google Consent Mode v2</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-400 underline underline-offset-2">
              Cookies & Publicité
            </Link>
            <span>•</span>
            <a href="mailto:contact@statlabo.com" className="hover:text-gray-400">
              contact@statlabo.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
