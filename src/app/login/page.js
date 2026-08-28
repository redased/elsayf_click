'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const router = useRouter();

    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loadingForm, setLoadingForm] = useState(false);

    const handleGoogle = () => {
        setLoadingGoogle(true);
        signIn("google", { callbackUrl });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoadingForm(true);
        const result = await signIn('credentials', { email, password, redirect: false, callbackUrl });
        if (result?.error) {
            setError('Email ou mot de passe incorrect.');
            setLoadingForm(false);
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="glass-card p-8 md:p-12 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Bon retour</h2>
                    <p className="text-gray-400 text-sm">Connectez-vous à votre compte</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogle}
                        disabled={loadingGoogle}
                        className="w-full bg-white text-black py-3 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-70"
                    >
                        {loadingGoogle ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        )}
                        {loadingGoogle ? 'Connexion…' : 'Continuer avec Google'}
                    </button>

                    <div className="flex items-center gap-3">
                        <hr className="flex-1 border-gray-700" />
                        <span className="text-gray-500 text-sm">ou</span>
                        <hr className="flex-1 border-gray-700" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                        />
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loadingForm}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loadingForm ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                            {loadingForm ? 'Connexion…' : 'Se connecter'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-800">
                        Pas encore de compte ?{' '}
                        <Link href="/register" className="text-[#a78bfa] hover:underline">Créer un compte</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Chargement…</div>}>
            <LoginContent />
        </Suspense>
    );
}
