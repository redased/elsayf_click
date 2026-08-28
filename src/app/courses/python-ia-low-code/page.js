'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, CheckCircle, Brain, Rocket, Code, Laptop } from 'lucide-react';
import Image from 'next/image';

export default function CourseBrochure() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: 'online' // Default preference
    });

    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
            } else {
                const data = await res.json();
                alert(data.error || 'Une erreur est survenue.');
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center container mx-auto px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-12 text-center max-w-2xl"
                >
                    <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Inscription Confirmée !</h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Merci {formData.firstName}. Vous faites maintenant partie de l'aventure Python & IA.
                        <br />
                        Nous avons bien noté votre préférence pour le format <strong className="text-[#a78bfa]">{formData.type === 'online' ? 'En Ligne' : 'Présentiel'}</strong>.
                    </p>
                    <p className="text-gray-400">
                        Vous recevrez bientôt un email avec tous les détails pour la première séance gratuite.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-20">

            {/* Hero Header */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#a78bfa] rounded-full blur-[120px] opacity-10 -z-10"></div>

                <div className="container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-2 rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa] text-sm font-semibold tracking-wider uppercase mb-6 inline-block">
                            Nouvelle Formation Inédite
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-[#a78bfa]">
                            Python & IA : <br /> Du "Low Code" au Déploiement
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                            Accessible même sans connaissances préalables. Concrétisez vos idées en applications web ou logiciels,
                            boostés par l'Intelligence Artificielle.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

                {/* Course Details (Left Column) */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-12"
                >

                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Brain className="text-[#a78bfa]" /> Au Programme
                        </h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="min-w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Les Bases Fondamentales</h3>
                                    <p className="text-gray-400">Notions d’algorithmes pour comprendre la logique de la programmation sans se perdre.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="min-w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Coder avec l'IA (Low Code)</h3>
                                    <p className="text-gray-400">Apprendre à utiliser Python assisté par l'IA. Ce n'est pas du "No Code", mais du code accessible et modifiable à volonté.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="min-w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Déploiement Pro</h3>
                                    <p className="text-gray-400">Savoir héberger son site et son application web sur un hébergeur réel (Hostinger : VPS et mutualisé).</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="glass p-8 rounded-2xl border-l-4 border-[#a78bfa]">
                        <h3 className="text-xl font-bold mb-2 text-white">Séance Découverte Offerte</h3>
                        <p className="text-gray-300">
                            La première séance sera <strong className="text-[#a78bfa]">gratuite</strong> pour vous permettre de juger si cette approche vous correspond.
                            La seule limite sera votre imagination.
                        </p>
                    </div>

                </motion.div>

                {/* Registration Form (Right Column) */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#a78bfa] to-blue-600 rounded-2xl blur opacity-30"></div>
                    <div className="glass-card p-8 relative">
                        <h2 className="text-3xl font-bold mb-2">Réserver ma place</h2>
                        <p className="text-gray-400 mb-8">Remplissez ce formulaire pour être averti du lancement.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Prénom <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="input-field pl-10"
                                            placeholder="Votre prénom"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Nom <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="input-field pl-10"
                                            placeholder="Votre nom"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="label">Email <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="input-field pl-10"
                                        placeholder="vous@exemple.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Téléphone (Optionnel)</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        type="tel"
                                        className="input-field pl-10"
                                        placeholder="+213 ..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <label className="label mb-4 block text-lg text-white">Quelle est votre préférence ? <span className="text-[#a78bfa]">*</span></label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setFormData({ ...formData, type: 'online' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${formData.type === 'online'
                                                ? 'border-[#a78bfa] bg-[#a78bfa]/10 text-white'
                                                : 'border-gray-700 hover:border-gray-500 text-gray-400'
                                            }`}
                                    >
                                        <Laptop size={24} className={formData.type === 'online' ? 'text-[#a78bfa]' : ''} />
                                        <span className="font-semibold">En Ligne</span>
                                    </div>

                                    <div
                                        onClick={() => setFormData({ ...formData, type: 'onsite' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${formData.type === 'onsite'
                                                ? 'border-[#a78bfa] bg-[#a78bfa]/10 text-white'
                                                : 'border-gray-700 hover:border-gray-500 text-gray-400'
                                            }`}
                                    >
                                        <BookOpen size={24} className={formData.type === 'onsite' ? 'text-[#a78bfa]' : ''} />
                                        <span className="font-semibold">Présentiel</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Ce choix nous aide à organiser les groupes.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="btn btn-primary w-full py-4 text-lg font-bold shadow-neon hover:shadow-neon-hover mt-6"
                            >
                                {status === 'loading' ? 'Inscription en cours...' : 'Je m\'inscris à la séance offerte'}
                            </button>

                        </form>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
