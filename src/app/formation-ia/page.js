'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import RegistrationModal from '@/components/RegistrationModal';
import { useLanguage } from '@/context/LanguageContext';

export default function FormationIAPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-night-blue text-white selection:bg-light-violet selection:text-night-blue font-sans">
            {/* Navbar Placeholder if global navbar doesn't cover this route, otherwise this is fine */}

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-indigo-900/20 to-transparent blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-t from-violet-900/20 to-transparent blur-3xl -z-10"></div>

                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center lg:text-left text-white">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm text-light-violet text-sm font-semibold tracking-wide uppercase mb-4 animate-fade-in-up">
                                {t('formation_ia.badge')}
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                                {t('formation_ia.title_pre')}<br />
                                <span className="text-light-violet">{t('formation_ia.title_highlight')}</span>
                            </h1>

                            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                                {t('formation_ia.subtitle_1')}<br />
                                {t('formation_ia.subtitle_2')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-8 py-4 bg-white text-night-blue font-bold rounded-lg hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
                                >
                                    {t('formation_ia.cta_register')}
                                </button>
                                <button className="px-8 py-4 border border-gray-700 text-gray-300 font-bold rounded-lg hover:bg-gray-800/50 transition-all hover:text-white">
                                    {t('formation_ia.cta_more')}
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full relative">
                            <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-violet-500/20 group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                                <Image
                                    src="/formation-ia-hero.png"
                                    alt="Cerveau IA connecté à Python"
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                {/* Floating badge */}
                                <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-lg z-20 max-w-xs">
                                    <p className="text-sm text-gray-300 font-medium">{t('formation_ia.hero_badge_lowcode')}</p>
                                    <p className="text-xs text-gray-500 mt-1">{t('formation_ia.hero_badge_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 bg-gray-900/30">
                <div className="container mx-auto px-6 lg:px-12">

                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t('formation_ia.section_title')}<br /><span className="text-light-violet">{t('formation_ia.section_subtitle')}</span></h2>
                        <p className="text-gray-400 text-lg">
                            {t('formation_ia.section_desc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[
                            {
                                title: t('formation_ia.card_1_title'),
                                desc: t('formation_ia.card_1_desc'),
                                icon: "🧠"
                            },
                            {
                                title: t('formation_ia.card_2_title'),
                                desc: t('formation_ia.card_2_desc'),
                                icon: "🤖"
                            },
                            {
                                title: t('formation_ia.card_3_title'),
                                desc: t('formation_ia.card_3_desc'),
                                icon: "🚀"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-light-violet/50 transition-colors group">
                                <div className="text-4xl mb-6 bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-light-violet/20 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Why Participate */}
                    <div className="bg-gradient-to-r from-violet-900/20 to-indigo-900/20 rounded-3xl p-8 lg:p-16 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-light-violet/20 blur-3xl rounded-full"></div>

                        <h2 className="text-3xl font-bold mb-10 relative z-10">{t('formation_ia.why_title')}</h2>
                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            <div className="space-y-3">
                                <h4 className="text-xl font-semibold text-white">{t('formation_ia.why_1_title')}</h4>
                                <p className="text-gray-400">{t('formation_ia.why_1_desc')}</p>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xl font-semibold text-white">{t('formation_ia.why_2_title')}</h4>
                                <p className="text-gray-400">{t('formation_ia.why_2_desc')}</p>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xl font-semibold text-white">{t('formation_ia.why_3_title')}</h4>
                                <p className="text-gray-400">{t('formation_ia.why_3_desc')}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-light-violet/5 -z-10"></div>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-8">{t('formation_ia.footer_title')}</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        {t('formation_ia.footer_subtitle')}
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-lg font-bold rounded-full shadow-neon hover:shadow-neon-hover transform hover:scale-105 transition-all duration-300"
                    >
                        {t('formation_ia.footer_cta')}
                    </button>
                </div>
            </section>

            {/* Modal */}
            <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
