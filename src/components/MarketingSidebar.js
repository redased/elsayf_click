'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChartBarIcon,
    BookOpenIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    MegaphoneIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Vue d\'ensemble', href: '/admin/marketing', icon: ChartBarIcon },
    { name: 'Catalogue & Liens', href: '/admin/marketing/courses', icon: BookOpenIcon },
    { name: 'Lead Gen & Scraper', href: '/admin/marketing/leads', icon: UserGroupIcon },
    { name: 'Social Bot', href: '/admin/marketing/automation', icon: RocketLaunchIcon },
    { name: 'Campagnes (Email/SMS)', href: '/admin/marketing/campaigns', icon: MegaphoneIcon },
];

export default function MarketingSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-[#0f172a] border-r border-gray-800 min-h-screen fixed left-0 top-0 pt-20 hidden lg:block">
            <div className="px-6 mb-8">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Marketing Suite</h2>
            </div>
            <nav className="space-y-1 px-3">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-8 left-0 w-full px-6">
                <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-4 border border-indigo-500/20">
                    <h3 className="text-indigo-400 font-bold mb-1 text-sm">Targeting AI</h3>
                    <p className="text-xs text-gray-400">Bot actif: 0 tâches</p>
                </div>
            </div>
        </div>
    );
}
