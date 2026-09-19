import Link from 'next/link';
import { Shield, Lock, Eye, CheckCircle2, ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Politique de Confidentialité | Elsayf',
  description: 'Politique de confidentialité et protection des données personnelles de la plateforme Elsayf. Informations relatives aux cookies, Google AdSense et vos droits.',
  alternates: {
    canonical: 'https://elsayf.click/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        {/* En-tête */}
        <div className="space-y-4 border-b border-gray-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Shield size={14} /> Données & Vie Privée
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Dernière mise à jour : 19 septembre 2026 • En vigueur pour tous les utilisateurs d'Elsayf (elsayf.click).
          </p>
        </div>

        {/* Note de conformité Google AdSense */}
        <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-4">
          <Lock className="text-purple-400 mt-1 shrink-0" size={24} />
          <div className="space-y-2 text-sm">
            <h2 className="text-base font-bold text-white">Transparence & Respect de votre vie privée</h2>
            <p className="text-gray-300 leading-relaxed">
              La plateforme <strong>Elsayf</strong> s'engage à protéger la confidentialité de vos données personnelles.
              Cette politique vous informe de manière claire sur la collecte, l'utilisation, les cookies tiers
              (notamment <strong>Google AdSense</strong> et <strong>Google Analytics</strong>) ainsi que vos droits selon
              les réglementations applicables (RGPD et Loi n° 18-07 relative à la protection des données).
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-10 text-gray-300 leading-relaxed text-sm sm:text-base">

          {/* 1. Responsable de Traitement */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              1. Responsable du Traitement des Données
            </h2>
            <p>
              Le site <strong>elsayf.click</strong> est édité par l'équipe Elsayf E-Learning. Pour toute question ou demande
              relative à vos données personnelles, vous pouvez contacter notre délégué à la protection des données à l'adresse
              suivante :{' '}
              <a href="mailto:contact@statlabo.com" className="text-purple-400 hover:underline font-medium">
                contact@statlabo.com
              </a>.
            </p>
          </section>

          {/* 2. Données Collectées */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              2. Données Personnelles Collectées
            </h2>
            <p>Nous ne collectons que les données strictement nécessaires au bon fonctionnement de la plateforme :</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Création de compte et authentification</strong> : Nom, prénom, adresse e-mail, mot de passe chiffré (bcryptjs) ou identifiant OAuth Google.</li>
              <li><strong>Suivi pédagogique</strong> : Progression dans les cours (leçons complétées, exercices validés, score de gamification XP/badges).</li>
              <li><strong>Données de navigation et techniques</strong> : Adresse IP (anonymisée), type d'appareil, navigateur utilisé, système d'exploitation, pages consultées.</li>
            </ul>
          </section>

          {/* 3. Clause Spécifique Google AdSense & Cookies Tiers */}
          <section className="space-y-4 p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
              3. Publicités Tiers, Cookies Google AdSense & Personnalisation
            </h2>
            <p>
              Afin de maintenir l'accès gratuit à nos cours de programmation, d'IA, de gestion et de cybersécurité,
              nous pouvons diffuser des annonces publicitaires via <strong>Google AdSense</strong>.
            </p>
            <div className="space-y-3 pl-4 border-l-2 border-purple-500/40">
              <p>
                <strong>Utilisation des cookies publicitaires par Google :</strong> Des fournisseurs tiers, y compris Google,
                utilisent des cookies (notamment le cookie DoubleClick) pour diffuser des annonces sur notre site en fonction
                des visites antérieures des internautes sur <em>elsayf.click</em> ou sur d'autres sites web.
              </p>
              <p>
                <strong>Diffusion ciblée :</strong> Grâce aux cookies publicitaires, Google et ses partenaires adaptent les
                annonces diffusées auprès de nos visiteurs en fonction de leur navigation sur notre site et/ou d'autres sites Internet.
              </p>
              <p>
                <strong>Désactivation de la publicité personnalisée :</strong> Vous pouvez à tout moment choisir de désactiver
                la publicité personnalisée de Google en vous rendant sur la page de gestion des paramètres des annonces Google :
              </p>
              <div className="pt-1">
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 transition-all font-semibold text-sm"
                >
                  Paramètres des annonces Google <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-xs text-gray-400">
                Vous pouvez également refuser l'utilisation de cookies tiers pour la publicité ciblée via le portail{' '}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                  www.aboutads.info
                </a>.
              </p>
            </div>
          </section>

          {/* 4. Google Analytics & Mesure d'Audience */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              4. Google Analytics & Google Consent Mode v2
            </h2>
            <p>
              Nous utilisons <strong>Google Analytics 4</strong> pour comprendre la façon dont nos cours sont consultés et
              améliorer continuellement l'expérience pédagogique. Nous respectons le <strong>Google Consent Mode v2</strong>.
            </p>
            <p>
              Lors de votre première visite, un bandeau de cookies vous permet d'accepter ou de refuser les cookies d'analyse
              et publicitaires. Si vous refusez, aucun cookie publicitaire ni traceur analytique non essentiel n'est activé.
            </p>
          </section>

          {/* 5. Sécurité et Hébergement */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              5. Sécurité et Conservation des Données
            </h2>
            <p>
              Toutes les communications avec notre serveur sont chiffrées via le protocole HTTPS/TLS. Les mots de passe
              sont hachés avec des algorithmes sécurisés (bcryptjs) et ne sont jamais stockés en clair.
            </p>
            <p>
              Vos données de compte sont conservées tant que votre profil reste actif. Vous pouvez demander la clôture et la
              suppression définitive de votre compte à tout moment.
            </p>
          </section>

          {/* 6. Vos Droits */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              6. Vos Droits (Accès, Rectification, Suppression)
            </h2>
            <p>Conformément aux lois applicables sur la protection de la vie privée, vous disposez des droits suivants :</p>
            <ul className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                { title: "Droit d'accès", desc: "Obtenir une copie de l'ensemble de vos données." },
                { title: "Droit de rectification", desc: "Modifier vos informations de profil obsolètes." },
                { title: "Droit à l'effacement", desc: "Supprimer définitivement votre compte et historique." },
                { title: "Droit d'opposition", desc: "Refuser les cookies d'analyse ou marketing." },
              ].map((r) => (
                <li key={r.title} className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    {r.title}
                  </div>
                  <p className="text-xs text-gray-400">{r.desc}</p>
                </li>
              ))}
            </ul>
            <p className="pt-2">
              Pour exercer l'un de ces droits, contactez-nous directement par e-mail à{' '}
              <a href="mailto:contact@statlabo.com" className="text-purple-400 hover:underline">
                contact@statlabo.com
              </a>.
            </p>
          </section>

          {/* 7. Modifications */}
          <section className="space-y-3 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-bold text-white">7. Évolution de la Politique</h2>
            <p className="text-gray-400 text-sm">
              Nous nous réservons le droit de mettre à jour cette politique de confidentialité pour refléter toute évolution
              technique, législative ou liée aux exigences de nos partenaires (tels que Google AdSense). Toute modification
              sera immédiatement publiée sur cette page.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
