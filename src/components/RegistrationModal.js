"use client";
import React, { useState } from 'react';

const RegistrationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        phone: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    type: 'online' // Default value as context implies online formation
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false); // Reset state
                    setFormData({ lastName: '', firstName: '', email: '', phone: '' }); // Clear form
                    onClose();
                }, 3000);
            } else {
                setError(data.error || 'Une erreur est survenue lors de l\'inscription.');
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setError('Une erreur technique est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-blue/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-night-blue border border-gray-800 rounded-2xl shadow-glass-hover overflow-hidden transform transition-all scale-100">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
                    <h2 className="text-xl font-bold text-white">Inscription à la formation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {submitted ? (
                        <div className="text-center py-8 animate-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-500/20 text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Merci !</h3>
                            <p className="text-gray-400">Votre demande a bien été enregistrée. Vous recevrez une invitation bientôt.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Nom <span className="text-light-violet">*</span></label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-light-violet focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Prénom <span className="text-light-violet">*</span></label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-light-violet focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                                        placeholder="John"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email <span className="text-light-violet">*</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-light-violet focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Téléphone <span className="text-gray-500 text-xs">(Optionnel)</span></label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-light-violet focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                                    placeholder="06 12 34 56 78"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-neon hover:shadow-neon-hover transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Traitement...
                                        </span>
                                    ) : (
                                        "S'inscrire à la liste d'attente"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;
