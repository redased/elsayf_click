'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
    User, Mail, Phone, BookOpen, Code, FileText, CheckCircle, Send, 
    GraduationCap, Building, Briefcase, Monitor, Users, Clock, 
    Calendar, MapPin, Lightbulb, Target
} from 'lucide-react';

export default function PythonRegister() {
    const [formData, setFormData] = useState({
        // Informations personnelles
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        
        // Parcours d'études
        educationLevel: '',
        studyField: '',
        institution: '',
        
        // Modules
        modules: [],
        otherModule: '',
        
        // Projet à automatiser
        projectDescription: '',
        projectType: '',
        
        // Préférence de formation
        learningMode: 'online',
        preferredSchedule: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const modulesList = [
        { id: 'excel', label: 'Excel', icon: '📊', desc: 'Automatisation Excel' },
        { id: 'word', label: 'Word', icon: '📝', desc: 'Génération documents' },
        { id: 'powerpoint', label: 'PowerPoint', icon: '📽️', desc: 'Présentations auto' },
        { id: 'email', label: 'Email Marketing', icon: '📧', desc: 'Campagnes automatisées' },
        { id: 'automatisation', label: 'Automatisation', icon: '🤖', desc: 'Scripts & bots' },
        { id: 'data_analysis', label: 'Analyse de données', icon: '📈', desc: 'Data science' },
        { id: 'web_scraping', label: 'Web Scraping', icon: '🌐', desc: 'Extraction web' },
        { id: 'dashboards', label: 'Tableaux de bord', icon: '📊', desc: 'Dashboards interactifs' },
        { id: 'api', label: 'API & Intégration', icon: '🔗', desc: 'Connexion services' },
        { id: 'database', label: 'Bases de données', icon: '🗄️', desc: 'SQL & NoSQL' },
        { id: 'ai_ml', label: 'IA & Machine Learning', icon: '🧠', desc: 'Intelligence artificielle' },
        { id: 'reporting', label: 'Rapports auto', icon: '📄', desc: 'Génération rapports' }
    ];

    const educationLevels = [
        { id: 'OBAC', label: 'OBAC / Primaire', icon: '📚' },
        { id: 'CEM', label: 'CEM / Collège', icon: '📖' },
        { id: 'LYCEE', label: 'Lycée', icon: '🎓' },
        { id: 'UNIVERSITAIRE', label: 'Universitaire', icon: '🏛️' },
        { id: 'PROFESSIONNEL', label: 'Professionnel', icon: '💼' },
        { id: 'AUTRE', label: 'Autre', icon: '✨' }
    ];

    const projectTypes = [
        { id: 'personnel', label: 'Projet personnel', icon: '🏠', desc: 'Pour mon usage quotidien' },
        { id: 'professionnel', label: 'Projet professionnel', icon: '💼', desc: 'Pour mon travail' },
        { id: 'academique', label: 'Projet académique', icon: '🎓', desc: 'Pour mes études' },
        { id: 'entreprise', label: 'Projet entreprise', icon: '🏢', desc: 'Pour mon entreprise' },
        { id: 'startup', label: 'Startup / Business', icon: '🚀', desc: 'Pour lancer mon projet' },
        { id: 'autre', label: 'Autre', icon: '📋', desc: 'À préciser ci-dessous' }
    ];

    const scheduleOptions = [
        { id: 'weekday_morning', label: 'Semaine - Matin', icon: '🌅', desc: '8h - 12h' },
        { id: 'weekday_afternoon', label: 'Semaine - Après-midi', icon: '☀️', desc: '13h - 17h' },
        { id: 'weekday_evening', label: 'Semaine - Soir', icon: '🌙', desc: '18h - 22h' },
        { id: 'weekend', label: 'Week-end', icon: '📅', desc: 'Samedi & Dimanche' },
        { id: 'flexible', label: 'Flexible', icon: '⏰', desc: 'Selon disponibilité' }
    ];

    const handleModuleToggle = (moduleId) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.includes(moduleId)
                ? prev.modules.filter(m => m !== moduleId)
                : [...prev.modules, moduleId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation basique
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Veuillez remplir les champs obligatoires (nom, prénom, email)');
            setLoading(false);
            return;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez entrer une adresse email valide');
            setLoading(false);
            return;
        }

        // Validation téléphone (optionnel mais si rempli doit être valide)
        if (formData.phone && formData.phone.length < 8) {
            setError('Numéro de téléphone invalide');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/register/python', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    educationLevel: '',
                    studyField: '',
                    institution: '',
                    modules: [],
                    otherModule: '',
                    projectDescription: '',
                    projectType: '',
                    learningMode: 'online',
                    preferredSchedule: ''
                });
            } else {
                setError(data.error || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur de connexion. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card w-full max-w-2xl p-12 text-center">
                    <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Inscription réussie !</h2>
                    <p className="text-gray-400 mb-4">
                        Merci <strong>{formData.firstName || ''}</strong> ! Votre inscription a été enregistrée.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
                        <p className="text-blue-300 text-sm">
                            📧 Vous recevrez un email de confirmation sous peu.<br/>
                            📞 Notre équipe vous contactera pour finaliser votre inscription.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-block bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3 rounded-xl font-bold text-white hover:from-green-500 hover:to-blue-500 transition-all"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <Code size={60} className="mx-auto text-purple-500 mb-4" />
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Inscription Formation Python
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Apprenez à automatiser vos tâches et boostez votre productivité avec Python ! 
                        Remplissez ce formulaire pour rejoindre notre programme.
                    </p>
                </div>

                {/* Formulaire */}
                <div className="glass-card p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* SECTION 1: Informations personnelles */}
                        <div className="border-b border-gray-800 pb-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <User size={24} className="text-purple-500" />
                                Informations personnelles <span className="text-red-500">*</span>
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Prénom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                        placeholder="Jean"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                        placeholder="Dupont"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                            placeholder="jean.dupont@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">
                                        Téléphone <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                                            placeholder="+213 555 123 456"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Nécessaire pour vous contacter concernant votre formation</p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: Parcours d'études */}
                        <div className="border-b border-gray-800 pb-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <GraduationCap size={24} className="text-blue-500" />
                                Parcours d'études <span className="text-gray-500">(optionnel)</span>
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3">Niveau d'études</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {educationLevels.map((level) => (
                                        <button
                                            key={level.id}
                                            type="button"
                                            onClick={() => setFormData({...formData, educationLevel: level.id})}
                                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                                                formData.educationLevel === level.id
                                                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                                    : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">{level.icon}</span>
                                            <span className="text-sm">{level.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Filière / Domaine d'études
                                    </label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            value={formData.studyField}
                                            onChange={(e) => setFormData({...formData, studyField: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="Ex: Informatique, Médecine, Gestion..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Établissement
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            value={formData.institution}
                                            onChange={(e) => setFormData({...formData, institution: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="Ex: USTHB, Université d'Alger..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: Modules souhaités */}
                        <div className="border-b border-gray-800 pb-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Lightbulb size={24} className="text-yellow-500" />
                                Modules qui vous intéressent <span className="text-gray-500">(optionnel)</span>
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {modulesList.map((module) => (
                                    <button
                                        key={module.id}
                                        type="button"
                                        onClick={() => handleModuleToggle(module.id)}
                                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                                            formData.modules.includes(module.id)
                                                ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300'
                                                : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{module.icon}</div>
                                        <div className="font-medium text-sm">{module.label}</div>
                                        <div className="text-xs text-gray-500 mt-1">{module.desc}</div>
                                    </button>
                                ))}
                            </div>

                            {formData.modules.length > 0 && (
                                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <p className="text-sm text-yellow-300">
                                        ✓ {formData.modules.length} module{formData.modules.length > 1 ? 's' : ''} sélectionné{formData.modules.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">
                                    Autre besoin spécifique
                                </label>
                                <input
                                    type="text"
                                    value={formData.otherModule}
                                    onChange={(e) => setFormData({...formData, otherModule: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                                    placeholder="Décrivez un besoin spécifique non listé ci-dessus..."
                                />
                            </div>
                        </div>

                        {/* SECTION 4: Projet à automatiser */}
                        <div className="border-b border-gray-800 pb-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Target size={24} className="text-green-500" />
                                Votre projet d'automatisation <span className="text-gray-500">(optionnel)</span>
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3">Type de projet</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {projectTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setFormData({...formData, projectType: type.id})}
                                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                                                formData.projectType === type.id
                                                    ? 'border-green-500 bg-green-500/20 text-green-300'
                                                    : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">{type.icon}</span>
                                            <div className="font-medium text-sm">{type.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Décrivez votre projet
                                </label>
                                <textarea
                                    value={formData.projectDescription}
                                    onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 min-h-[120px]"
                                    placeholder="Décrivez ce que vous souhaitez automatiser ou réaliser avec Python. Ex: 'Je veux automatiser la génération de rapports mensuels à partir de fichiers Excel', ou 'Je veux créer un bot pour envoyer des emails automatiquement'..."
                                />
                            </div>
                        </div>

                        {/* SECTION 5: Préférence de formation */}
                        <div className="border-b border-gray-800 pb-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Monitor size={24} className="text-pink-500" />
                                Mode de formation préféré <span className="text-red-500">*</span>
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, learningMode: 'online'})}
                                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                                        formData.learningMode === 'online'
                                            ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                                            : 'border-gray-700 hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <Monitor size={28} />
                                        <span className="font-bold text-lg">En ligne</span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Formation 100% en ligne via notre plateforme. 
                                        Accédez aux cours et exercices depuis chez vous.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, learningMode: 'presentiel'})}
                                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                                        formData.learningMode === 'presentiel'
                                            ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                                            : 'border-gray-700 hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <MapPin size={28} />
                                        <span className="font-bold text-lg">Présentiel</span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Formation en présentiel à Alger. 
                                        Sessions pratiques avec un formateur.
                                    </p>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    Horaires préférés <span className="text-gray-500">(optionnel)</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {scheduleOptions.map((schedule) => (
                                        <button
                                            key={schedule.id}
                                            type="button"
                                            onClick={() => setFormData({...formData, preferredSchedule: schedule.id})}
                                            className={`p-3 rounded-lg border-2 transition-all text-center ${
                                                formData.preferredSchedule === schedule.id
                                                    ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                                                    : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="text-xl mb-1">{schedule.icon}</div>
                                            <div className="font-medium text-xs">{schedule.label}</div>
                                            <div className="text-xs text-gray-500">{schedule.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bouton de soumission */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send size={24} />
                                        Envoyer ma candidature
                                    </>
                                )}
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                                En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.
                            </p>
                        </div>
                    </form>

                    {/* Liens */}
                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <p className="text-sm text-gray-500">
                            Vous avez déjà un compte ? {' '}
                            <Link href="/login" className="text-purple-400 hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
