'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FileText, Users, Download, Printer, Save, Palette, Eye, 
  CheckCircle2, Sparkles, Sliders, ShieldAlert, ArrowLeft, 
  Clock, Laptop, Smartphone, Search, RefreshCw, Layers, ExternalLink, Send, Bell,
  Mail, UserCheck, ChevronDown, ChevronUp, Copy, MapPin, Phone, Globe
} from 'lucide-react';
import TelegramSettingsCard from '@/components/admin/TelegramSettingsCard';

export default function AdminCvPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' | 'google' | 'activity' | 'design' | 'telegram'
  const [stats, setStats] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [googleUsers, setGoogleUsers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileFilter, setProfileFilter] = useState('all'); // 'all' | 'google' | 'downloaded'
  const [googleSearchQuery, setGoogleSearchQuery] = useState('');
  const [googleFilter, setGoogleFilter] = useState('all'); // 'all' | 'with_cv' | 'without_cv'
  const [copiedJson, setCopiedJson] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  // Formulaire de réglages du Design
  const [designForm, setDesignForm] = useState({
    theme: 'dark-cyber',
    primaryColor: '#a78bfa',
    accentColor: '#10b981',
    heroTitle: 'Générateur de CV Professionnel & Dynamique',
    heroSubtitle: 'Créez un CV élégant, structuré et conforme aux attentes des recruteurs. Choisissez un modèle, pré-remplissez votre profil en 1 clic et exportez votre PDF instantanément.',
    defaultTemplate: 'developer',
    showAtsGuide: true,
    showTemplates: true,
    showFaq: true,
    showAds: true,
  });
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState('');

  const handleSendTelegramReport = async () => {
    setIsSendingTelegram(true);
    setTelegramStatus('Envoi du rapport vers Telegram...');
    try {
      const res = await fetch('/api/admin/telegram/report', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTelegramStatus('✅ Rapport envoyé sur Telegram avec succès !');
      } else {
        setTelegramStatus(`❌ Erreur: ${data.error || 'Vérifiez vos variables TELEGRAM dans .env'}`);
      }
    } catch (e) {
      setTelegramStatus(`❌ Erreur réseau: ${e.message}`);
    } finally {
      setIsSendingTelegram(false);
      setTimeout(() => setTelegramStatus(''), 7000);
    }
  };

  const themes = [
    {
      id: 'dark-cyber',
      name: 'Dark Cyber (Actuel)',
      desc: 'Fond sombre #050a14, néons violets & émeraudes',
      bgClass: 'bg-[#050a14]',
      accentColor: '#a78bfa',
      tag: 'Tech & Moderne',
    },
    {
      id: 'minimal-light',
      name: 'Minimalist Light (Clair)',
      desc: 'Fond blanc épuré #f8fafc, typographie noire et contrastes nets',
      bgClass: 'bg-[#f8fafc]',
      accentColor: '#4f46e5',
      tag: 'Clarté Maximale',
    },
    {
      id: 'executive-navy',
      name: 'Executive Navy',
      desc: 'Bleu marine profond #0a1128, accents platine et dorés',
      bgClass: 'bg-[#0a1128]',
      accentColor: '#38bdf8',
      tag: 'Cadres & Direction',
    },
    {
      id: 'emerald-modern',
      name: 'Emerald Green',
      desc: 'Vert forêt sombre #051b14, accents menthe et argent',
      bgClass: 'bg-[#051b14]',
      accentColor: '#10b981',
      tag: 'Prestige & Nature',
    },
    {
      id: 'sunset-gradient',
      name: 'Sunset Luxe',
      desc: 'Prune foncé #180d2b, touches coucher de soleil rose cuivré',
      bgClass: 'bg-[#180d2b]',
      accentColor: '#f43f5e',
      tag: 'Créatif & Raffiné',
    }
  ];

  // Chargement des données
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/cv/stats'),
        fetch('/api/cv/settings'),
      ]);

      const statsData = await statsRes.json();
      const settingsData = await settingsRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
        setProfiles(statsData.profiles || []);
        setGoogleUsers(statsData.googleUsers || []);
        setRecentEvents(statsData.recentEvents || []);
      }

      if (settingsData.settings) {
        setDesignForm(settingsData.settings);
      }
    } catch (e) {
      console.error('Erreur chargement données Admin CV:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    if (isAdmin) {
      loadData();
    }
  }, [session]);

  const handleSaveDesign = async (e) => {
    e.preventDefault();
    setIsSavingDesign(true);
    setSaveSuccessMessage('');
    try {
      const res = await fetch('/api/admin/cv/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designForm),
      });
      const resData = await res.json();
      if (resData.success) {
        setSaveSuccessMessage('Le design et les paramètres de MyCV ont été mis à jour avec succès !');
        setTimeout(() => setSaveSuccessMessage(''), 4000);
      } else {
        alert(resData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (e) {
      alert('Erreur réseau lors de la sauvegarde');
    } finally {
      setIsSavingDesign(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#050a14] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Chargement du tableau de bord CV...</p>
      </div>
    );
  }

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050a14] text-white flex items-center justify-center p-6">
        <div className="p-8 rounded-2xl bg-white/5 border border-red-500/30 text-center max-w-md space-y-4">
          <ShieldAlert size={48} className="text-red-400 mx-auto" />
          <h1 className="text-2xl font-bold">Accès Réservé</h1>
          <p className="text-sm text-gray-400">Cette page est réservée aux administrateurs de la plateforme.</p>
          <Link href="/admin" className="inline-block px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold">
            Retour au Panel Admin
          </Link>
        </div>
      </div>
    );
  }

  const isGoogleProfile = (p) => {
    return Boolean(
      p.user?.accounts?.some((a) => a.provider === 'google') ||
      p.userEmail?.toLowerCase().endsWith('@gmail.com')
    );
  };

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = (
      p.userName?.toLowerCase().includes(q) ||
      p.userEmail?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q) ||
      p.candidateName?.toLowerCase().includes(q) ||
      p.template?.toLowerCase().includes(q)
    );
    if (!matchesQuery) return false;

    if (profileFilter === 'google') {
      return isGoogleProfile(p);
    }
    if (profileFilter === 'downloaded') {
      return (p.downloadsCount || 0) > 0;
    }
    return true;
  });

  const filteredGoogleUsers = googleUsers.filter((u) => {
    const q = googleSearchQuery.toLowerCase();
    const matchesQuery = (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.cvProfiles?.some((cp) => cp.title?.toLowerCase().includes(q) || cp.candidateName?.toLowerCase().includes(q))
    );
    if (!matchesQuery) return false;

    if (googleFilter === 'with_cv') {
      return u.cvProfiles && u.cvProfiles.length > 0;
    }
    if (googleFilter === 'without_cv') {
      return !u.cvProfiles || u.cvProfiles.length === 0;
    }
    return true;
  });

  const googleWithCvCount = googleUsers.filter(u => u.cvProfiles && u.cvProfiles.length > 0).length;

  return (
    <div className="min-h-screen bg-[#050a14] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation retour & En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1">
                <ArrowLeft size={14} /> Panel Admin
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-purple-400 text-xs font-semibold">Studio CV & MyCV.click</span>
            </div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-[#a78bfa]">
              Gestionnaire CV & Inscriptions Google
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Supervisez qui crée un compte avec Gmail, suivez qui a enregistré son CV dans le Cloud, et pilotez les alertes Telegram en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
              title="Rafraîchir les données"
            >
              <RefreshCw size={16} />
            </button>
            <Link
              href="/cv/builder"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
              title="Accéder au CV Builder"
            >
              <FileText size={14} />
              <span>CV Builder</span>
              <ExternalLink size={12} />
            </Link>
            <a
              href="https://mycv.click"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
            >
              <span>mycv.click</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={handleSendTelegramReport}
              disabled={isSendingTelegram}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-900/30 transition-all hover:scale-105 cursor-pointer"
              title="Envoyer un rapport complet Étudiants & CV directement sur votre Telegram"
            >
              <Send size={14} className={isSendingTelegram ? 'animate-pulse' : ''} />
              <span>{isSendingTelegram ? 'Envoi...' : 'Rapport Telegram'}</span>
            </button>
          </div>
        </div>

        {telegramStatus && (
          <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/40 text-xs sm:text-sm text-sky-200 flex items-center justify-between animate-fadeIn">
            <span>{telegramStatus}</span>
            <button onClick={() => setTelegramStatus('')} className="text-gray-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* Cartes Métriques Clés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-purple-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">CVs Enregistrés Cloud</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                <FileText size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalProfiles || 0}</p>
            <p className="text-[11px] text-gray-400">Profils sauvegardés dans la base de données</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-sky-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">Inscrits Google / Gmail</span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300">
                <Globe size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalGoogleUsers || googleUsers.length || 0}</p>
            <p className="text-[11px] text-emerald-400 font-medium">
              {googleWithCvCount} ont déjà enregistré leur CV
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-emerald-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Téléchargements PDF</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Download size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalPdfDownloads || 0}</p>
            <p className="text-[11px] text-gray-400">Fichiers PDF A4 exportés</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-amber-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Visiteurs Invités</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Laptop size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalGuestEvents || 0}</p>
            <p className="text-[11px] text-gray-400">Actions d'invités sans compte requis</p>
          </div>
        </div>

        {/* Onglets Principaux */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-1 flex-wrap">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profiles'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText size={16} />
            <span>CVs Enregistrés ({profiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-lg shadow-sky-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
            <span>Inscrits Google / Gmail ({googleUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock size={16} />
            <span>Flux d'Activité ({recentEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'design'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders size={16} />
            <span>Design du Site</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'telegram'
                ? 'bg-sky-600/25 text-sky-300 border border-sky-500/40 shadow-lg shadow-sky-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Send size={16} className="text-sky-400" />
            <span>Automatisation Telegram</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* ONGLET 1 : CVs ENREGISTRÉS DANS LE CLOUD                                  */}
        {/* ========================================================================= */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, titre, modèle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Filtres rapides */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setProfileFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    profileFilter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Tous ({profiles.length})
                </button>
                <button
                  onClick={() => setProfileFilter('google')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    profileFilter === 'google'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3.5 h-3.5" alt="G" />
                  <span>Comptes Google ({profiles.filter(isGoogleProfile).length})</span>
                </button>
                <button
                  onClick={() => setProfileFilter('downloaded')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    profileFilter === 'downloaded'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Download size={12} />
                  <span>Avec PDF ({profiles.filter(p => (p.downloadsCount || 0) > 0).length})</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#090e1d] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Utilisateur / Compte</th>
                      <th className="px-6 py-4">Titre du CV & Candidat</th>
                      <th className="px-6 py-4">Modèle & Style</th>
                      <th className="px-6 py-4">Téléchargements</th>
                      <th className="px-6 py-4">Dernière Sauvegarde</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          Aucun CV enregistré ne correspond à votre filtre.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p) => {
                        const isGoogle = isGoogleProfile(p);
                        return (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {p.user?.image ? (
                                  <img src={p.user.image} alt="" className="w-8 h-8 rounded-full border border-gray-700 shrink-0" />
                                ) : (
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                    isGoogle ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-purple-500/20 text-purple-400'
                                  }`}>
                                    {(p.userName || p.candidateName || 'U')[0].toUpperCase()}
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white text-xs sm:text-sm">
                                      {p.userName || p.candidateName || 'Utilisateur'}
                                    </span>
                                    {isGoogle && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30" title="Compte Google / Gmail">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-2.5 h-2.5" alt="G" /> Google
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400">{p.userEmail}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-purple-300">{p.title || 'CV Professionnel'}</span>
                                <span className="text-xs text-gray-400">Candidat : {p.candidateName || 'Non spécifié'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 capitalize text-white">
                                  {p.template}
                                </span>
                                {p.color && (
                                  <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: p.color }} title={`Couleur: ${p.color}`} />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Download size={12} /> {p.downloadsCount || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-400">
                              {new Date(p.updatedAt).toLocaleString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedProfile(p);
                                  setShowRawJson(false);
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                              >
                                <Eye size={14} />
                                <span>Voir le CV</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 2 : INSCRITS GOOGLE / GMAIL (QUI CRÉE UN COMPTE SUR MYCV / ELSAYF) */}
        {/* ========================================================================= */}
        {activeTab === 'google' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#090e1d] border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  <h2 className="text-lg font-bold text-white">Comptes Inscrits avec Google / Gmail</h2>
                </div>
                <p className="text-xs text-gray-400">
                  Suivez en temps réel les utilisateurs qui s'authentifient via Google sur <strong>mycv.click</strong> ou <strong>elsayf.click</strong> et vérifiez s'ils ont déjà sauvegardé leur CV.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  {googleWithCvCount} / {googleUsers.length} ont sauvegardé un CV
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filtrer par nom ou email Gmail..."
                  value={googleSearchQuery}
                  onChange={(e) => setGoogleSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Filtres CV Google */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setGoogleFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    googleFilter === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Tous ({googleUsers.length})
                </button>
                <button
                  onClick={() => setGoogleFilter('with_cv')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    googleFilter === 'with_cv'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>Avec CV Enregistré ({googleWithCvCount})</span>
                </button>
                <button
                  onClick={() => setGoogleFilter('without_cv')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    googleFilter === 'without_cv'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>Sans CV ({googleUsers.length - googleWithCvCount})</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#090e1d] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Utilisateur Google</th>
                      <th className="px-6 py-4">Email Gmail</th>
                      <th className="px-6 py-4">Date d'Inscription</th>
                      <th className="px-6 py-4">Statut CV</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredGoogleUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          Aucun utilisateur Google trouvé avec ce filtre.
                        </td>
                      </tr>
                    ) : (
                      filteredGoogleUsers.map((u) => {
                        const hasCv = u.cvProfiles && u.cvProfiles.length > 0;
                        const userCv = hasCv ? u.cvProfiles[0] : null;

                        return (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {u.image ? (
                                  <img src={u.image} alt="" className="w-9 h-9 rounded-full border border-sky-500/40 shrink-0" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-500/30">
                                    {(u.name || 'G')[0].toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{u.name || 'Utilisateur Google'}</span>
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white/10 text-gray-300">
                                      {u.role || 'STUDENT'}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-gray-400">ID: {u.id.slice(0, 10)}...</span>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-sky-300 font-medium text-xs sm:text-sm">{u.email}</span>
                            </td>

                            <td className="px-6 py-4 text-xs text-gray-400">
                              {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>

                            <td className="px-6 py-4">
                              {hasCv ? (
                                <div className="space-y-1">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    <CheckCircle2 size={12} />
                                    <span>{userCv.title || 'CV Enregistré'}</span>
                                  </div>
                                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                                    <span>Modèle: <strong className="text-gray-300 capitalize">{userCv.template}</strong></span>
                                    <span>•</span>
                                    <span>PDF: <strong className="text-emerald-400">{userCv.downloadsCount}</strong></span>
                                  </div>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700">
                                  <span>Pas encore de CV</span>
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              {hasCv ? (
                                <button
                                  onClick={() => {
                                    // Trouver le profil complet dans profiles
                                    const fullProfile = profiles.find((p) => p.userId === u.id || p.userEmail === u.email) || userCv;
                                    setSelectedProfile(fullProfile);
                                    setShowRawJson(false);
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                                >
                                  <Eye size={14} />
                                  <span>Consulter le CV</span>
                                </button>
                              ) : (
                                <span className="text-xs text-gray-500 italic">En attente</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 2 : FLUX D'ACTIVITÉ EN DIRECT (INVITÉS & CONNECTÉS)                */}
        {/* ========================================================================= */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-800 bg-[#090e1d] overflow-hidden shadow-2xl">
              <div className="p-4 bg-white/5 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Événements de création et téléchargement en temps réel
                </span>
                <span className="text-xs text-gray-500">150 dernières actions</span>
              </div>
              <div className="divide-y divide-gray-800/60 max-h-[600px] overflow-y-auto">
                {recentEvents.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">Aucune activité enregistrée.</div>
                ) : (
                  recentEvents.map((ev) => {
                    const isGuest = ev.userType === 'GUEST';
                    const isDownload = ev.eventType === 'DOWNLOAD_PDF';
                    const isPrint = ev.eventType === 'PRINT';

                    return (
                      <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDownload ? 'bg-emerald-500/20 text-emerald-400' :
                            isPrint ? 'bg-indigo-500/20 text-indigo-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {isDownload ? <Download size={16} /> :
                             isPrint ? <Printer size={16} /> :
                             <FileText size={16} />}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isGuest 
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {isGuest ? 'Visiteur Invité (Non inscrit)' : 'Membre Connecté'}
                              </span>
                              <span className="font-semibold text-sm text-white">
                                {ev.candidateTitle || 'CV Standard'}
                              </span>
                              {ev.candidateName && (
                                <span className="text-xs text-gray-400">({ev.candidateName})</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span>Action: <strong className="text-gray-300">{ev.eventType}</strong></span>
                              <span>•</span>
                              <span>Modèle: <strong className="text-purple-300 capitalize">{ev.template}</strong></span>
                              {ev.userEmail && (
                                <>
                                  <span>•</span>
                                  <span className="text-gray-300">{ev.userEmail}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs text-gray-400 shrink-0">
                          <div className="flex items-center gap-1 text-gray-500 justify-end mb-1">
                            {ev.deviceType === 'mobile' ? <Smartphone size={13} /> : <Laptop size={13} />}
                            <span className="capitalize">{ev.browser || 'Web'}</span>
                          </div>
                          <span>{new Date(ev.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 3 : PERSONNALISATION DYNAMIQUE DU DESIGN (THÈMES & TEXTES)          */}
        {/* ========================================================================= */}
        {activeTab === 'design' && (
          <form onSubmit={handleSaveDesign} className="space-y-8">
            {saveSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            {/* Sélecteur de Thème Visuel */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#090e1d] border border-gray-800 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Palette & Ambiance
                </span>
                <h2 className="text-xl font-bold text-white">Sélectionnez le Thème Visuel de MyCV.click</h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Ce thème modifie instantanément le fond, les contrastes, la navigation et les bannières pour tous les visiteurs du site.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {themes.map((th) => {
                  const isSelected = designForm.theme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setDesignForm({ ...designForm, theme: th.id, primaryColor: th.accentColor })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/20 shadow-xl shadow-purple-950/40 ring-2 ring-purple-500/30'
                          : 'border-gray-800 bg-white/5 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{th.name}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-purple-500 text-black flex items-center justify-center">
                            <CheckCircle2 size={14} />
                          </span>
                        )}
                      </div>

                      {/* Aperçu Couleur */}
                      <div className={`h-16 rounded-xl ${th.bgClass} border border-white/10 flex items-center justify-center p-3 relative shadow-inner`}>
                        <div className="w-full flex items-center justify-between">
                          <div className="w-6 h-6 rounded-lg border border-white/20" style={{ backgroundColor: th.accentColor }} />
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                            {th.tag}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed">{th.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personnalisation des Textes & Hero */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#090e1d] border border-gray-800 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Textes d'Accroche
                </span>
                <h2 className="text-xl font-bold text-white">Personnalisation des Textes Principaux</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Titre Principal (Hero)
                  </label>
                  <input
                    type="text"
                    value={designForm.heroTitle}
                    onChange={(e) => setDesignForm({ ...designForm, heroTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Générateur de CV Professionnel & Dynamique"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Sous-Titre Descriptif
                  </label>
                  <textarea
                    rows="3"
                    value={designForm.heroSubtitle}
                    onChange={(e) => setDesignForm({ ...designForm, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Description du service..."
                  />
                </div>
              </div>
            </div>

            {/* Toggles d'affichage & Publicités */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#090e1d] border border-gray-800 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Modules & Publicités
                </span>
                <h2 className="text-xl font-bold text-white">Visibilité des Sections</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/[0.07] transition-all">
                  <div>
                    <p className="text-sm font-bold text-white">Guide d'Optimisation ATS</p>
                    <p className="text-xs text-gray-400">Affiche les conseils pour franchir les filtres de recrutement</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={designForm.showAtsGuide}
                    onChange={(e) => setDesignForm({ ...designForm, showAtsGuide: e.target.checked })}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </label>

                <label className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/[0.07] transition-all">
                  <div>
                    <p className="text-sm font-bold text-white">Panorama des 6 Modèles A4</p>
                    <p className="text-xs text-gray-400">Présentation des styles Tech, RH, Dual Column, etc.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={designForm.showTemplates}
                    onChange={(e) => setDesignForm({ ...designForm, showTemplates: e.target.checked })}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </label>

                <label className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/[0.07] transition-all">
                  <div>
                    <p className="text-sm font-bold text-white">FAQ Recrutement & CV</p>
                    <p className="text-xs text-gray-400">Accordéon avec réponses aux questions fréquentes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={designForm.showFaq}
                    onChange={(e) => setDesignForm({ ...designForm, showFaq: e.target.checked })}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </label>

                <label className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/[0.07] transition-all">
                  <div>
                    <p className="text-sm font-bold text-white">Publicités Google AdSense</p>
                    <p className="text-xs text-gray-400">Active les 3 bannières AdSense conformes sur la page</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={designForm.showAds}
                    onChange={(e) => setDesignForm({ ...designForm, showAds: e.target.checked })}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Bouton de Sauvegarde */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="submit"
                disabled={isSavingDesign}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                <span>{isSavingDesign ? 'Enregistrement en cours...' : 'Enregistrer les Modifications du Site'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 4 : AUTOMATISATION ET RÉGLAGES TELEGRAM                            */}
        {/* ========================================================================= */}
        {activeTab === 'telegram' && (
          <TelegramSettingsCard />
        )}

        {/* Modal de Prévisualisation et Consultation Complète du CV */}
        {selectedProfile && (() => {
          let parsed = null;
          try {
            parsed = selectedProfile.dataJson ? JSON.parse(selectedProfile.dataJson) : null;
          } catch {
            parsed = null;
          }

          const personal = parsed?.personal || {};
          const experiences = parsed?.experiences || [];
          const education = parsed?.education || [];
          const skills = parsed?.skills || [];
          const tools = parsed?.tools || [];
          const languages = parsed?.languages || [];
          const isGoogle = isGoogleProfile(selectedProfile);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div className="max-w-3xl w-full bg-[#0b1120] border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                
                {/* En-tête Modal */}
                <div className="flex items-start justify-between border-b border-gray-800 pb-5 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        {personal.firstName || personal.lastName 
                          ? `${personal.firstName || ''} ${personal.lastName || ''}`.trim()
                          : selectedProfile.candidateName || selectedProfile.userName || 'Candidat'}
                      </h3>
                      {isGoogle && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3 h-3" alt="G" /> Compte Google
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                        Modèle: {selectedProfile.template}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-purple-300">
                      {personal.title || selectedProfile.title || 'CV Professionnel'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Compte: {selectedProfile.userName} ({selectedProfile.userEmail})
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProfile(null);
                      setShowRawJson(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                  >
                    Fermer ✕
                  </button>
                </div>

                {/* Coordonnées & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-purple-400 shrink-0" />
                    <span className="truncate">{personal.email || selectedProfile.userEmail || 'Non spécifié'}</span>
                  </div>
                  {personal.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-emerald-400 shrink-0" />
                      <span>{personal.phone}</span>
                    </div>
                  )}
                  {personal.city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-amber-400 shrink-0" />
                      <span>{personal.city} {personal.mobility ? `(${personal.mobility})` : ''}</span>
                    </div>
                  )}
                  {personal.linkedin && (
                    <div className="flex items-center gap-2 truncate">
                      <Globe size={14} className="text-sky-400 shrink-0" />
                      <span className="truncate">{personal.linkedin}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Download size={14} className="text-emerald-400 shrink-0" />
                    <span>Téléchargements PDF: <strong>{selectedProfile.downloadsCount || 0}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <span>Sauvegarde: {new Date(selectedProfile.updatedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Résumé Professionnel */}
                {personal.summary && (
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
                    <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">Résumé & Accroche</p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{personal.summary}</p>
                  </div>
                )}

                {/* Expériences */}
                {experiences.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={14} className="text-purple-400" />
                      Expériences Professionnelles ({experiences.length})
                    </h4>
                    <div className="space-y-2.5">
                      {experiences.map((exp, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="font-bold text-sm text-white">{exp.position || 'Poste'}</span>
                            <span className="text-[11px] text-gray-400">
                              {exp.startDate || ''} {exp.current ? "➔ Aujourd'hui" : exp.endDate ? `➔ ${exp.endDate}` : ''}
                            </span>
                          </div>
                          <p className="text-xs text-purple-300 font-medium">{exp.company || 'Entreprise'} {exp.city ? `• ${exp.city}` : ''}</p>
                          {exp.description && (
                            <p className="text-xs text-gray-400 leading-relaxed pt-1 whitespace-pre-line">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formations */}
                {education.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Formations & Diplômes ({education.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {education.map((edu, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="font-bold text-xs text-white block">{edu.degree || 'Diplôme'}</span>
                          <p className="text-[11px] text-purple-300">{edu.school || 'Établissement'} {edu.city ? `• ${edu.city}` : ''}</p>
                          {edu.year && <p className="text-[10px] text-gray-500">{edu.year}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compétences & Outils */}
                {(skills.length > 0 || tools.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Compétences Clés & Outils
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s, idx) => {
                        const name = typeof s === 'string' ? s : s.name;
                        return (
                          <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/25">
                            {name}
                          </span>
                        );
                      })}
                      {tools.map((t, idx) => {
                        const name = typeof t === 'string' ? t : t.name;
                        return (
                          <span key={`t-${idx}`} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/25">
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section JSON Brut repliable */}
                <div className="pt-2 border-t border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowRawJson(!showRawJson)}
                      className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {showRawJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{showRawJson ? 'Masquer les Données JSON Brutes' : 'Afficher les Données JSON Brutes'}</span>
                    </button>

                    {showRawJson && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedProfile.dataJson);
                          setCopiedJson(true);
                          setTimeout(() => setCopiedJson(false), 2000);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-gray-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy size={12} />
                        <span>{copiedJson ? 'Copié !' : 'Copier JSON'}</span>
                      </button>
                    )}
                  </div>

                  {showRawJson && (
                    <pre className="p-4 rounded-xl bg-black/60 border border-gray-800 text-[11px] text-gray-300 overflow-x-auto max-h-60 font-mono">
                      {(() => {
                        try {
                          return JSON.stringify(JSON.parse(selectedProfile.dataJson), null, 2);
                        } catch {
                          return selectedProfile.dataJson;
                        }
                      })()}
                    </pre>
                  )}
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
