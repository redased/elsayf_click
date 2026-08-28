'use client';
import { useEffect, useState } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Vérifier si le consentement a déjà été donné
        try {
            const consent = localStorage.getItem('cookieConsent');
            if (!consent) {
                // Afficher la bannière après 2 secondes
                const timer = setTimeout(() => {
                    setShowBanner(true);
                }, 2000);
                return () => clearTimeout(timer);
            }
        } catch (e) {
            console.error('Failed to access localStorage:', e);
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
        setAnimateOut(true);
        setTimeout(() => setShowBanner(false), 300);
        // Ici vous pouvez activer Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted'
            });
        }
    };

    const handleReject = () => {
        try {
            localStorage.setItem('cookieConsent', 'rejected');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
        setAnimateOut(true);
        setTimeout(() => setShowBanner(false), 300);
        // Désactiver le tracking
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }
    };

    // Don't render anything until mounted on client
    if (!mounted || !showBanner) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${animateOut ? 'animate-slide-down' : ''}`}>
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Icône Cookie */}
                    <div className="hidden md:flex w-16 h-16 rounded-2xl bg-[#a78bfa]/20 text-[#a78bfa] items-center justify-center flex-shrink-0">
                        <Cookie size={32} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <Cookie className="md:hidden text-[#a78bfa]" size={24} />
                            Cookies & Confidentialité
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
                            En continuant, vous acceptez notre <a href="/privacy" className="text-[#a78bfa] hover:underline">politique de confidentialité</a>.
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Cookies nécessaires (toujours actifs)
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Google Analytics
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Préférences utilisateur
                            </span>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        <button
                            onClick={handleReject}
                            className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all font-medium text-sm"
                        >
                            Refuser
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#a78bfa] to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 transition-all font-bold text-sm shadow-lg shadow-purple-500/25"
                        >
                            Tout Accepter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
