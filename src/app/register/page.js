'use client';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

function RegisterContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const router = useRouter();

    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [name, setName] = useState('');
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
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Erreur lors de la création du compte.');
                setLoadingForm(false);
                return;
            }
            const result = await signIn('credentials', { email, password, redirect: false, callbackUrl });
            if (result?.error) {
                setError('Compte créé, mais connexion échouée. Essayez de vous connecter.');
                setLoadingForm(false);
            } else {
                router.push(callbackUrl);
            }
        } catch {
            setError('Erreur serveur. Réessayez.');
            setLoadingForm(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
            <div className="glass-card w-full max-w-md overflow-hidden p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-2 text-center">Créer un compte</h2>
                <p className="text-gray-400 mb-8 text-center text-sm">Rejoignez des milliers d'étudiants</p>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogle}
                        disabled={loadingGoogle}
                        className="w-full bg-white text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow disabled:opacity-70"
                    >
                        {loadingGoogle ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        )}
                        {loadingGoogle ? 'Redirection…' : "S'inscrire avec Google"}
                    </button>

                    <div className="flex items-center gap-3 my-2">
                        <hr className="flex-1 border-gray-700" />
                        <span className="text-gray-500 text-sm">ou</span>
                        <hr className="flex-1 border-gray-700" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nom complet"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                        />
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
                            placeholder="Mot de passe (min. 6 caractères)"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                        />
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loadingForm}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loadingForm ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                            {loadingForm ? 'Création…' : 'Créer mon compte'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-800">
                        Déjà inscrit ?{' '}
                        <Link href="/login" className="text-[#a78bfa] hover:underline">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Register() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 px-4 flex items-center justify-center text-white">Chargement…</div>}>
            <RegisterContent />
        </Suspense>
    );
}
