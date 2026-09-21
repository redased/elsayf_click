'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import {
    Crown, UserPlus, Shield, Mail, Key, Users, Edit, Trash2,
    CheckCircle, XCircle, Search, Filter, Code, ExternalLink,
    Video, Send, DollarSign, Lock, MessageCircle, Menu, X,
    LayoutDashboard, ChevronRight, Sparkles, RefreshCw, BarChart2,
    Award, ShieldAlert, Check
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdminChatPanel from '@/components/admin/AdminChatPanel';

export default function SuperAdminDashboard() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // YouTube Sidebar state (Expanded by default on desktop, collapsed on mobile)
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    // Active View Tab on page: 'users' | 'access' | 'chat'
    const [activeTab, setActiveTab] = useState('users');

    // Formulaire création
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        analyticsAccess: false,
        geminiAccess: true,
        openaiAccess: true,
        affiliateAccess: false,
        rStatAccess: false,
        pythonAccess: false
    });

    // Formulaire édition
    const [editUser, setEditUser] = useState({
        id: '',
        role: '',
        analyticsAccess: false,
        rStatAccess: false,
        pythonAccess: false,
        geminiAccess: true,
        openaiAccess: true,
        affiliateAccess: false
    });

    // Synchronisation avec le Header YouTube Studio
    useEffect(() => {
        const handleToggle = () => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                setMobileDrawerOpen(prev => !prev);
            } else {
                setSidebarExpanded(prev => !prev);
            }
        };

        const handleSearch = (e) => {
            if (e.detail !== undefined) {
                setSearchTerm(e.detail);
            }
        };

        window.addEventListener('toggle-admin-sidebar', handleToggle);
        window.addEventListener('admin-global-search', handleSearch);

        return () => {
            window.removeEventListener('toggle-admin-sidebar', handleToggle);
            window.removeEventListener('admin-global-search', handleSearch);
        };
    }, []);

    useEffect(() => {
        if (session?.user?.role === 'SUPER_ADMIN') {
            fetchUsers();
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [session, status]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/super-admin/users');
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/super-admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                await fetchUsers();
                setShowCreateModal(false);
                setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'STUDENT',
                    analyticsAccess: false,
                    geminiAccess: true,
                    openaiAccess: true,
                    affiliateAccess: false,
                    rStatAccess: false,
                    pythonAccess: false
                });
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de la création');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Erreur lors de la création');
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/super-admin/users/${editUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser)
            });

            if (res.ok) {
                await fetchUsers();
                setShowEditModal(false);
                setSelectedUser(null);
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        try {
            const res = await fetch(`/api/super-admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await fetchUsers();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditUser({
            id: user.id,
            role: user.role,
            analyticsAccess: user.analyticsAccess || false,
            rStatAccess: user.rStatAccess || false,
            pythonAccess: user.pythonAccess || false,
            geminiAccess: user.geminiAccess !== false,
            openaiAccess: user.openaiAccess !== false,
            affiliateAccess: user.affiliateAccess || false
        });
        setShowEditModal(true);
    };

    // Filtrage
    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = (user.name || '').toLowerCase().includes(term) ||
                             (user.email || '').toLowerCase().includes(term);
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Stats par rôle
    const roleStats = {
        SUPER_ADMIN: users.filter(u => u.role === 'SUPER_ADMIN').length,
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        MARKETING_RECOVERY: users.filter(u => u.role === 'MARKETING_RECOVERY').length,
        R_STAT_ADMIN: users.filter(u => u.role === 'R_STAT_ADMIN').length,
        STUDENT: users.filter(u => u.role === 'STUDENT').length,
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen pt-28 text-center text-slate-400 animate-pulse">
                Chargement de la session Super Admin...
            </div>
        );
    }

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-28 px-4 flex items-center justify-center bg-[#070b14]">
                <div className="glass-card p-10 text-center max-w-md border-red-500/30">
                    <ShieldAlert size={56} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Accès Super Admin Requis</h1>
                    <p className="text-gray-400 text-sm mb-6">
                        Cette section confidentielle est strictement réservée à l'administrateur principal.
                    </p>
                    <Link
                        href="/admin"
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg"
                    >
                        Retourner à l'Admin Studio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-200 flex">
            {/* BACKDROP FOR MOBILE DRAWER */}
            {mobileDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileDrawerOpen(false)}
                />
            )}

            {/* SIDEBAR VERTICAL STYLE YOUTUBE STUDIO (SUPER ADMIN) */}
            <aside
                className={`fixed top-16 bottom-0 left-0 z-40 bg-[#0a0e17] border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
                    mobileDrawerOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
                } ${sidebarExpanded ? 'md:w-64' : 'md:w-20'}`}
            >
                {/* Header du Drawer Mobile */}
                {mobileDrawerOpen && (
                    <div className="p-3 flex items-center justify-between border-b border-slate-800/60 shrink-0 md:hidden">
                        <span className="font-bold text-sm text-white px-2 flex items-center gap-2">
                            <Crown size={16} className="text-amber-400" />
                            Super Studio
                        </span>
                        <button
                            onClick={() => setMobileDrawerOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Contenu Déroulant du Sidebar Vertical */}
                <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                    {/* SECTION 1 : VUES PRINCIPALES (TABS) */}
                    <div>
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span>Contrôle</span>
                                <span className="text-[10px] text-amber-400 font-bold">SUPER</span>
                            </div>
                        )}
                        <div className="space-y-1">
                            {/* Onglet Utilisateurs */}
                            <button
                                onClick={() => { setActiveTab('users'); setMobileDrawerOpen(false); }}
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'users'
                                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Utilisateurs & Rôles"
                            >
                                <Users size={18} className={activeTab === 'users' ? 'text-amber-400' : 'text-slate-400'} />
                                {sidebarExpanded && (
                                    <div className="flex-1 flex items-center justify-between truncate">
                                        <span>Utilisateurs & Rôles</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                                            {users.length}
                                        </span>
                                    </div>
                                )}
                            </button>

                            {/* Onglet Accès Rapide */}
                            <button
                                onClick={() => { setActiveTab('access'); setMobileDrawerOpen(false); }}
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'access'
                                        ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Accès Rapide par Email"
                            >
                                <Key size={18} className={activeTab === 'access' ? 'text-purple-400' : 'text-slate-400'} />
                                {sidebarExpanded && <span className="truncate">Accès Rapide Email</span>}
                            </button>

                            {/* Onglet Messagerie */}
                            <button
                                onClick={() => { setActiveTab('chat'); setMobileDrawerOpen(false); }}
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === 'chat'
                                        ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30 shadow-sm'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                } ${!sidebarExpanded && 'justify-center px-0'}`}
                                title="Messagerie Étudiants"
                            >
                                <MessageCircle size={18} className={activeTab === 'chat' ? 'text-blue-400' : 'text-slate-400'} />
                                {sidebarExpanded && <span className="truncate">Messagerie Étudiants</span>}
                            </button>
                        </div>
                    </div>

                    {/* SECTION 2 : OUTILS STRATÉGIQUES */}
                    <div className="pt-2 border-t border-slate-800/60">
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Outils Stratégiques
                            </div>
                        )}
                        <div className="space-y-1">
                            <Link
                                href="/super-admin/pricing"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Plans d'Abonnement & Tarification"
                            >
                                <DollarSign size={18} className="text-emerald-400" />
                                {sidebarExpanded && <span className="truncate">Plans & Pricing</span>}
                            </Link>

                            <Link
                                href="/super-admin/course-access"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Débloquer l'accès aux cours"
                            >
                                <Lock size={18} className="text-pink-400" />
                                {sidebarExpanded && <span className="truncate">Accès Cours</span>}
                            </Link>

                            <Link
                                href="/super-admin/campaigns"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Campagnes Marketing & Newsletters"
                            >
                                <Send size={18} className="text-orange-400" />
                                {sidebarExpanded && <span className="truncate">Campagnes Email</span>}
                            </Link>

                            <Link
                                href="/super-admin/vscode-access"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Console VSCode Web"
                            >
                                <Code size={18} className="text-blue-400" />
                                {sidebarExpanded && (
                                    <span className="flex items-center justify-between flex-1 truncate">
                                        <span>VSCode Web</span>
                                        <ExternalLink size={12} className="text-slate-500" />
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/super-admin/twitch-stats"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Directs & Twitch Stats"
                            >
                                <Video size={18} className="text-purple-400" />
                                {sidebarExpanded && <span className="truncate">Twitch & Lives</span>}
                            </Link>

                            <Link
                                href="/super-admin/tests"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Tests Unitaires & Santé Système"
                            >
                                <CheckCircle size={18} className="text-teal-400" />
                                {sidebarExpanded && <span className="truncate">Tests Système</span>}
                            </Link>
                        </div>
                    </div>

                    {/* SECTION 3 : PASSERELLES ADMIN */}
                    <div className="pt-2 border-t border-slate-800/60">
                        {sidebarExpanded && (
                            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Passerelles
                            </div>
                        )}
                        <div className="space-y-1">
                            <Link
                                href="/admin"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-purple-600/15 border border-purple-500/20 transition-all ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Basculer vers Admin Studio"
                            >
                                <LayoutDashboard size={18} className="text-purple-400" />
                                {sidebarExpanded && <span className="truncate text-purple-300">Admin Studio ↗</span>}
                            </Link>

                            <Link
                                href="/admin/contenus"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Hub Pédagogique & SEO"
                            >
                                <Sparkles size={18} className="text-amber-400" />
                                {sidebarExpanded && <span className="truncate">Hub Pédagogique</span>}
                            </Link>

                            <Link
                                href="/admin/affiliates"
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${
                                    !sidebarExpanded && 'justify-center px-0'
                                }`}
                                title="Affiliation & Tracking"
                            >
                                <Award size={18} className="text-indigo-400" />
                                {sidebarExpanded && <span className="truncate">Affiliation</span>}
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL À DROITE DU SIDEBAR VERTICAL */}
            <div
                className={`flex-1 min-w-0 transition-all duration-300 pt-2 sm:pt-4 px-4 sm:px-6 lg:px-8 pb-16 ${
                    sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
                }`}
            >
                {/* Barre Supérieure du Contenu Principal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800/80 pb-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-amber-400">
                                {activeTab === 'users' && 'Super Admin • Gestion des Utilisateurs'}
                                {activeTab === 'access' && 'Super Admin • Attribution d\'Accès'}
                                {activeTab === 'chat' && 'Super Admin • Messagerie Étudiants'}
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                                <Crown size={12} className="text-amber-400" />
                                SUPER_ADMIN
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">
                            {activeTab === 'users' && 'Console de supervision des comptes, attributions de permissions et contrôle hiérarchique'}
                            {activeTab === 'access' && 'Déblocage instantané de droits d\'accès (R Stat, Python, Analytics) par adresse email'}
                            {activeTab === 'chat' && 'Centre de support en direct et communication avec les apprenants'}
                        </p>
                    </div>

                    {/* Actions d'En-tête */}
                    <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
                        <button
                            onClick={fetchUsers}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Actualiser la liste"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin text-amber-400' : ''} />
                        </button>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer"
                        >
                            <UserPlus size={16} />
                            <span>Créer Utilisateur</span>
                        </button>
                    </div>
                </div>

                {/* ONGLETS HORIZONTAUX DE LA PAGE */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800/60 scrollbar-none">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            activeTab === 'users'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                        }`}
                    >
                        <Users size={15} />
                        <span>Tous les Utilisateurs ({users.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('access')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            activeTab === 'access'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                        }`}
                    >
                        <Key size={15} />
                        <span>Accès Rapide par Email</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            activeTab === 'chat'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                        }`}
                    >
                        <MessageCircle size={15} />
                        <span>Messagerie Étudiants</span>
                    </button>
                </div>

                {/* VUE 1 : UTILISATEURS & ROLES */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* 5 Cartes Métriques par Rôle */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                            <div
                                onClick={() => setRoleFilter(roleFilter === 'SUPER_ADMIN' ? 'ALL' : 'SUPER_ADMIN')}
                                className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer ${
                                    roleFilter === 'SUPER_ADMIN' ? 'border-amber-500/60 bg-amber-500/10' : 'border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Super Admins</span>
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                                        <Crown size={15} />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-amber-400">{roleStats.SUPER_ADMIN}</div>
                            </div>

                            <div
                                onClick={() => setRoleFilter(roleFilter === 'ADMIN' ? 'ALL' : 'ADMIN')}
                                className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer ${
                                    roleFilter === 'ADMIN' ? 'border-red-500/60 bg-red-500/10' : 'border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admins</span>
                                    <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center">
                                        <Shield size={15} />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-red-400">{roleStats.ADMIN}</div>
                            </div>

                            <div
                                onClick={() => setRoleFilter(roleFilter === 'MARKETING_RECOVERY' ? 'ALL' : 'MARKETING_RECOVERY')}
                                className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer ${
                                    roleFilter === 'MARKETING_RECOVERY' ? 'border-purple-500/60 bg-purple-500/10' : 'border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marketing</span>
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                                        <Mail size={15} />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-purple-400">{roleStats.MARKETING_RECOVERY}</div>
                            </div>

                            <div
                                onClick={() => setRoleFilter(roleFilter === 'R_STAT_ADMIN' ? 'ALL' : 'R_STAT_ADMIN')}
                                className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer ${
                                    roleFilter === 'R_STAT_ADMIN' ? 'border-blue-500/60 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">R Stat</span>
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                                        <Key size={15} />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-blue-400">{roleStats.R_STAT_ADMIN}</div>
                            </div>

                            <div
                                onClick={() => setRoleFilter(roleFilter === 'STUDENT' ? 'ALL' : 'STUDENT')}
                                className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                                    roleFilter === 'STUDENT' ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Étudiants</span>
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                                        <Users size={15} />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-emerald-400">{roleStats.STUDENT}</div>
                            </div>
                        </div>

                        {/* Barre de Recherche et Filtres */}
                        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                            <div className="relative w-full sm:w-80">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                                >
                                    <option value="ALL">Tous les rôles ({users.length})</option>
                                    <option value="SUPER_ADMIN">Super Admin ({roleStats.SUPER_ADMIN})</option>
                                    <option value="ADMIN">Admin ({roleStats.ADMIN})</option>
                                    <option value="MARKETING_RECOVERY">Marketing ({roleStats.MARKETING_RECOVERY})</option>
                                    <option value="R_STAT_ADMIN">R Stat ({roleStats.R_STAT_ADMIN})</option>
                                    <option value="STUDENT">Étudiants ({roleStats.STUDENT})</option>
                                </select>
                            </div>
                        </div>

                        {/* Tableau des Utilisateurs */}
                        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-5 py-3.5">Utilisateur</th>
                                            <th className="px-5 py-3.5">Email</th>
                                            <th className="px-5 py-3.5">Rôle</th>
                                            <th className="px-5 py-3.5">Permissions & Modules</th>
                                            <th className="px-5 py-3.5">Date Inscription</th>
                                            <th className="px-5 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="px-5 py-12 text-center text-slate-500 animate-pulse">
                                                    Chargement des utilisateurs en cours...
                                                </td>
                                            </tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                                                    Aucun utilisateur ne correspond à votre recherche.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            {user.image ? (
                                                                <img src={user.image} className="w-8 h-8 rounded-full object-cover border border-slate-700" alt={user.name} />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs border border-purple-400/30">
                                                                    {user.name ? user.name[0]?.toUpperCase() : (user.email ? user.email[0]?.toUpperCase() : '?')}
                                                                </div>
                                                            )}
                                                            <div className="font-bold text-white max-w-[160px] truncate">
                                                                {user.name || 'Sans Nom'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">
                                                        {user.email || 'N/A'}
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            user.role === 'SUPER_ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                                            user.role === 'ADMIN' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                                                            user.role === 'MARKETING_RECOVERY' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                                                            user.role === 'R_STAT_ADMIN' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                                                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex gap-1.5 flex-wrap max-w-xs">
                                                            {user.analyticsAccess && <span className="text-[10px] bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md font-semibold">Analytics</span>}
                                                            {user.rStatAccess && <span className="text-[10px] bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-md font-semibold">R Stat</span>}
                                                            {user.pythonAccess && <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-semibold">Python</span>}
                                                            {user.affiliateAccess && <span className="text-[10px] bg-orange-500/15 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-md font-semibold">Affiliate</span>}
                                                            {user.geminiAccess && <span className="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md font-semibold">Gemini</span>}
                                                            {user.openaiAccess && <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">OpenAI</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                                                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => openEditModal(user)}
                                                                className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors cursor-pointer"
                                                                title="Modifier"
                                                            >
                                                                <Edit size={15} />
                                                            </button>
                                                            {user.role !== 'SUPER_ADMIN' && (
                                                                <button
                                                                    onClick={() => deleteUser(user.id)}
                                                                    className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            )}
                                                        </div>
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

                {/* VUE 2 : ACCÈS RAPIDE PAR EMAIL */}
                {activeTab === 'access' && (
                    <div className="space-y-6">
                        <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl max-w-3xl">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-white">
                                <Key className="text-amber-400" size={22} />
                                Donner un Accès Express par Email
                            </h2>
                            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                                Entrez l'adresse email d'un utilisateur inscrit pour lui octroyer instantanément les privilèges administratifs et modules spéciaux sans avoir à modifier manuellement sa fiche.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                        Adresse Gmail / Email Étudiant
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            placeholder="ex: etudiant@gmail.com..."
                                            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                                            id="quickAccessEmail"
                                        />
                                        <button
                                            onClick={async () => {
                                                const emailInput = document.getElementById('quickAccessEmail');
                                                const email = emailInput?.value?.trim();
                                                if (!email) return alert('Veuillez entrer une adresse email');

                                                try {
                                                    const res = await fetch('/api/admin/grant-r-stat-access', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ email })
                                                    });

                                                    if (res.ok) {
                                                        alert(`✅ Accès R Stat accordé à ${email}`);
                                                        emailInput.value = '';
                                                        await fetchUsers();
                                                    } else {
                                                        const data = await res.json();
                                                        alert(data.error || 'Erreur lors de l\'attribution');
                                                    }
                                                } catch (error) {
                                                    alert('Erreur lors de l\'attribution');
                                                }
                                            }}
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                                        >
                                            <Key size={16} />
                                            <span>Donner Accès R Stat</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                                    <div className="font-bold text-slate-300 flex items-center gap-1.5">
                                        <Crown size={14} className="text-amber-400" />
                                        <span>Règles de privilèges hiérarchiques</span>
                                    </div>
                                    <p>
                                        • Le rôle <strong>SUPER_ADMIN</strong> possède un accès global et inconditionnel à tous les modules.
                                    </p>
                                    <p>
                                        • Pour attribuer d'autres accès spécifiques (Python, Analytics, Marketing), cliquez sur le bouton <Edit size={12} className="inline text-blue-400" /> dans le tableau des utilisateurs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VUE 3 : MESSAGERIE ÉTUDIANTS */}
                {activeTab === 'chat' && (
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-white">
                                <MessageCircle className="text-blue-400" size={22} />
                                Centre de Messagerie & Support
                            </h2>
                            <AdminChatPanel activeSessions={[]} />
                        </div>
                    </div>
                )}

                {/* MODAL CRÉER UN UTILISATEUR */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-800">
                                <h2 className="text-xl font-black text-white flex items-center gap-2">
                                    <UserPlus size={20} className="text-amber-400" />
                                    Créer un Utilisateur
                                </h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={createUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Nom complet</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Mot de passe</label>
                                    <input
                                        type="password"
                                        required
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Rôle</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    >
                                        <option value="STUDENT">Étudiant</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MARKETING_RECOVERY">Marketing Recovery</option>
                                        <option value="R_STAT_ADMIN">R Stat Admin</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-2.5 pt-3 border-t border-slate-800">
                                    <p className="font-bold text-xs text-slate-300 uppercase">Permissions d'accès</p>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Google Analytics Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.analyticsAccess}
                                            onChange={(e) => setNewUser({...newUser, analyticsAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-amber-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>R Stat Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.rStatAccess}
                                            onChange={(e) => setNewUser({...newUser, rStatAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-amber-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Python Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.pythonAccess}
                                            onChange={(e) => setNewUser({...newUser, pythonAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-amber-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Gemini AI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.geminiAccess}
                                            onChange={(e) => setNewUser({...newUser, geminiAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-amber-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>OpenAI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.openaiAccess}
                                            onChange={(e) => setNewUser({...newUser, openaiAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-amber-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Affiliate Access</span>
                                        <input
                                            type="checkbox"
                                            checked={newUser.affiliateAccess}
                                            onChange={(e) => setNewUser({...newUser, affiliateAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-amber-500"
                                        />
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold rounded-xl text-xs transition-all shadow-lg"
                                    >
                                        Créer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL MODIFIER UN UTILISATEUR */}
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-800">
                                <h2 className="text-xl font-black text-white flex items-center gap-2">
                                    <Edit size={20} className="text-blue-400" />
                                    Modifier {selectedUser.name || selectedUser.email}
                                </h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={updateUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Rôle</label>
                                    <select
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="STUDENT">Étudiant</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MARKETING_RECOVERY">Marketing Recovery</option>
                                        <option value="R_STAT_ADMIN">R Stat Admin</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-2.5 pt-3 border-t border-slate-800">
                                    <p className="font-bold text-xs text-slate-300 uppercase">Permissions d'accès</p>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Analytics Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.analyticsAccess}
                                            onChange={(e) => setEditUser({...editUser, analyticsAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-blue-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>R Stat Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.rStatAccess}
                                            onChange={(e) => setEditUser({...editUser, rStatAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-blue-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Python Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.pythonAccess}
                                            onChange={(e) => setEditUser({...editUser, pythonAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-blue-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Gemini AI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.geminiAccess}
                                            onChange={(e) => setEditUser({...editUser, geminiAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-blue-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>OpenAI Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.openaiAccess}
                                            onChange={(e) => setEditUser({...editUser, openaiAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-blue-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white">
                                        <span>Affiliate Access</span>
                                        <input
                                            type="checkbox"
                                            checked={editUser.affiliateAccess}
                                            onChange={(e) => setEditUser({...editUser, affiliateAccess: e.target.checked})}
                                            className="w-4 h-4 rounded accent-blue-500"
                                        />
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-xs font-bold transition-all text-white shadow-lg"
                                    >
                                        Sauvegarder
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
