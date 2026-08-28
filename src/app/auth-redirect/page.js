'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [waited, setWaited] = useState(false);

    // Attendre un peu plus longtemps avant de conclure que la session est absente
    // (le cookie JWT peut prendre un instant à être lu après le redirect OAuth)
    useEffect(() => {
        const timer = setTimeout(() => setWaited(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (status === 'loading') return;
        if (!waited && status !== 'authenticated') return;

        if (!session) {
            // Session vraiment absente après attente → retour login
            router.push('/login');
            return;
        }

        const role = session.user?.role;

        switch (role) {
            case 'SUPER_ADMIN':
                router.push('/super-admin');
                break;
            case 'ADMIN':
                router.push('/admin');
                break;
            case 'MARKETING_RECOVERY':
                router.push('/admin/marketing');
                break;
            case 'R_STAT_ADMIN':
                router.push('/admin');
                break;
            case 'STUDENT':
            default:
                router.push('/dashboard');
                break;
        }
    }, [session, status, router, waited]);

    return (
        <div className="min-h-screen flex items-center justify-center text-white bg-[#050a14]">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-gray-400">Redirection vers votre espace...</p>
            </div>
        </div>
    );
}
