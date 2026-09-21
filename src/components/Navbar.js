'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, LogOut, User, ChevronDown, Monitor, BarChart2, Video, Search, FileText, Sparkles, ExternalLink, Crown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import StreamNotifications from './StreamNotifications';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/super-admin');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);
  const { t } = useLanguage();
  const { data: session } = useSession();

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
  const [isMyCv, setIsMyCv] = useState(false);
  const hasRStatAccess =
    session?.user?.role === 'R_STAT_ADMIN' ||
    session?.user?.role === 'SUPER_ADMIN' ||
    session?.user?.role === 'ADMIN' ||
    session?.user?.rStatAdminAccess === true;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMyCv(window.location.hostname.toLowerCase().includes('mycv.click'));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!session?.user?.role) return '/dashboard';
    switch (session.user.role) {
      case 'SUPER_ADMIN': return '/super-admin';
      case 'ADMIN': return '/admin';
      case 'MARKETING_RECOVERY': return '/admin/marketing';
      case 'R_STAT_ADMIN': return '/admin';
      case 'STUDENT':
      default: return '/dashboard';
    }
  };

  const defaultCourses = [
    { title: '📊 Power BI & Business Intelligence (DAX & Dashboards)', slug: 'power-bi-business-intelligence-data-analytics' },
    { title: '🛡️ Cybersécurité & Protection des Systèmes (SOC)', slug: 'cybersecurite-protection-systemes-defensive' },
    { title: '⚔️ Ethical Hacking & Pentest Web (OWASP Top 10)', slug: 'ethical-hacking-securite-web-pentest' },
    { title: '🧾 Automatisation Excel & Comptabilité Détaillée', slug: 'automatisation-excel-comptabilite-detaillee' },
    { title: '🤖 Google Antigravity : Maîtrise IA & Code', slug: 'google-antigravity-mastery' },
    { title: '📊 Antigravity : Automatisation Excel Avancée', slug: 'antigravity-excel-advanced' },
    { title: '📈 Gestion d\'Entreprise avec Excel & Python', slug: 'antigravity-business-excel' },
    { title: '📋 Analyse Quali & Quanti : Excel & Python', slug: 'analyse-donnees-quali-quanti' },
    { title: '🧠 Recherche Opérationnelle : Python & IA', slug: 'recherche-operationnelle-python-ia' },
  ];

  const [coursesList, setCoursesList] = useState(defaultCourses);

  useEffect(() => {
    fetch('/api/public/courses')
      .then(res => res.json())
      .then(data => {
        if (data?.courses?.length > 0) {
          const formatted = data.courses.map(c => ({
            title: c.title,
            slug: c.slug
          }));
          setCoursesList(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const courses = coursesList;

  if (isAdminPage) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#0a0e17]/95 backdrop-blur-md border-b border-slate-800/80 px-3 md:px-6 flex items-center justify-between">
        {/* Left: Hamburger + Logo + Studio Badge */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'));
              }
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
            title="Menu Studio (Réduire / Développer)"
            aria-label="Toggle Studio Sidebar"
          >
            <Menu size={22} />
          </button>

          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 md:w-9 md:h-9 transition-transform group-hover:scale-105">
              <img src="/logo.png?v=2" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base md:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                eL Sayf
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm">
                Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Style YouTube Studio) */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher sur votre plateforme (cours, étudiants, stats)..."
              value={adminSearchQuery}
              onChange={(e) => {
                setAdminSearchQuery(e.target.value);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('admin-global-search', { detail: e.target.value }));
                }
              }}
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-purple-500 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
            />
            {adminSearchQuery && (
              <button
                onClick={() => {
                  setAdminSearchQuery('');
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('admin-global-search', { detail: '' }));
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Lien retour site public */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-all shadow-sm group"
            title="Ouvrir le site public"
          >
            <span>Voir le site</span>
            <ExternalLink size={13} className="text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Hub Pédagogique */}
          <Link
            href="/admin/contenus"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/40 hover:to-indigo-600/40 text-purple-200 text-xs font-bold border border-purple-500/30 transition-all"
            title="Hub Pédagogique (VIP)"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span>Hub VIP</span>
          </Link>

          <LanguageSwitcher />

          {/* User Role Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-bold">
            <Crown size={12} className="text-amber-400" />
            <span>{session?.user?.role || 'ADMIN'}</span>
          </div>

          {/* User Avatar + Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-800/80">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-purple-400/30 shadow-md"
              title={session?.user?.email || session?.user?.name || 'Administrateur'}
            >
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : (session?.user?.email ? session.user.email.charAt(0).toUpperCase() : 'A')}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav
      style={{ animation: 'navSlideDown 0.4s ease-out' }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-110">
            <img src="/logo.png?v=2" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a78bfa]">
              {isMyCv ? 'MyCV.click' : 'eL Sayf'}
            </span>
            <span className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold">
              {isMyCv ? 'Studio CV Pro • Formats A4 & ATS' : 'E-Learning Platform'}
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {isMyCv ? (
            <>
              <a href="#creer" className="text-white font-bold text-sm hover:text-[#a78bfa] transition-colors flex items-center gap-1.5">
                <FileText size={15} className="text-[#a78bfa]" />
                <span>Créer mon CV</span>
              </a>
              <a href="#outils" className="text-gray-300 hover:text-[#a78bfa] transition-colors text-sm font-medium">
                Boîte à Outils
              </a>
              <a href="#modeles" className="text-gray-300 hover:text-[#a78bfa] transition-colors text-sm font-medium">
                6 Modèles A4
              </a>
              <a href="#guide-ats" className="text-gray-300 hover:text-[#a78bfa] transition-colors text-sm font-medium">
                Guide ATS
              </a>
              <a href="#faq" className="text-gray-300 hover:text-[#a78bfa] transition-colors text-sm font-medium">
                FAQ
              </a>
              <a href="https://elsayf.click" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:text-purple-300 transition-colors text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30">
                Formations Elsayf ↗
              </a>
            </>
          ) : (
            <>
              <Link href="/" className="text-gray-300 hover:text-[#a78bfa] transition-colors">{t('nav.home')}</Link>

              {/* Parcours Métiers */}
              <Link
                href="/parcours"
                className="text-gray-300 hover:text-[#a78bfa] transition-colors flex items-center gap-1.5"
              >
                <span>Parcours</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  3 CARRIÈRES
                </span>
              </Link>

              {/* Menu déroulant Formations */}
              <div 
                className="relative"
                onMouseLeave={() => setShowCoursesMenu(false)}
              >
                <button
                  onMouseEnter={() => setShowCoursesMenu(true)}
                  onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                  className="flex items-center gap-1 text-gray-300 hover:text-[#a78bfa] transition-colors"
                >
                  <BookOpen size={18} />
                  Formations
                  <ChevronDown size={16} className={`transition-transform ${showCoursesMenu ? 'rotate-180' : ''}`} />
                </button>

                {showCoursesMenu && (
                  <div
                    style={{ animation: 'dropdownFadeIn 0.15s ease-out' }}
                    className="absolute top-full left-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <Link
                        href="/courses"
                        className="block px-4 py-2 text-sm font-medium text-[#a78bfa] hover:bg-white/5 rounded-lg"
                        onClick={() => setShowCoursesMenu(false)}
                      >
                        Voir toutes les formations →
                      </Link>
                      <div className="border-t border-gray-700 my-2"></div>
                      {courses.map((course) => (
                        <Link
                          key={course.slug}
                          href={`/courses/${course.slug}`}
                          onClick={() => setShowCoursesMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {course.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ressources & Cheatsheets */}
              <Link href="/ressources" className="text-gray-300 hover:text-[#a78bfa] transition-colors">
                Ressources
              </Link>

              {/* Blog */}
              <Link href="/blog" className="text-gray-300 hover:text-[#a78bfa] transition-colors">
                Blog
              </Link>

              {/* Simulateur Entretien */}
              <Link
                href="/simulateur-entretien"
                className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                title="Simulateur d'Entretien IA"
              >
                <span>⚡ Simulateur IA</span>
              </Link>

              <Link
                href="/cv"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-indigo-600/30 hover:from-violet-600/50 hover:to-indigo-600/50 text-white border border-violet-400/40 transition-all hover:scale-105 shadow-[0_0_15px_rgba(167,139,250,0.25)] group"
              >
                <FileText size={15} className="text-[#a78bfa]" />
                <span className="font-bold text-xs tracking-wide">Créer mon CV</span>
                <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-[#a78bfa] text-black">
                  PRO
                </span>
              </Link>
            </>
          )}

          <LanguageSwitcher />

          <div className="flex items-center gap-4 ml-4">
            {isMyCv ? (
              session ? (
                <>
                  <Link
                    href="/cv/builder"
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                  >
                    <FileText size={14} />
                    <span>Studio CV</span>
                  </Link>
                  <Link href={getDashboardLink()} className="flex items-center gap-2 text-white hover:text-[#a78bfa] text-xs font-medium">
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline max-w-[100px] truncate">{session.user?.name || session.user?.email || 'Compte'}</span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-medium transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Quitter</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login?callbackUrl=/cv/builder" className="text-white hover:text-[#a78bfa] text-xs font-bold">
                    Connexion
                  </Link>
                  <Link
                    href="/cv/builder"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-violet-900/30 transition-all hover:scale-105"
                  >
                    <Sparkles size={13} />
                    <span>Lancer le Studio</span>
                  </Link>
                </>
              )
            ) : (
              session ? (
                <>
                  {isSuperAdmin && (
                    <Link
                      href="/dashboard/code"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Monitor size={16} />
                      VSCode
                    </Link>
                  )}

                  {hasRStatAccess && (
                    <Link
                      href="/dashboard/rstat"
                      className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <BarChart2 size={16} />
                      R IDE
                    </Link>
                  )}

                  {session && (
                    <Link
                      href="/dashboard/live"
                      className="flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Video size={16} />
                      <span className="hidden lg:inline">Live</span>
                    </Link>
                  )}

                  {session && (
                    <Link
                      href="/dashboard/search"
                      className="flex items-center gap-2 text-gray-400 hover:text-white px-2 py-1.5 rounded-lg transition-colors"
                      title="Rechercher"
                    >
                      <Search size={17} />
                    </Link>
                  )}

                  <StreamNotifications />

                  <Link href={getDashboardLink()} className="flex items-center gap-2 text-white hover:text-[#a78bfa] font-medium">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{session.user?.name || 'Dashboard'}</span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 text-gray-300 hover:text-[#a78bfa] font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-[#a78bfa] font-medium">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="btn btn-primary text-sm px-5 py-2 rounded-full">
                    S'inscrire
                  </Link>
                </>
              )
            )}
          </div>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{ animation: 'mobileMenuSlideIn 0.2s ease-out' }}
          className="md:hidden glass border-t border-gray-800"
        >
          <div className="flex flex-col p-6 gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-300">{t('nav.home')}</Link>
            <Link href="/parcours" onClick={() => setIsOpen(false)} className="text-gray-300 flex items-center justify-between">
              <span>Parcours Métiers</span>
              <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">3 CARRIÈRES</span>
            </Link>
            <Link href="/courses" onClick={() => setIsOpen(false)} className="text-gray-300">{t('nav.courses')}</Link>
            <Link href="/ressources" onClick={() => setIsOpen(false)} className="text-gray-300">Fiches & Cheatsheets</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="text-gray-300">Blog & Guides Tech</Link>
            <Link href="/simulateur-entretien" onClick={() => setIsOpen(false)} className="text-cyan-400 font-semibold flex items-center gap-1.5">
              <span>⚡ Simulateur d'Entretien IA</span>
            </Link>
            <Link href="/cv" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/40 to-indigo-600/40 border border-violet-400/40 text-white font-bold flex items-center justify-between shadow-lg shadow-purple-900/20">
              <span className="flex items-center gap-2">
                <FileText size={16} className="text-[#a78bfa]" />
                <span>Créer mon CV Pro</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-[#a78bfa] text-black">NOUVEAU</span>
            </Link>

            {/* Mobile Formations */}
            <div className="border-t border-gray-700 pt-2">
              <p className="text-xs text-gray-500 uppercase mb-2">Formations</p>
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block py-1 text-sm text-gray-400 hover:text-white"
                >
                  {course.title}
                </Link>
              ))}
            </div>

            <div className="py-2">
              <LanguageSwitcher />
            </div>
            {session ? (
              <>
                {isSuperAdmin && (
                  <Link
                    href="/dashboard/code"
                    onClick={() => setIsOpen(false)}
                    className="text-blue-400 flex items-center gap-2"
                  >
                    <Monitor className="w-4 h-4" />
                    VSCode
                  </Link>
                )}
                {hasRStatAccess && (
                  <Link
                    href="/dashboard/rstat"
                    onClick={() => setIsOpen(false)}
                    className="text-teal-400 flex items-center gap-2"
                  >
                    <BarChart2 className="w-4 h-4" />
                    R IDE
                  </Link>
                )}
                <Link href={getDashboardLink()} onClick={() => setIsOpen(false)} className="text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {session.user?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-300 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-gray-300">{t('nav.login')}</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="btn btn-primary text-center">S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
