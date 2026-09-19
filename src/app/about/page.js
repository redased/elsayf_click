import Link from 'next/link';
import { Sparkles, Terminal, Shield, Award, Users, BookOpen, ArrowRight, Code, Brain, Target } from 'lucide-react';

export const metadata = {
  title: 'À Propos | Elsayf E-Learning',
  description: "Découvrez l'histoire, la mission et l'équipe pédagogique d'Elsayf. Notre mission : former les talents de demain en Data, IA, Cybersécurité et Automatisation.",
  alternates: {
    canonical: 'https://elsayf.click/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-purple-400" /> Mission & Vision Pédagogique
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Apprendre par la Pratique,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400">
              Sans Barrière Technique.
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            <strong>Elsayf</strong> est une plateforme e-learning conçue pour transformer la façon dont les étudiants,
            professionnels et reconvertis apprennent la Data Science, l'Intelligence Artificielle, la Cybersécurité et la Gestion d'Entreprise.
          </p>
        </div>

        {/* Chiffres Clés */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Formations Publiées', val: '10+', sub: '100% axées pratique' },
            { label: 'Exécution Cloud', val: 'Direct Web', sub: 'Zero installation' },
            { label: 'Pôles Spécialisés', val: '4 Filières', sub: 'Data, Cyber, Business, IA' },
            { label: 'Accès Libre', val: '100% Gratuit', sub: 'Pour tous les étudiants' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 text-center space-y-1 hover:border-purple-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-purple-400">{stat.val}</div>
              <div className="font-bold text-white text-sm">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Piliers Pédagogiques */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-white">Notre Méthodologie Unique</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Nous rejetons l'apprentissage passif à base de vidéos monotones. Sur Elsayf, chaque concept théorique est
              immédiatement validé par du code, des simulations et des projets d'entreprise réels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-gray-900/80 to-gray-950 border border-gray-800 hover:border-purple-500/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Terminal size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">IDE & Simulateur Intégré</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Exécutez vos scripts Python, testez vos requêtes de données et découvrez les commandes sans installer aucun logiciel
                sur votre machine. Tout fonctionne dans votre navigateur avec exécution sécurisée.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-gray-900/80 to-gray-950 border border-gray-800 hover:border-blue-500/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Cybersécurité & Données Réelles</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Apprenez la défense de systèmes (SOC, SIEM Wazuh, Suricata) et l'audit web OWASP Top 10 sur des environnements
                contrôlés et éthiques pour acquérir des réflexes immédiatement opérationnels.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-gray-900/80 to-gray-950 border border-gray-800 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">IA & Productivité Augmentée</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Découvrez comment utiliser l'IA générative (Google Antigravity, LLMs) pour automatiser vos tableurs Excel,
                rédiger des scripts robustes et multiplier par dix votre productivité au travail.
              </p>
            </div>
          </div>
        </div>

        {/* L'Équipe & Expertise */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-950/30 via-gray-900 to-indigo-950/30 border border-purple-500/20 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Target size={14} /> Transparence & Engagement
              </div>
              <h2 className="text-3xl font-bold text-white">Une Équipe Passionnée par l'Éducation Tech</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Conçue par des ingénieurs logiciels, data scientists et consultants en cybersécurité, Elsayf a pour vocation
                de réduire le fossé entre les compétences académiques théoriques et les besoins concrets des entreprises.
              </p>
              <p className="text-gray-400 text-sm">
                Vous avez une suggestion de cours, un partenariat académique ou une demande d'intervention ? Notre équipe est
                toujours à votre écoute.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/25"
                >
                  Contacter l'équipe <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-4 w-full md:w-80 shrink-0">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Informations Légales</div>
              <div className="space-y-2 text-sm text-gray-300">
                <div><span className="text-gray-500">Plateforme :</span> Elsayf E-Learning</div>
                <div><span className="text-gray-500">Domaine :</span> elsayf.click</div>
                <div><span className="text-gray-500">Support :</span> contact@statlabo.com</div>
                <div><span className="text-gray-500">Disponibilité :</span> 24/7 en ligne</div>
              </div>
              <div className="pt-2 border-t border-gray-800 flex items-center gap-2 text-xs text-emerald-400">
                <Award size={14} /> Plateforme certifiée sans prérequis d'entrée
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
