'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle, BookOpen, Heart, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ParentsPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-night-blue pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-semibold tracking-wider uppercase mb-4 inline-block">
                        {t('parents.title')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Accompagnez l'avenir de vos enfants
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        {t('parents.subtitle')} Une plateforme pensée pour aider les parents à suivre et motiver leurs enfants dans l'apprentissage du numérique et de l'IA.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="glass-card p-8 border-green-500/10 hover:border-green-500/40 transition-all group">
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('parents.card_1_title')}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {t('parents.card_1_desc')} Des ressources adaptées pour chaque âge et niveau.
                        </p>
                    </div>

                    <div className="glass-card p-8 border-green-500/10 hover:border-green-500/40 transition-all group">
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                            <Heart size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('parents.card_2_title')}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {t('parents.card_2_desc')} Suivez les accomplissements, les badges et le temps passé à apprendre.
                        </p>
                    </div>

                    <div className="glass-card p-8 border-green-500/10 hover:border-green-500/40 transition-all group">
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('parents.card_3_title')}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {t('parents.card_3_desc')} Un environnement sécurisé et des conseils pour une navigation saine.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green-600/10 rounded-full blur-3xl"></div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Pourquoi un Espace Parent ?</h2>
                            <ul className="space-y-4">
                                {[
                                    "Comprendre les enjeux de l'IA pour vos enfants",
                                    "Encourager la créativité plutôt que la consommation",
                                    "Accompagner sans être un expert technique",
                                    "Participer à des webinaires dédiés"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle size={20} className="text-green-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link href="/register" className="btn btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2">
                                    Inscrire mon enfant <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&q=80&w=800"
                                alt="Parents and children"
                                className="rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute -inset-4 border border-green-500/20 rounded-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
