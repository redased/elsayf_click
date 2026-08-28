'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown, Users, Code, BarChart3, BookOpen, Shield,
  Mail, ExternalLink, ChevronRight, LayoutDashboard, FileText, ClipboardList,
  Activity
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import NotificationSendPanel from '@/components/admin/NotificationSendPanel';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/super-admin',
    icon: LayoutDashboard
  },
  {
    label: 'Utilisateurs',
    href: '/super-admin',
    icon: Users
  },
  {
    label: 'VSCode Access',
    href: '/super-admin/vscode-access',
    icon: Code
  },
  {
    label: 'Python Stats',
    href: '/super-admin/python-stats',
    icon: BarChart3
  },
  {
    label: 'Activité',
    href: '/super-admin/activity',
    icon: Activity
  },
  {
    label: 'Sondages',
    href: '/super-admin/surveys',
    icon: ClipboardList
  },
  {
    label: 'Formations',
    href: '/courses',
    icon: BookOpen,
    submenu: [
      { label: 'Toutes les formations', href: '/courses' },
      { label: 'Google Sheets', href: '/courses/google-sheets-mastery' },
      { label: 'Python Intégral', href: '/courses/python-integral' },
      { label: 'Django Expert', href: '/courses/django-expert' },
      { label: 'R Statistics', href: '/courses/r-statistics-finance' },
    ]
  },
  {
    label: 'Newsletter',
    href: '/super-admin/newsletter',
    icon: Mail
  },
  {
    label: 'Doc R Stat',
    href: '/super-admin/r-stat-doc',
    icon: FileText
  },
  {
    label: 'Panel Admin',
    href: '/admin',
    icon: Shield
  },
];

export default function SuperAdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0e17] border-r border-gray-800 fixed left-0 top-20 bottom-0 overflow-y-auto z-40">
        <div className="p-4">
          {/* User Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl border border-yellow-600/30">
            <p className="text-xs text-gray-400 uppercase mb-1">Super Admin</p>
            <p className="font-bold text-white truncate">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-yellow-500 truncate">{session?.user?.email}</p>

            {/* Boutons rapides */}
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/dashboard/code"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full"
              >
                <Code size={16} />
                Ouvrir VSCode
              </Link>
              <NotificationSendPanel />
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href)
                      ? 'bg-yellow-600/20 text-yellow-400 border-l-2 border-yellow-500'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon size={20} />
                  <span className="flex-1">{item.label}</span>
                  {item.submenu && <ChevronRight size={16} className="text-gray-500" />}
                </Link>

                {/* Submenu for Formations */}
                {item.submenu && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-4">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${pathname === sub.href
                            ? 'text-yellow-400'
                            : 'text-gray-400 hover:text-white'
                          }`}
                      >
                        <ChevronRight size={14} />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 uppercase mb-3 px-4">Liens rapides</p>
            <div className="space-y-1">
              <Link
                href="/super-admin/vscode-access"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
              >
                <Code size={16} />
                Gérer accès VSCode
              </Link>
              <Link
                href="/super-admin/python-stats"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-green-400 rounded-lg transition-colors"
              >
                <BarChart3 size={16} />
                Stats Python
              </Link>
              <Link
                href="/admin/python-registrations"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-purple-400 rounded-lg transition-colors"
              >
                <Mail size={16} />
                Inscriptions Python
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 bg-[#0a0e17] min-h-screen">
        {children}
      </main>
    </div>
  );
}
