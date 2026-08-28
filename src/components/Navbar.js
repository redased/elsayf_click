'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, LogOut, User, ChevronDown, Monitor, BarChart2, Video, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import StreamNotifications from './StreamNotifications';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);
  const { t } = useLanguage();
  const { data: session } = useSession();

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
  const hasRStatAccess =
    session?.user?.role === 'R_STAT_ADMIN' ||
    session?.user?.role === 'SUPER_ADMIN' ||
    session?.user?.role === 'ADMIN' ||
    session?.user?.rStatAdminAccess === true;

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

  return (
    <nav
      style={{ animation: 'navSlideDown 0.4s ease-out' }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform group-hover:scale-110">
            <img src="/logo.png?v=2" alt="El Sayf Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a78bfa]">
              eL Sayf
            </span>
            <span className="text-[10px] text-gray-400 font-arabic tracking-wider uppercase">
              E-Learning Platform
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-[#a78bfa] transition-colors">{t('nav.home')}</Link>

          {/* Menu déroulant Formations */}
          <div className="relative">
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
                onMouseLeave={() => setShowCoursesMenu(false)}
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

          <LanguageSwitcher />

          <div className="flex items-center gap-4 ml-4">
            {session ? (
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
            <Link href="/courses" onClick={() => setIsOpen(false)} className="text-gray-300">{t('nav.courses')}</Link>

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
