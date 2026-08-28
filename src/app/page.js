'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Terminal, Video, Cpu, Zap, Crown, Globe } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import AdSenseAd from '../components/AdSenseAd';
import { useLanguage } from '@/context/LanguageContext';

function getDisplayPrice(plan, region) {
  if (region === 'ALGERIA' && plan.priceDzd > 0)
    return { amount: plan.priceDzd.toLocaleString('fr-FR', { maximumFractionDigits: 0 }), currency: 'DZD' };
  if (region === 'EUROPE' && plan.priceUsd > 0)
    return { amount: plan.priceUsd.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }), currency: '€' };
  return {
    amount: plan.price.toLocaleString('fr-FR', { maximumFractionDigits: 0 }),
    currency: plan.currency,
  };
}

const safeParseFeatures = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
};

export default function Home() {
  const { t } = useLanguage();
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const [region, setRegion] = useState('GLOBAL');
  const [country, setCountry] = useState('');
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    // Détection géoloc + chargement plans en parallèle
    const fetchGeo = fetch('/api/geo/detect')
      .then(r => r.json())
      .then(d => { if (d.success) { setRegion(d.region); setCountry(d.country); } })
      .catch(() => { });

    const fetchPlans = fetch('/api/super-admin/subscription-plans')
      .then(r => r.json())
      .then(d => { if (d.success) setPlans(d.plans.filter(p => p.isActive)); })
      .catch(() => { })
      .finally(() => setPlansLoading(false));

    Promise.all([fetchGeo, fetchPlans]);
  }, []);

  // Plans actifs pour la région détectée (+ GLOBAL)
  const regionalPlans = plans.filter(p => p.region === region || p.region === 'GLOBAL');
  // Plan le plus pertinent (premier de la région, sinon GLOBAL)
  const mainPlan = regionalPlans[0] || null;

  return (
    <div className="flex flex-col gap-20 pb-20 overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 pt-20">
        <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a78bfa] rounded-full blur-[150px] opacity-20 animate-pulse"></div>

        <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-6">
          <span className="px-4 py-2 rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa] text-sm font-semibold tracking-wider uppercase">
            {t('hero.badge')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-[#a78bfa] leading-tight" dangerouslySetInnerHTML={{ __html: t('hero.title') }}>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/register" className="btn btn-primary text-lg px-8 py-3 rounded-xl flex items-center gap-2">
              {t('hero.start_free')} <ArrowRight size={20} />
            </Link>
            <Link href="/formation-ia" className="group relative px-8 py-3 rounded-xl bg-gray-900 border border-violet-500/50 text-white font-semibold hover:border-violet-500 hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all flex items-center gap-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="relative z-10">{t('hero.new_ia')}</span>
            </Link>
            <Link href="/courses/antigravity-business-excel" className="group relative px-8 py-3 rounded-xl bg-gray-900 border border-emerald-500/50 text-white font-semibold hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all flex items-center gap-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="relative z-10">📈 Gestion Entreprise — GRATUIT</span>
            </Link>
            <Link href="#demo" className="btn btn-outline text-lg px-8 py-3 rounded-xl">
              {t('hero.view_demo')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Code Demo Section */}
      <section id="demo" className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Codez directement dans le navigateur</h2>
          <p className="text-gray-400">Environnement pré-configuré pour Python, Django, Docker.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#a78bfa] to-blue-600 rounded-2xl blur opacity-30"></div>
          <CodeEditor />
        </motion.div>
      </section>

      {/* AdSense Slot 1 */}
      <AdSenseAd slot="1234567890" format="horizontal" />

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 hover:bg-[#a78bfa]/5 group">
            <div className="w-14 h-14 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] mb-6 group-hover:scale-110 transition-transform">
              <Terminal size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Dev Fullstack</h3>
            <p className="text-gray-400">Apprenez Django, Docker, et les meilleures pratiques GitHub. De zéro à héros.</p>
          </div>
          <div className="glass-card p-8 hover:bg-[#a78bfa]/5 group">
            <div className="w-14 h-14 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] mb-6 group-hover:scale-110 transition-transform">
              <Video size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Live Mentoring</h3>
            <p className="text-gray-400">Intégration native Zoom & Google Meet. Sessions de code en direct avec nos experts.</p>
          </div>
          <div className="glass-card p-8 hover:bg-[#a78bfa]/5 group">
            <div className="w-14 h-14 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] mb-6 group-hover:scale-110 transition-transform">
              <Cpu size={30} />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI Powered</h3>
            <p className="text-gray-400">Assistance par Gemini et GPT intégrée. Configurez vos propres clés API pour une expérience personnalisée.</p>
          </div>
        </div>
      </section>

      {/* Formations disponibles */}
      <section className="container mx-auto px-4 py-10 relative mb-20">
        <div className="text-center mb-10">
          <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm font-semibold mb-4 inline-block border border-violet-500/20">
            100% Gratuit
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Nos Formations Disponibles</h2>
          <p className="text-gray-400">Commencez dès maintenant, aucun paiement requis.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: '📊',
              title: 'Power BI & Business Intelligence : Data Analytics & DAX',
              desc: 'Interface Power BI Desktop, modélisation Power Query (ETL), formules DAX, tableaux de bord interactifs Dark Mode et TP pratique.',
              slug: 'power-bi-business-intelligence-data-analytics',
              color: 'from-yellow-600 to-amber-600',
              border: 'border-yellow-500/40',
              badge: 'Power BI & Data Analytics'
            },
            {
              emoji: '🛡️',
              title: 'Cybersécurité & Protection des Systèmes (SOC)',
              desc: 'Hardening Linux, UFW, Fail2ban, SIEM Wazuh, IDS Suricata, PKI et Réponse aux Incidents. Protection complète Blue Team.',
              slug: 'cybersecurite-protection-systemes-defensive',
              color: 'from-red-600 to-rose-700',
              border: 'border-red-500/30',
              badge: 'Cybersécurité & SOC'
            },
            {
              emoji: '⚔️',
              title: 'Ethical Hacking & Audit Web OWASP Top 10',
              desc: 'Injections SQL, XSS, CSRF, SSRF, RCE, IDOR, Pentesting d\'APIs JWT et scripts Python d\'attaque éthique Red Team.',
              slug: 'ethical-hacking-securite-web-pentest',
              color: 'from-cyan-600 to-blue-700',
              border: 'border-cyan-500/30',
              badge: 'Ethical Hacking & Pentest'
            },
            {
              emoji: '🧾',
              title: 'Automatisation Excel & Comptabilité Détaillée',
              desc: 'Journal, Grand Livre, Balance 6 colonnes, Rapprochement bancaire, TVA, Bilan & Compte de résultat automatisés avec Python.',
              slug: 'automatisation-excel-comptabilite-detaillee',
              color: 'from-emerald-600 to-teal-700',
              border: 'border-emerald-500/30',
              badge: 'Comptabilité & Finance'
            },
            {
              emoji: '🤖',
              title: 'Google Antigravity : Maîtrise IA & Code',
              desc: 'Maîtrisez l\'assistant Antigravity pour coder plus vite grâce à l\'IA. Automatisez vos tâches et devenez un développeur augmenté.',
              slug: 'google-antigravity-mastery',
              color: 'from-violet-600 to-blue-600',
              border: 'border-violet-500/30',
              badge: 'IA & Productivité'
            },
            {
              emoji: '📊',
              title: 'Antigravity : Automatisation Excel Avancée',
              desc: 'Automatisez vos fichiers Excel avec Python et Antigravity. Formules, macros, rapports automatiques — zéro répétition.',
              slug: 'antigravity-excel-advanced',
              color: 'from-emerald-600 to-teal-600',
              border: 'border-emerald-500/30',
              badge: 'Excel & Python'
            },
            {
              emoji: '📈',
              title: 'Gestion d\'Entreprise avec Excel & Python',
              desc: 'Gérez votre TPE/PME avec Excel et Python. Guide complet pour débutants : comptabilité, RH, stocks, rapports — tout automatisé.',
              slug: 'antigravity-business-excel',
              color: 'from-orange-600 to-amber-600',
              border: 'border-orange-500/30',
              badge: 'Business & Gestion'
            },
          ].map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`}
              className={`group glass-card p-6 border ${c.border} hover:scale-[1.02] transition-all duration-300 flex flex-col gap-4`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shadow-lg`}>
                {c.emoji}
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{c.badge}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-2 group-hover:text-violet-300 transition-colors">{c.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{c.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/8">
                <span className="text-xs font-bold text-emerald-400">✓ GRATUIT</span>
                <span className="text-xs text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Commencer <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/courses" className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4">
            Voir toutes les formations →
          </Link>
        </div>
      </section>

      {/* AdSense Slot 2 */}
      <AdSenseAd slot="1234567891" format="rectangle" />

      {/* ── Parents Section ── */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#a78bfa]/10 via-night-blue to-night-blue border border-[#a78bfa]/30 p-8 md:p-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a78bfa]/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-semibold tracking-wider uppercase">
                {t('parents.title')}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                {t('parents.title')}
              </h2>
              <p className="text-lg text-gray-400">
                {t('parents.subtitle')}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-green-500/20 rounded-full text-green-500">
                    <CheckCircle size={16} />
                  </div>
                  <p className="text-gray-300 text-sm">{t('parents.card_1_title')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-green-500/20 rounded-full text-green-500">
                    <CheckCircle size={16} />
                  </div>
                  <p className="text-gray-300 text-sm">{t('parents.card_3_title')}</p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/parents" className="group relative px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all flex items-center gap-2 w-fit shadow-lg shadow-green-500/20">
                  {t('parents.cta')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="flex-1 relative w-full aspect-video md:aspect-auto">
              <div className="glass-card p-6 border-green-500/20 relative animate-float">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Espace Parent</h4>
                    <p className="text-xs text-gray-400 underline lowercase">elsayf.click/parents</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-3/4"></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progression Enfant</span>
                    <span className="text-green-500">75%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 bg-gray-900 rounded border border-gray-800"></div>
                    <div className="h-8 bg-gray-900 rounded border border-gray-800"></div>
                    <div className="h-8 bg-gray-900 rounded border border-gray-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing / Access Plans ── */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">{t('pricing.title')}</h2>

        {/* Indicateur de région */}
        {country && (
          <p className="text-sm text-gray-500 mb-10 flex items-center justify-center gap-1.5">
            <Globe size={14} />
            Prix affichés pour&nbsp;
            <span className="text-gray-300 font-medium">
              {region === 'ALGERIA' ? '🇩🇿 Algérie (DZD)' : region === 'EUROPE' ? '🇪🇺 Europe (EUR)' : '🌍 International'}
            </span>
            &nbsp;·&nbsp;
            <Link href="/pricing" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
              Voir tous les plans
            </Link>
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Plan Gratuit */}
          <div className="glass-card p-8 border-t-4 border-[#a78bfa] relative transform hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 bg-[#a78bfa] text-black text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAIRE</div>
            <h3 className="text-2xl font-bold mb-2">{t('pricing.student_plan')}</h3>
            <div className="text-4xl font-bold text-[#a78bfa] my-4">
              0 {region === 'ALGERIA' ? 'DZD' : '€'}
            </div>
            <p className="text-gray-400 mb-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Accès Immédiat
            </p>
            <ul className="text-left w-full space-y-3 mb-8 text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa]" /> {t('pricing.features.access_all')}</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa]" /> {t('pricing.features.cloud')}</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa]" /> {t('pricing.features.community')}</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa]" /> {t('pricing.features.mentoring')}</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#a78bfa]" /> {t('pricing.features.certif')}</li>
            </ul>
            <Link href="/register?plan=student" className="btn btn-primary w-full mt-auto text-lg py-4 shadow-lg shadow-violet-500/20">
              {t('pricing.select')}
            </Link>
          </div>

          {/* Plan payant (dynamique) ou Coming Soon */}
          {plansLoading ? (
            <div className="glass-card p-8 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : mainPlan ? (
            (() => {
              const { amount, currency } = getDisplayPrice(mainPlan, region);
              const features = safeParseFeatures(mainPlan.features);
              return (
                <div className="glass-card p-8 border-t-4 border-purple-500 relative transform hover:scale-105 transition-transform flex flex-col">
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    {region === 'ALGERIA' ? '🇩🇿 ALGÉRIE' : region === 'EUROPE' ? '🇪🇺 EUROPE' : 'PREMIUM'}
                  </div>

                  <div className="flex items-center justify-center mb-2">
                    {mainPlan.region === 'ALGERIA'
                      ? <Crown size={36} className="text-yellow-500" />
                      : <Zap size={36} className="text-purple-400" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{mainPlan.name}</h3>
                  {mainPlan.description && <p className="text-gray-400 text-sm mb-2">{mainPlan.description}</p>}

                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 my-4">
                    {amount} {currency}
                    <span className="text-sm text-gray-500 font-normal ml-1">
                      /{mainPlan.duration === 30 ? 'mois' : `${mainPlan.duration}j`}
                    </span>
                  </div>

                  <ul className="text-left w-full space-y-3 mb-8 text-gray-300 flex-1">
                    {['Accès complet à tous les cours', 'Sans publicité', 'Certificat professionnel', 'Support prioritaire'].map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-purple-400 shrink-0" /> {f}
                      </li>
                    ))}
                    {features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-purple-400 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>

                  <Link href="/pricing" className="btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white w-full mt-auto text-lg py-4 shadow-lg shadow-purple-500/20 rounded-xl font-bold text-center block">
                    Voir tous les plans →
                  </Link>

                  {mainPlan.region === 'ALGERIA' && (
                    <p className="text-center text-xs text-gray-500 mt-3">Paiement via Chargily (CIB, eddahabia)</p>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-8 border-t-4 border-gray-600 flex flex-col items-center opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed relative overflow-hidden">
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-2 rounded-full rotate-[-15deg] shadow-2xl">
                  {t('pricing.coming_soon')}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-400">{t('pricing.individual_plan')}</h3>
              <div className="text-4xl font-bold text-gray-500 my-4">--€<span className="text-sm text-gray-600">/mois</span></div>
              <ul className="text-left w-full space-y-3 mb-8 text-gray-500 blur-[1px]">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-600" /> {t('pricing.features.access_all')}</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-600" /> {t('pricing.features.cloud')}</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-600" /> {t('pricing.features.premium_support')}</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-600" /> {t('pricing.features.projects')}</li>
              </ul>
              <button disabled className="btn btn-outline w-full mt-auto border-gray-700 text-gray-600 cursor-not-allowed">
                {t('pricing.coming_soon')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* AdSense Slot 3 */}
      <AdSenseAd slot="1234567892" format="horizontal" />

    </div>
  );
}
