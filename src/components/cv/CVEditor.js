'use client';
import { useState } from 'react';
import {
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Wrench,
  Layers,
  Palette,
  Plus,
  Trash2,
  Upload,
  Download,
  RotateCcw,
  FileJson,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Award,
  BookOpen
} from 'lucide-react';
import { PRESET_PROFILES } from './defaultPresets';

export default function CVEditor({
  data,
  onChange,
  config,
  onConfigChange,
  onLoadPreset,
  onReset,
  onExportJson,
  onImportJson
}) {
  const [activeTab, setActiveTab] = useState('personal');

  const updatePersonal = (field, value) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    });
  };

  // Avatar Upload Handlers
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image dépasse 2 Mo. Veuillez choisir une image plus légère.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      updatePersonal('avatar', event.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    updatePersonal('avatar', '');
  };

  // Skills handlers
  const handleAddSkill = () => {
    const newSkills = [...(data.skills || []), { name: 'Nouvelle compétence', level: 80, category: 'hard' }];
    onChange({ ...data, skills: newSkills });
  };

  const handleUpdateSkill = (index, field, val) => {
    const updated = [...(data.skills || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, skills: updated });
  };

  const handleRemoveSkill = (index) => {
    const updated = (data.skills || []).filter((_, i) => i !== index);
    onChange({ ...data, skills: updated });
  };

  // Tools handlers
  const [newTool, setNewTool] = useState('');
  const handleAddTool = () => {
    if (!newTool.trim()) return;
    onChange({ ...data, tools: [...(data.tools || []), newTool.trim()] });
    setNewTool('');
  };

  const handleRemoveTool = (index) => {
    onChange({ ...data, tools: (data.tools || []).filter((_, i) => i !== index) });
  };

  // Soft Skills handlers
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const handleAddSoftSkill = () => {
    if (!newSoftSkill.trim()) return;
    onChange({ ...data, softSkills: [...(data.softSkills || []), newSoftSkill.trim()] });
    setNewSoftSkill('');
  };

  const handleRemoveSoftSkill = (index) => {
    onChange({ ...data, softSkills: (data.softSkills || []).filter((_, i) => i !== index) });
  };

  // Languages handlers
  const handleAddLanguage = () => {
    onChange({
      ...data,
      languages: [...(data.languages || []), { name: 'Nouvelle Langue', level: 'Courant / B2' }]
    });
  };

  const handleUpdateLanguage = (index, field, val) => {
    const updated = [...(data.languages || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, languages: updated });
  };

  const handleRemoveLanguage = (index) => {
    onChange({ ...data, languages: (data.languages || []).filter((_, i) => i !== index) });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      position: 'Poste Occupé',
      company: 'Entreprise / Organisation',
      city: 'Ville',
      startDate: '2023-01',
      endDate: '',
      current: true,
      description: '• Description des missions et résultats obtenus.'
    };
    onChange({ ...data, experiences: [newExp, ...(data.experiences || [])] });
  };

  const handleUpdateExperience = (index, field, val) => {
    const updated = [...(data.experiences || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, experiences: updated });
  };

  const handleRemoveExperience = (index) => {
    onChange({ ...data, experiences: (data.experiences || []).filter((_, i) => i !== index) });
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'Diplôme / Formation',
      school: 'Établissement / Université',
      city: 'Ville',
      year: '2023',
      description: 'Spécialisation ou mention.'
    };
    onChange({ ...data, education: [newEdu, ...(data.education || [])] });
  };

  const handleUpdateEducation = (index, field, val) => {
    const updated = [...(data.education || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, education: updated });
  };

  const handleRemoveEducation = (index) => {
    onChange({ ...data, education: (data.education || []).filter((_, i) => i !== index) });
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'Titre du Projet',
      description: 'Description de la réalisation, impact et résultats.',
      technologies: 'Technologies / Outils utilisés',
      link: ''
    };
    onChange({ ...data, projects: [...(data.projects || []), newProj] });
  };

  const handleUpdateProject = (index, field, val) => {
    const updated = [...(data.projects || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, projects: updated });
  };

  const handleRemoveProject = (index) => {
    onChange({ ...data, projects: (data.projects || []).filter((_, i) => i !== index) });
  };

  // Certifications & Interests
  const [newCert, setNewCert] = useState('');
  const handleAddCert = () => {
    if (!newCert.trim()) return;
    onChange({ ...data, certifications: [...(data.certifications || []), newCert.trim()] });
    setNewCert('');
  };

  const handleRemoveCert = (index) => {
    onChange({ ...data, certifications: (data.certifications || []).filter((_, i) => i !== index) });
  };

  const [newInterest, setNewInterest] = useState('');
  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    onChange({ ...data, interests: [...(data.interests || []), newInterest.trim()] });
    setNewInterest('');
  };

  const handleRemoveInterest = (index) => {
    onChange({ ...data, interests: (data.interests || []).filter((_, i) => i !== index) });
  };

  const tabs = [
    { id: 'personal', label: 'Profil & Infos', icon: User, count: data.personal?.firstName ? '✓' : null },
    { id: 'skills', label: 'Compétences', icon: Wrench, count: (data.skills?.length || 0) + (data.tools?.length || 0) },
    { id: 'experience', label: 'Expériences', icon: Briefcase, count: data.experiences?.length || 0 },
    { id: 'education', label: 'Formation', icon: GraduationCap, count: data.education?.length || 0 },
    { id: 'projects', label: 'Projets', icon: Layers, count: data.projects?.length || 0 },
    { id: 'extra', label: 'Langues & Certifs', icon: Award, count: (data.languages?.length || 0) + (data.certifications?.length || 0) },
    { id: 'design', label: 'Modèles & Style', icon: Palette },
  ];

  const SUGGESTED_SKILLS = [
    'Python', 'JavaScript', 'React / Next.js', 'SQL / PostgreSQL', 'Docker',
    'Gestion de projet', 'Leadership & RH', 'Méthodes Agiles', 'Communication',
    'Excel Avancé', 'Figma / UI Design', 'Analyse de données', 'Git & GitHub', 'Négociation B2B'
  ];

  const colorOptions = [
    { name: 'Violet Elsayf', hex: '#7c3aed' },
    { name: 'Bleu Corporate', hex: '#1e40af' },
    { name: 'Émeraude Pro', hex: '#059669' },
    { name: 'Teal Moderne', hex: '#0d9488' },
    { name: 'Rose Créatif', hex: '#e11d48' },
    { name: 'Ambre Gold', hex: '#d97706' },
    { name: 'Ardoise / Noir', hex: '#1e293b' },
  ];

  const templateOptions = [
    {
      id: 'modern-tech',
      name: 'Modern Tech & Code',
      badge: 'Programmeurs & Tech',
      desc: 'Sidebar sombre, timeline nette et badges d\'expertise.'
    },
    {
      id: 'executive-rh',
      name: 'Executive RH & Corporate',
      badge: 'RH & Managers',
      desc: 'En-tête équilibré, chic et axé leadership & gestion.'
    },
    {
      id: 'creative-designer',
      name: 'Creative Designer & Studio',
      badge: 'UI/UX & Créatifs',
      desc: 'Mise en page asymétrique moderne et showcase projets.'
    },
    {
      id: 'minimalist',
      name: 'Minimaliste Swiss ATS',
      badge: 'International & ATS',
      desc: 'Structure ultra épurée, passage optimal des robots recruteurs.'
    },
    {
      id: 'dual-column',
      name: 'Dual-Column Compact',
      badge: 'Data Analyst & Ingénieurs',
      desc: 'Deux colonnes équilibrées pour une densité parfaite sur 1 page.'
    },
    {
      id: 'emerald',
      name: 'Emerald Prestige',
      badge: 'Finance & Audit',
      desc: 'Bandeau supérieur dégradé et organisation par blocs clairs.'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d]/90 rounded-2xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Presets Quick Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-white/10 space-y-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#a78bfa] animate-pulse" />
            <span className="text-sm font-bold text-white">Profils types en 1 clic :</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="Exporter au format JSON"
            >
              <FileJson size={13} />
              <span>Export</span>
            </button>
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer">
              <Upload size={13} />
              <span>Import</span>
              <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
            </label>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
              title="Vider et réinitialiser"
            >
              <RotateCcw size={13} />
              <span>Vider</span>
            </button>
          </div>
        </div>

        {/* Presets Chips */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESET_PROFILES).map(([key, profile]) => (
            <button
              key={key}
              onClick={() => onLoadPreset(key)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 text-purple-200 border border-[#a78bfa]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{profile.badge}</span>
              <span className="text-gray-400">({profile.name.split('/')[0].trim()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10 bg-black/40 overflow-x-auto shrink-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#a78bfa] text-[#a78bfa] bg-[#a78bfa]/10 font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-[#a78bfa] text-black' : 'bg-white/10 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 text-sm">
        {/* TAB 1: COORDONNÉES & PROFIL */}
        {activeTab === 'personal' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User size={18} className="text-[#a78bfa]" />
              Informations Personnelles & Photo
            </h3>

            {/* Photo upload */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-5">
              {data.personal?.avatar ? (
                <div className="relative group">
                  <img
                    src={data.personal.avatar}
                    alt="Aperçu avatar"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#a78bfa]"
                  />
                  <button
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-500 shadow"
                    title="Supprimer photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 text-xs gap-1">
                  <User size={24} />
                  <span>Pas de photo</span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-gray-300 font-medium">Photo de profil professionnelle</p>
                <div className="flex gap-3">
                  <label className="px-3 py-1.5 rounded-lg bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs cursor-pointer transition-colors shadow">
                    Télécharger une photo
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                  {data.personal?.avatar && (
                    <button
                      onClick={removeAvatar}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs transition-colors"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">Format PNG, JPG max 2 Mo (optionnel, sans photo le CV reste harmonieux)</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Prénom</label>
                <input
                  type="text"
                  value={data.personal?.firstName || ''}
                  onChange={(e) => updatePersonal('firstName', e.target.value)}
                  placeholder="ex: Sofiane"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Nom de famille</label>
                <input
                  type="text"
                  value={data.personal?.lastName || ''}
                  onChange={(e) => updatePersonal('lastName', e.target.value)}
                  placeholder="ex: Mansouri"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1">Titre du poste visé</label>
                <input
                  type="text"
                  value={data.personal?.title || ''}
                  onChange={(e) => updatePersonal('title', e.target.value)}
                  placeholder="ex: Développeur Full-Stack Python & React | Ingénieur IA"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={data.personal?.email || ''}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  placeholder="email@domaine.com"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={data.personal?.phone || ''}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  placeholder="+213 550 00 00 00"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Ville & Pays</label>
                <input
                  type="text"
                  value={data.personal?.city || ''}
                  onChange={(e) => updatePersonal('city', e.target.value)}
                  placeholder="Alger, Algérie"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Mobilité / Disponibilité</label>
                <input
                  type="text"
                  value={data.personal?.mobility || ''}
                  onChange={(e) => updatePersonal('mobility', e.target.value)}
                  placeholder="Télétravail & Hybride / Immédiat"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">LinkedIn (URL ou pseudo)</label>
                <input
                  type="text"
                  value={data.personal?.linkedin || ''}
                  onChange={(e) => updatePersonal('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">GitHub ou Dribbble</label>
                <input
                  type="text"
                  value={data.personal?.github || ''}
                  onChange={(e) => updatePersonal('github', e.target.value)}
                  placeholder="github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1">Portfolio ou Site web</label>
                <input
                  type="text"
                  value={data.personal?.website || ''}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Résumé / Accroche Professionnelle
                </label>
                <textarea
                  rows={4}
                  value={data.personal?.summary || ''}
                  onChange={(e) => updatePersonal('summary', e.target.value)}
                  placeholder="Décrivez en quelques phrases percutantes votre profil, vos expertises clés et vos ambitions professionnelles..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#a78bfa] leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPÉTENCES & OUTILS */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Hard Skills */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench size={18} className="text-[#a78bfa]" />
                  Compétences Techniques (Hard Skills)
                </h3>
                <button
                  onClick={handleAddSkill}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#a78bfa]/20 hover:bg-[#a78bfa]/30 text-[#a78bfa] text-xs font-semibold transition-colors"
                >
                  <Plus size={14} /> Ajouter une compétence
                </button>
              </div>

              {/* Suggestions rapides en 1 clic */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
                <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Suggestions rapides (cliquez pour ajouter en 1 seconde) :</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.filter(
                    (s) => !(data.skills || []).some((k) => (k.name || '').toLowerCase() === s.toLowerCase())
                  ).slice(0, 9).map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => {
                        onChange({
                          ...data,
                          skills: [...(data.skills || []), { name: sugg, level: 85, category: 'hard' }]
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-[#a78bfa]/25 text-gray-200 hover:text-white border border-white/10 hover:border-[#a78bfa]/40 transition-all cursor-pointer active:scale-95"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                {(data.skills || []).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleUpdateSkill(idx, 'name', e.target.value)}
                      placeholder="Nom de la compétence"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                    />
                    <div className="flex items-center gap-2 w-36">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={skill.level || 75}
                        onChange={(e) => handleUpdateSkill(idx, 'level', parseInt(e.target.value))}
                        className="w-full accent-[#a78bfa]"
                      />
                      <span className="text-xs text-gray-400 font-mono w-8 text-right">{skill.level}%</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Logiciels */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-[#a78bfa]" />
                Outils, Logiciels & Environnements
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTool(); } }}
                  placeholder="ex: Docker, Git, Figma, SAP, Excel VBA..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                />
                <button
                  onClick={handleAddTool}
                  className="px-4 py-2 rounded-xl bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs"
                >
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(data.tools || []).map((tool, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-white/10 text-gray-200 border border-white/10"
                  >
                    <span>{tool}</span>
                    <button
                      onClick={() => handleRemoveTool(idx)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#a78bfa]" />
                Savoir-être / Soft Skills
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSoftSkill(); } }}
                  placeholder="ex: Gestion du stress, Travail en équipe, Négociation..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                />
                <button
                  onClick={handleAddSoftSkill}
                  className="px-4 py-2 rounded-xl bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs"
                >
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(data.softSkills || []).map((sk, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-purple-500/15 text-purple-200 border border-purple-500/30"
                  >
                    <span>{sk}</span>
                    <button
                      onClick={() => handleRemoveSoftSkill(idx)}
                      className="text-purple-400 hover:text-red-400"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe size={18} className="text-[#a78bfa]" />
                  Langues
                </h3>
                <button
                  onClick={handleAddLanguage}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#a78bfa]/20 hover:bg-[#a78bfa]/30 text-[#a78bfa] text-xs font-semibold transition-colors"
                >
                  <Plus size={14} /> Ajouter une langue
                </button>
              </div>

              <div className="space-y-2">
                {(data.languages || []).map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => handleUpdateLanguage(idx, 'name', e.target.value)}
                      placeholder="Langue (ex: Français, Anglais)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                    />
                    <select
                      value={lang.level}
                      onChange={(e) => handleUpdateLanguage(idx, 'level', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                    >
                      <option value="Langue maternelle">Langue maternelle</option>
                      <option value="Bilingue / C2">Bilingue / C2</option>
                      <option value="Courant / C1">Courant / C1</option>
                      <option value="Professionnel / B2">Professionnel / B2</option>
                      <option value="Intermédiaire / B1">Intermédiaire / B1</option>
                      <option value="Notions élémentaires / A2">Notions élémentaires / A2</option>
                    </select>
                    <button
                      onClick={() => handleRemoveLanguage(idx)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPÉRIENCES PROFESSIONNELLES */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase size={18} className="text-[#a78bfa]" />
                Parcours Professionnel
              </h3>
              <button
                onClick={handleAddExperience}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs transition-colors shadow"
              >
                <Plus size={14} /> Ajouter une expérience
              </button>
            </div>

            <div className="space-y-4">
              {(data.experiences || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 relative group">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider">
                      Expérience #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveExperience(idx)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Supprimer cette expérience"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Poste / Fonction</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleUpdateExperience(idx, 'position', e.target.value)}
                        placeholder="ex: Responsable RH"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Entreprise / Organisation</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        placeholder="ex: Google, Groupe Algérie..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Date début (AAAA-MM)</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(idx, 'startDate', e.target.value)}
                        placeholder="2022-01"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Date fin</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? 'Actuel / Présent' : exp.endDate}
                          onChange={(e) => handleUpdateExperience(idx, 'endDate', e.target.value)}
                          placeholder="2024-03"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs disabled:opacity-50 focus:outline-none focus:border-[#a78bfa]"
                        />
                        <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!exp.current}
                            onChange={(e) => handleUpdateExperience(idx, 'current', e.target.checked)}
                            className="accent-[#a78bfa]"
                          />
                          <span>En cours</span>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Ville / Pays</label>
                      <input
                        type="text"
                        value={exp.city || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'city', e.target.value)}
                        placeholder="Alger, Oran..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">
                        Missions & Réalisations (utiliser des puces "• " pour les bullet points)
                      </label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                        placeholder="• Gestion d'une équipe de 5 personnes&#10;• Amélioration de 30% des performances..."
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa] leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FORMATIONS */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap size={18} className="text-[#a78bfa]" />
                Formations & Diplômes
              </h3>
              <button
                onClick={handleAddEducation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs transition-colors shadow"
              >
                <Plus size={14} /> Ajouter une formation
              </button>
            </div>

            <div className="space-y-4">
              {(data.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider">
                      Formation #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Diplôme / Titre d'étude</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                        placeholder="Master 2 en Informatique / Licence RH"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Établissement / Université</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleUpdateEducation(idx, 'school', e.target.value)}
                        placeholder="USTHB, Université d'Alger, Elsayf..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Année / Période</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                        placeholder="2021 ou 2019-2021"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Ville / En ligne</label>
                      <input
                        type="text"
                        value={edu.city || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'city', e.target.value)}
                        placeholder="Alger, Paris, En ligne..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Mention / Spécialité / Détails</label>
                      <input
                        type="text"
                        value={edu.description || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'description', e.target.value)}
                        placeholder="Mention Bien, Projet de fin d'étude sur..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROJETS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-[#a78bfa]" />
                Projets & Réalisations Clés
              </h3>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs transition-colors shadow"
              >
                <Plus size={14} /> Ajouter un projet
              </button>
            </div>

            <div className="space-y-4">
              {(data.projects || []).map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider">
                      Projet #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveProject(idx)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Nom du projet</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                        placeholder="ex: Plateforme E-Commerce, Système Paie..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Lien vers le projet (GitHub, Démo, Site)</label>
                      <input
                        type="text"
                        value={proj.link || ''}
                        onChange={(e) => handleUpdateProject(idx, 'link', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Technologies / Méthodologies</label>
                      <input
                        type="text"
                        value={proj.technologies || ''}
                        onChange={(e) => handleUpdateProject(idx, 'technologies', e.target.value)}
                        placeholder="ex: Python, React, Next.js, PostgreSQL / Méthode Agile"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Description & Impact</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                        placeholder="Description synthétique des fonctionnalités créées et de la valeur apportée..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CERTIFICATIONS & LOISIRS */}
        {activeTab === 'extra' && (
          <div className="space-y-6">
            {/* Certifications */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award size={18} className="text-[#a78bfa]" />
                Certifications Officielles
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCert(); } }}
                  placeholder="ex: Certification Python & IA Elsayf, AWS Solutions Architect..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                />
                <button
                  onClick={handleAddCert}
                  className="px-4 py-2 rounded-xl bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs"
                >
                  Ajouter
                </button>
              </div>

              <div className="space-y-2 pt-1">
                {(data.certifications || []).map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                    <span>{c}</span>
                    <button onClick={() => handleRemoveCert(idx)} className="text-gray-400 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Centres d'intérêt */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#a78bfa]" />
                Centres d'intérêt & Loisirs
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); } }}
                  placeholder="ex: Échecs, Robotique, Randonnée, Photographie..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                />
                <button
                  onClick={handleAddInterest}
                  className="px-4 py-2 rounded-xl bg-[#a78bfa] hover:bg-[#8b5cf6] text-black font-semibold text-xs"
                >
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(data.interests || []).map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-white/10 text-gray-200 border border-white/10">
                    <span>{item}</span>
                    <button onClick={() => handleRemoveInterest(idx)} className="text-gray-400 hover:text-red-400">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DESIGN & TEMPLATES */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette size={18} className="text-[#a78bfa]" />
              Choix du Modèle de CV & Styles Visuels
            </h3>

            {/* Template Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templateOptions.map((t) => {
                const isSelected = config.template === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onConfigChange({ ...config, template: t.id })}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#a78bfa] bg-[#a78bfa]/15 ring-2 ring-[#a78bfa]/40 shadow-lg'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-xs text-white">{t.name}</h4>
                      {isSelected && <CheckCircle2 size={15} className="text-[#a78bfa]" />}
                    </div>
                    <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/10 text-[#a78bfa] mb-1.5">
                      {t.badge}
                    </span>
                    <p className="text-[11px] text-gray-400 leading-snug">{t.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Color Accent Picker */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="block text-xs font-bold text-gray-300">Couleur d'accentuation</label>
              <div className="flex flex-wrap gap-3 items-center">
                {colorOptions.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => onConfigChange({ ...config, color: c.hex })}
                    className={`w-9 h-9 rounded-full transition-transform flex items-center justify-center cursor-pointer shadow-md ${
                      config.color === c.hex ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {config.color === c.hex && <CheckCircle2 size={16} className="text-white drop-shadow" />}
                  </button>
                ))}

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/15">
                  <input
                    type="color"
                    value={config.color || '#7c3aed'}
                    onChange={(e) => onConfigChange({ ...config, color: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Choisir couleur personnalisée"
                  />
                  <span className="text-xs font-mono text-gray-400 uppercase">{config.color}</span>
                </div>
              </div>
            </div>

            {/* Typography & Spacing Options */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Police d'écriture</label>
                <select
                  value={config.font || 'sans'}
                  onChange={(e) => onConfigChange({ ...config, font: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                >
                  <option value="sans">Moderne Sans-serif (Inter / Roboto)</option>
                  <option value="serif">Élégante Serif (Playfair / Merriweather)</option>
                  <option value="mono">Tech Monospace (Code / Geek)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Espacement du contenu</label>
                <select
                  value={config.spacing || 'normal'}
                  onChange={(e) => onConfigChange({ ...config, spacing: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#a78bfa]"
                >
                  <option value="compact">Compact (Idéal 1 page dense)</option>
                  <option value="normal">Normal (Équilibré)</option>
                  <option value="relaxed">Aéré (Grands espaces)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save Status Footer */}
      <div className="px-5 py-2.5 bg-black/60 border-t border-white/10 flex justify-between items-center text-[11px] text-gray-400 shrink-0">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <CheckCircle2 size={13} /> Sauvegarde automatique active
        </span>
        <span>Studio CV Pro • Elsayf.click</span>
      </div>
    </div>
  );
}
