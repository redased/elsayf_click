'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import RStudioEditor from '@/components/RStudioEditor';
import { Lock } from 'lucide-react';

export default function RStatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/');
            return;
        }

        const role = session.user?.role;

        // Accès immédiat pour admins
        if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'R_STAT_ADMIN') {
            setHasAccess(true);
            setChecking(false);
            return;
        }

        // Vérifier rStatAdminAccess depuis le token session
        if (session.user?.rStatAdminAccess === true) {
            setHasAccess(true);
            setChecking(false);
            return;
        }

        // Vérifier via API pour les cas edge
        fetch('/api/user/access-check')
            .then(r => r.json())
            .then(data => {
                const allowed =
                    data.role === 'SUPER_ADMIN' ||
                    data.role === 'ADMIN' ||
                    data.role === 'R_STAT_ADMIN';
                setHasAccess(allowed);
            })
            .catch(() => setHasAccess(false))
            .finally(() => setChecking(false));

    }, [session, status, router]);

    if (status === 'loading' || checking) {
        return (
            <div className="fixed inset-0 bg-[#1e1e1e] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#4ec9b0] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <div className="text-[#858585] text-sm">Vérification des accès R...</div>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="fixed inset-0 bg-[#1e1e1e] flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="mb-6 flex justify-center">
                        <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20">
                            <Lock className="text-red-400" size={48} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Accès Restreint</h1>
                    <p className="text-[#858585] mb-2">
                        Vous n'avez pas accès à l'environnement R Statistics.
                    </p>
                    <p className="text-[#858585] text-sm mb-6">
                        Cet espace est réservé aux étudiants inscrits au cours{' '}
                        <span className="text-[#4ec9b0]">R Statistics Finance</span>.
                        Contactez votre administrateur pour obtenir l'accès.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-5 py-2.5 bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white rounded-lg transition-colors text-sm"
                        >
                            Retour au Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/courses/r-statistics-finance')}
                            className="px-5 py-2.5 bg-[#4ec9b0] hover:bg-[#3bb89e] text-black font-semibold rounded-lg transition-colors text-sm"
                        >
                            Voir le cours R
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#1e1e1e] z-50 flex flex-col">
            <RStudioEditor />
        </div>
    );
}
