
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Code, Award, Settings, LogOut, Video, BarChart3, MessagesSquare, Trophy, Shield, User, Menu, X } from 'lucide-react';
import { signOut, useSession } from "next-auth/react"
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN' ||
                     session?.user?.role === 'R_STAT_ADMIN' || session?.user?.role === 'MARKETING_ADMIN' ||
                     session?.user?.rStatAdminAccess === true;

    // Sur la page cours, pas de sidebar — l'élève a besoin de tout l'espace
    const isCoursePage = /^\/dashboard\/courses\/[^/]+/.test(pathname);

    const navItems = [
        { name: t('dashboard.overview'), href: '/dashboard', icon: LayoutDashboard },
        { name: t('dashboard.coding_room'), href: '/dashboard/code', icon: Code },
        { name: t('dashboard.analytics'), href: '/dashboard/analytics', icon: BarChart3 },
        { name: t('dashboard.forum'), href: '/dashboard/forum', icon: MessagesSquare },
        { name: t('dashboard.leaderboard'), href: '/dashboard/leaderboard', icon: Trophy },
        { name: t('dashboard.live'), href: '/dashboard/live', icon: Video },
        { name: t('dashboard.certificates'), href: '/dashboard/certificates', icon: Award },
        { name: 'Profil', href: '/dashboard/profile', icon: User },
        { name: t('dashboard.settings'), href: '/dashboard/settings', icon: Settings },
    ];

    if (isAdmin) {
        navItems.push({ name: 'Admin', href: '/admin', icon: Shield, adminOnly: true });
    }

    // Fermer sidebar quand on change de page
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Bloquer le scroll body quand sidebar ouverte sur mobile
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const SidebarContent = () => (
        <>
            <div className="p-5 flex-1 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('dashboard.menu')}</div>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const isAdminItem = item.adminOnly;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-[#a78bfa]/15 text-[#a78bfa] border-r-2 border-[#a78bfa]'
                                    : isAdminItem
                                    ? 'text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 font-bold'
                                    : 'text-gray-400 hover:bg-[#a78bfa]/8 hover:text-white'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-5 border-t border-[#ffffff10]">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-3 rounded-xl hover:bg-red-500/10"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">{t('dashboard.logout')}</span>
                </button>
            </div>
        </>
    );

    // Page cours : rendu minimal sans sidebar ni barre mobile
    if (isCoursePage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen pt-16 md:pt-20">

            {/* ── Sidebar desktop ───────────────────────────────── */}
            <aside className="fixed left-0 top-16 md:top-20 w-64 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-[#0a0e17] border-r border-[#ffffff10] hidden md:flex flex-col">
                <SidebarContent />
            </aside>

            {/* ── Overlay mobile ────────────────────────────────── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Drawer mobile ─────────────────────────────────── */}
            <aside className={`fixed left-0 top-0 h-full w-72 bg-[#0a0e17] border-r border-[#ffffff15] z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#ffffff10] shrink-0">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png?v=2" alt="El Sayf" className="w-8 h-8 object-contain" />
                        <span className="text-white font-bold text-base">El Sayf</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {session?.user && (
                    <div className="px-5 py-3 border-b border-[#ffffff08] shrink-0">
                        <div className="flex items-center gap-3">
                            {session.user.image ? (
                                <img src={session.user.image} alt={session.user.name} className="w-9 h-9 rounded-full" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
                                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-sm text-white font-semibold truncate">{session.user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <SidebarContent />
            </aside>

            {/* ── Barre mobile du haut (hamburger) ─────────────── */}
            <div className="fixed top-16 left-0 right-0 h-12 bg-[#0a0e17]/95 backdrop-blur-md border-b border-[#ffffff08] flex items-center px-4 z-30 md:hidden">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors"
                >
                    <Menu size={20} />
                    <span className="text-sm font-medium">Menu</span>
                </button>
                <div className="ml-auto">
                    {(() => {
                        const active = navItems.find(i => i.href === pathname);
                        if (!active) return null;
                        const Icon = active.icon;
                        return (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Icon size={14} />
                                <span>{active.name}</span>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ── Contenu principal ─────────────────────────────── */}
            <div className="flex-1 md:ml-64 mt-12 md:mt-0 p-4 md:p-8 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
