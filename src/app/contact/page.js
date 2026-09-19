'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Clock, CheckCircle, Send, ArrowLeft, MapPin, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi et notification
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Navigation retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        {/* En-tête */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Mail size={14} /> Assistance & Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Contactez notre Équipe
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Une question sur nos formations, un problème d'accès ou une proposition de partenariat ?
            Notre équipe d'ingénieurs et formateurs vous répond sous 24h.
          </p>
        </div>

        {/* Grid Contact */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Coordonnées & Engagements */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-gray-900/60 border border-gray-800 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" /> Informations Directes
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Email de Support</div>
                    <a href="mailto:contact@statlabo.com" className="text-white hover:text-purple-400 font-medium transition-colors">
                      contact@statlabo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Délai de Réponse</div>
                    <div className="text-white font-medium">Moins de 24 heures ouvrées</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Communauté & Forum</div>
                    <div className="text-white font-medium">Entraide étudiante en direct</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Encadré FAQ Rapide */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/20 to-gray-900 border border-purple-500/20 space-y-3">
              <h3 className="font-bold text-white text-base">Questions Fréquentes</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                • <strong>Les cours sont-ils gratuits ?</strong> Oui, l'accès à l'ensemble des 10 parcours de formation est 100% libre et gratuit.<br />
                • <strong>Faut-il installer Python ?</strong> Non, notre IDE en ligne vous permet d'exécuter vos scripts directement depuis votre navigateur.
              </p>
            </div>
          </div>

          {/* Formulaire de Contact */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Envoyé avec Succès !</h3>
                <p className="text-gray-300 text-sm max-w-md mx-auto">
                  Merci de nous avoir contactés. Un membre de notre équipe pédagogique traitera votre demande à l'adresse{' '}
                  <span className="text-purple-400 font-semibold">{formData.email}</span> dans les meilleurs délais.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-6 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold transition-all mt-4"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Votre Nom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sofiane Mansouri"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Adresse E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Sujet de votre demande *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Question sur le cours Power BI ou l'IDE en ligne"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Votre Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Bonjour, je souhaiterais obtenir des précisions concernant..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Envoyer ma demande</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  En soumettant ce formulaire, vous acceptez notre{' '}
                  <Link href="/privacy" className="text-purple-400 hover:underline">
                    politique de confidentialité
                  </Link>. Vos données ne sont jamais transmises à des tiers.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
