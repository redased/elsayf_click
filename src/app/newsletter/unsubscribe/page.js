'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowLeft, BellOff } from 'lucide-react';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const success = searchParams.get('success');
    const emailParam = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailParam);
    const [status, setStatus] = useState(success === '1' ? 'done' : 'idle');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/newsletter/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('done');
            } else {
                setError(data.error || 'Une erreur est survenue');
            }
        } catch {
            setError('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'done') {
        return (
            <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle size={40} className="text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Désabonnement confirmé</h1>
                {emailParam && (
                    <p className="text-gray-400 mb-2 text-sm">
                        <span className="text-gray-300 font-medium">{decodeURIComponent(emailParam)}</span>
                    </p>
                )}
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Vous ne recevrez plus d'emails de la newsletter Elsayf.<br />
                    Vous pouvez vous réabonner à tout moment depuis notre site.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#a78bfa]/20 hover:bg-[#a78bfa]/30 text-[#a78bfa] border border-[#a78bfa]/30 rounded-xl font-medium text-sm transition-colors">
                        <ArrowLeft size={16} />
                        Retour à l'accueil
                    </Link>
                    <Link href="/courses"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:opacity-90 text-white rounded-xl font-medium text-sm transition-all">
                        Voir les formations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center">
                <BellOff size={36} className="text-[#a78bfa]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Se désabonner</h1>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Entrez votre adresse email pour vous désabonner de la newsletter Elsayf.<br />
                Vous ne recevrez plus nos communications.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full bg-[#111827] border border-[#1f2937] focus:border-[#a78bfa] rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition-colors text-sm"
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                    {loading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Traitement...</>
                    ) : (
                        <><BellOff size={16} /> Confirmer le désabonnement</>
                    )}
                </button>

                <Link href="/" className="block text-center text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    Annuler — retour à l'accueil
                </Link>
            </form>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#a78bfa] hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-[#a78bfa]/20 flex items-center justify-center">
                            <span className="text-sm font-bold">E</span>
                        </div>
                        <span className="font-bold text-white">Elsayf</span>
                    </Link>
                </div>

                <div className="bg-[#0d1117] border border-[#1f2937] rounded-2xl p-8">
                    <Suspense fallback={<div className="text-gray-400 text-center">Chargement...</div>}>
                        <UnsubscribeContent />
                    </Suspense>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    © {new Date().getFullYear()} Elsayf by StatLabo · <a href="https://elsayf.statlabo.com" className="hover:text-gray-400 transition-colors">elsayf.statlabo.com</a>
                </p>
            </div>
        </div>
    );
}
