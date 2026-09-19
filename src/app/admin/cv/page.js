'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FileText, Users, Download, Printer, Save, Palette, Eye, 
  CheckCircle2, Sparkles, Sliders, ShieldAlert, ArrowLeft, 
  Clock, Laptop, Smartphone, Search, RefreshCw, Layers, ExternalLink
} from 'lucide-react';

export default function AdminCvPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' | 'activity' | 'design'
  const [stats, setStats] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.userName?.toLowerCase().includes(q) ||
      p.userEmail?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q) ||
      p.candidateName?.toLowerCase().includes(q)
    );
  });

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
              Gestionnaire CV & Design Dynamique
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Supervisez les profils enregistrés, suivez l'activité des visiteurs invités et modifiez le design du site en direct.
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
              title="Accéder au CV Builder (ancien design conservé)"
            >
              <FileText size={14} />
              <span>CV Builder</span>
              <ExternalLink size={12} />
            </Link>
            <Link
              href="/cv"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-900/30 transition-all hover:scale-105"
            >
              <Layers size={14} />
              <span>Galerie Designs</span>
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
          </div>
        </div>

        {/* Cartes Métriques Clés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-purple-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">Membres Connectés</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                <Users size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalProfiles || 0}</p>
            <p className="text-[11px] text-gray-400">Profils sauvegardés dans le Cloud</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-blue-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Visiteurs Invités</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300">
                <Laptop size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalGuestEvents || 0}</p>
            <p className="text-[11px] text-gray-400">Actions d'invités sans inscription requise</p>
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
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Thème Actif</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Palette size={16} />
              </div>
            </div>
            <p className="text-xl font-black text-white capitalize">{designForm.theme.replace('-', ' ')}</p>
            <p className="text-[11px] text-gray-400">Modifiable en 1 clic dans l'onglet Design</p>
          </div>
        </div>

        {/* Onglets Principaux */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-1">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profiles'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={16} />
            <span>Membres Connectés ({profiles.length})</span>
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
            <span>Flux d'Activité en Direct ({recentEvents.length})</span>
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
            <span>Personnaliser le Design du Site</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* ONGLET 1 : MEMBRES CONNECTÉS & PROFILS SAUVEGARDÉS                        */}
        {/* ========================================================================= */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, titre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <span className="text-xs text-gray-400">
                {filteredProfiles.length} profil(s) trouvé(s)
              </span>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#090e1d] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Utilisateur</th>
                      <th className="px-6 py-4">Titre du CV</th>
                      <th className="px-6 py-4">Modèle & Style</th>
                      <th className="px-6 py-4">Téléchargements</th>
                      <th className="px-6 py-4">Dernière Sauvegarde</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          Aucun profil sauvegardé pour le moment.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white">{p.userName || p.candidateName || 'Utilisateur'}</span>
                              <span className="text-xs text-gray-400">{p.userEmail}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-purple-300">{p.title || 'Mon CV'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 capitalize">
                              {p.template}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Download size={12} /> {p.downloadsCount || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(p.updatedAt).toLocaleString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedProfile(p)}
                              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                            >
                              <Eye size={14} />
                              <span>Voir le CV</span>
                            </button>
                          </td>
                        </tr>
                      ))
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

        {/* Modal de Prévisualisation des Détails du CV Membre */}
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-2xl w-full bg-[#0e1428] border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedProfile.candidateName || selectedProfile.userName}</h3>
                  <p className="text-xs text-gray-400">{selectedProfile.userEmail} • {selectedProfile.title}</p>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-semibold"
                >
                  Fermer
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-white/5 space-y-2">
                  <p className="text-xs font-bold text-purple-400 uppercase">Configuration du Modèle</p>
                  <p className="text-gray-300">Modèle: <strong>{selectedProfile.template}</strong> | Couleur: <strong>{selectedProfile.color}</strong> | Police: <strong>{selectedProfile.font}</strong></p>
                  <p className="text-gray-300">Téléchargements PDF cumulés: <strong>{selectedProfile.downloadsCount}</strong></p>
                  <p className="text-gray-400 text-xs">Dernière sauvegarde: {new Date(selectedProfile.updatedAt).toLocaleString('fr-FR')}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 space-y-2">
                  <p className="text-xs font-bold text-purple-400 uppercase">Données JSON Brutes du Candidat</p>
                  <pre className="p-3 rounded-lg bg-black/40 text-[11px] text-gray-300 overflow-x-auto max-h-64">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(selectedProfile.dataJson), null, 2);
                      } catch {
                        return selectedProfile.dataJson;
                      }
                    })()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
