import Link from 'next/link';
import { FileText, CheckCircle2, ArrowLeft, AlertCircle, Scale } from 'lucide-react';

export const metadata = {
  title: "Conditions Générales d'Utilisation | Elsayf",
  description: "Conditions Générales d'Utilisation (CGU) de la plateforme e-learning Elsayf. Modalités d'accès aux formations, propriété intellectuelle et règles d'utilisation.",
  alternates: {
    canonical: 'https://elsayf.click/terms',
  },
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Scale size={14} /> Cadre Légal & Règles
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Dernière mise à jour : 19 septembre 2026 • Régit l'accès et l'utilisation de la plateforme Elsayf.
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-10 text-gray-300 leading-relaxed text-sm sm:text-base">

          {/* 1. Objet */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              1. Objet du Service
            </h2>
            <p>
              La plateforme <strong>Elsayf</strong> (accessible sur <em>elsayf.click</em>) propose un environnement
              e-learning complet comprenant des cours de programmation (Python, R Statistiques), de Data Analytics
              (Power BI, DAX), de Cybersécurité (Défensive SOC, Ethical Hacking OWASP), de gestion d'entreprise, ainsi que
              des outils interactifs tels qu'un éditeur de code en ligne et un studio de création de CV professionnel.
            </p>
            <p>
              L'accès à ces services implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation.
            </p>
          </section>

          {/* 2. Accès et Compte Utilisateur */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              2. Inscription et Sécurité du Compte
            </h2>
            <p>
              L'accès à certaines fonctionnalités (sauvegarde de la progression, validation des exercices de code,
              participation au forum d'entraide) nécessite la création d'un compte étudiant. L'utilisateur s'engage à fournir
              des informations exactes et à préserver la confidentialité de ses identifiants de connexion.
            </p>
            <p>
              Tout usage de vos identifiants est réputé effectué sous votre responsabilité. En cas de perte ou d'accès
              non autorisé, prévenez immédiatement notre équipe à{' '}
              <a href="mailto:contact@statlabo.com" className="text-purple-400 hover:underline">
                contact@statlabo.com
              </a>.
            </p>
          </section>

          {/* 3. Gratuité et Modèle Économique */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              3. Gratuité des Formations & Publicité
            </h2>
            <p>
              La majorité de nos parcours de formation sont mis à disposition gratuitement pour encourager l'accès à la culture
              numérique. Afin de financer les serveurs d'exécution de code, la maintenance et la création de contenus :
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-300">
              <li>Des espaces publicitaires conformes (Google AdSense) peuvent être diffusés sur les pages publiques.</li>
              <li>Des formules optionnelles ou dons participatifs peuvent être proposés sans altérer l'accès aux cours de base.</li>
              <li>Les utilisateurs s'engagent à ne pas altérer ou bloquer frauduleusement le fonctionnement des services.</li>
            </ul>
          </section>

          {/* 4. Règles d'Usage Éthique (Cybersécurité & Code) */}
          <section className="space-y-4 p-6 rounded-2xl bg-amber-950/15 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-amber-300 flex items-center gap-2">
              <AlertCircle size={24} /> 4. Règles d'Usage Éthique du Code et des Simulateurs
            </h2>
            <p>
              Les cours d'<strong>Ethical Hacking</strong>, de <strong>Cybersécurité</strong> et les outils de simulation de code
              fournis par Elsayf sont destinés à des fins <strong>strictement pédagogiques, défensives et éthiques</strong>.
            </p>
            <p className="text-sm text-gray-300">
              Il est formellement interdit d'utiliser les connaissances acquises ou l'infrastructure Elsayf pour commettre des
              attaques non autorisées, des scans de vulnérabilités sur des tiers sans consentement explicite, ou pour perturber
              des systèmes informatiques. Tout comportement illicite entraînera la clôture immédiate du compte et d'éventuelles
              poursuites judiciaires.
            </p>
          </section>

          {/* 5. Propriété Intellectuelle */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              5. Propriété Intellectuelle
            </h2>
            <p>
              L'ensemble des contenus pédagogiques, textes, vidéos, schémas, logos, interfaces graphiques et exercices
              disponibles sur Elsayf sont protégés par le droit de la propriété intellectuelle.
            </p>
            <p>
              L'utilisateur bénéficie d'un droit d'accès personnel, non exclusif et non transférable à des fins d'apprentissage
              individuel. Toute reproduction, distribution ou commercialisation sans accord écrit préalable est interdite.
            </p>
          </section>

          {/* 6. Disponibilité du Service */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              6. Disponibilité & Limitation de Responsabilité
            </h2>
            <p>
              Nous mettons en œuvre tous les moyens raisonnables pour garantir une disponibilité continue 24h/24 et 7j/7.
              Toutefois, l'accès peut être temporairement interrompu pour des besoins de maintenance logicielle ou des
              contraintes d'hébergement. Elsayf ne pourra être tenu responsable des pannes indépendantes de sa volonté.
            </p>
          </section>

          {/* 7. Droit Applicable */}
          <section className="space-y-3 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-bold text-white">7. Droit Applicable et Contact</h2>
            <p>
              Les présentes conditions sont régies par les réglementations en vigueur. Pour toute question juridique ou
              signalement, contactez-nous à{' '}
              <a href="mailto:contact@statlabo.com" className="text-purple-400 hover:underline">
                contact@statlabo.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
