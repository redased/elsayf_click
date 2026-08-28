'use client';
import { useState, useEffect } from 'react';
import { Check, Globe, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

// Retourne le prix à afficher selon la région
function getDisplayPrice(plan, region) {
    if (region === 'ALGERIA' && plan.priceDzd > 0) {
        return { amount: plan.priceDzd.toLocaleString('fr-FR', { maximumFractionDigits: 0 }), currency: 'DZD' };
    }
    if (region === 'EUROPE' && plan.priceUsd > 0) {
        return { amount: plan.priceUsd.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }), currency: '€' };
    }
    // Fallback
    const fmt = plan.price.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return { amount: fmt, currency: plan.currency };
}

const safeParseFeatures = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
};

export default function PricingPage() {
    const [region, setRegion] = useState('GLOBAL');
    const [country, setCountry] = useState('UNKNOWN');
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [geoDetected, setGeoDetected] = useState(false);

    useEffect(() => {
        detectRegion();
        fetchPlans();
    }, []);

    const detectRegion = async () => {
        try {
            const res = await fetch('/api/geo/detect');
            const data = await res.json();
            if (data.success) {
                setRegion(data.region);
                setCountry(data.country);
                setGeoDetected(true);
            }
        } catch {}
    };

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/super-admin/subscription-plans');
            const data = await res.json();
            if (data.success) setPlans(data.plans);
        } catch {} finally {
            setLoading(false);
        }
    };

    const handleRegionChange = (newRegion) => {
        setRegion(newRegion);
        setGeoDetected(false);
    };

    // Plans actifs pour la région sélectionnée (+ plans GLOBAL)
    const visiblePlans = plans.filter(
        p => p.isActive && (p.region === region || p.region === 'GLOBAL')
    );

    return (
        <div className="min-h-screen pt-24 px-4 pb-20">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        Choisissez votre plan
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Accédez aux meilleures formations en Python et R Statistics
                    </p>

                    {/* Sélecteur de région */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Globe size={18} className="text-gray-500" />
                        {[
                            { key: 'ALGERIA', label: '🇩🇿 Algérie', active: 'bg-green-500' },
                            { key: 'EUROPE',  label: '🇪🇺 Europe',  active: 'bg-blue-500'  },
                            { key: 'GLOBAL',  label: '🌍 Autre',    active: 'bg-purple-500'},
                        ].map(({ key, label, active }) => (
                            <button
                                key={key}
                                onClick={() => handleRegionChange(key)}
                                className={`px-6 py-2 rounded-lg font-medium transition-all text-sm ${
                                    region === key ? `${active} text-white` : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {geoDetected && (
                        <p className="text-xs text-gray-500">
                            Localisation détectée automatiquement · {country === 'DZ' ? '🇩🇿 Algérie' : region === 'EUROPE' ? '🇪🇺 Europe' : country}
                        </p>
                    )}
                </div>

                {/* Plans */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
                        <p className="text-gray-400 mt-4">Chargement des offres...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Plan Gratuit */}
                        <div className="glass-card p-8 border-2 border-gray-700 hover:border-green-500 transition-all">
                            <div className="text-center mb-6">
                                <Sparkles size={48} className="mx-auto text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Gratuit avec Publicités</h3>
                                <p className="text-gray-400 text-sm">Accès limité avec Google Ads</p>
                            </div>
                            <div className="text-center mb-8">
                                <div className="text-5xl font-bold text-green-500 mb-2">
                                    0 {region === 'ALGERIA' ? 'DZD' : '€'}
                                </div>
                                <p className="text-gray-500 text-sm">Pour toujours</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {['Accès aux leçons gratuites', 'Certificat de participation', 'Support communautaire'].map(f => (
                                    <li key={f} className="flex items-start gap-2">
                                        <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-sm">{f}</span>
                                    </li>
                                ))}
                                <li className="flex items-start gap-2 text-gray-500">
                                    <span className="text-sm">✓ Avec publicités Google Ads</span>
                                </li>
                            </ul>
                            <Link href="/register"
                                className="block w-full px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-xl font-bold text-center transition-all border border-green-500/50"
                            >
                                Commencer Gratuitement
                            </Link>
                        </div>

                        {/* Plans payants */}
                        {visiblePlans.length === 0 ? (
                            <div className="glass-card p-12 text-center col-span-2">
                                <p className="text-gray-400">Aucune offre disponible pour votre région pour le moment.</p>
                                <p className="text-sm text-gray-500 mt-2">Contactez-nous pour plus d'informations.</p>
                            </div>
                        ) : visiblePlans.map((plan, index) => {
                            const { amount, currency } = getDisplayPrice(plan, region);
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative glass-card p-8 border-2 transition-all ${
                                        index === 0
                                            ? 'border-purple-500 shadow-xl shadow-purple-500/20 scale-105'
                                            : 'border-gray-700 hover:border-purple-500'
                                    }`}
                                >
                                    {index === 0 && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                            Recommandé
                                        </div>
                                    )}

                                    <div className="text-center mb-6">
                                        {plan.region === 'ALGERIA' ? (
                                            <Crown size={48} className="mx-auto text-yellow-500 mb-4" />
                                        ) : (
                                            <Zap size={48} className="mx-auto text-purple-500 mb-4" />
                                        )}
                                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                        {plan.description && <p className="text-gray-400 text-sm">{plan.description}</p>}
                                    </div>

                                    <div className="text-center mb-8">
                                        <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                                            {amount} {currency}
                                        </div>
                                        <p className="text-gray-500 text-sm">
                                            par {plan.duration === 30 ? 'mois' : `${plan.duration} jours`}
                                        </p>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {[
                                            'Accès complet à tous les cours',
                                            'Sans publicité',
                                            'Certificat professionnel',
                                            'Support prioritaire',
                                            'Accès au forum privé',
                                            'Mises à jour gratuites',
                                        ].map(f => (
                                            <li key={f} className="flex items-start gap-2">
                                                <Check size={20} className="text-purple-500 shrink-0 mt-0.5" />
                                                <span className="text-sm">{f}</span>
                                            </li>
                                        ))}
                                        {safeParseFeatures(plan.features).map((f, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check size={20} className="text-purple-500 shrink-0 mt-0.5" />
                                                <span className="text-sm">{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={`/register?plan=${plan.id}`}
                                        className={`block w-full px-6 py-3 rounded-xl font-bold text-center transition-all ${
                                            index === 0
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                                                : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-500 border border-purple-500/50'
                                        }`}
                                    >
                                        Commencer Maintenant
                                    </Link>

                                    {plan.region === 'ALGERIA' && (
                                        <p className="text-center text-xs text-gray-500 mt-3">
                                            Paiement via Chargily (CIB, eddahabia)
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <p className="text-gray-400 mb-4">Une question sur nos offres ?</p>
                    <Link href="/contact" className="text-purple-500 hover:text-purple-400 font-medium transition-colors">
                        Contactez-nous →
                    </Link>
                </div>
            </div>
        </div>
    );
}
