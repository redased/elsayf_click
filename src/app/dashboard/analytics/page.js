'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PythonIDE from '@/components/PythonIDE';
import { Shield, Lock } from 'lucide-react';

export default function AnalyticsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            if (status === 'loading') return;

            if (!session) {
                router.push('/');
                return;
            }

            try {
                // Check if user has analytics access
                const response = await fetch('/api/user/access-check');
                const data = await response.json();

                if (data.analyticsAccess || session.user.role === 'ADMIN') {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            } catch (error) {
                console.error('Error checking access:', error);
                setHasAccess(false);
            } finally {
                setChecking(false);
            }
        };

        checkAccess();
    }, [session, status, router]);

    if (status === 'loading' || checking) {
        return (
            <div className="fixed inset-0 bg-[#1e1e1e] flex items-center justify-center">
                <div className="text-white text-lg">Vérification des accès...</div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="fixed inset-0 bg-[#1e1e1e] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="mb-6 flex justify-center">
                        <div className="p-6 bg-red-500/10 rounded-full">
                            <Lock className="text-red-400" size={48} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Accès Restreint</h1>
                    <p className="text-gray-400 mb-6">
                        Vous n'avez pas accès à l'IDE Python Analytics.
                        Contactez votre administrateur pour activer cet accès.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        Retour au Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#1e1e1e] z-50 flex flex-col">
            <PythonIDE />
        </div>
    );
}
