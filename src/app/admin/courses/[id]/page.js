'use client';
import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Globe, Users, Mail, BookOpen, AlertCircle, XCircle, CheckCircle, UserX, Brain } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditCoursePage({ params }) {
    const { id } = params;
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') || 'edit';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(tabParam);
    const [course, setCourse] = useState({
        title: '',
        slug: '',
        description: '',
        fullDescription: '',
        price: 0,
        level: 'Débutant',
        duration: '',
        image: '',
        learningOutcomes: [],
        requirements: [],
        isPublished: false,
        isFree: false
    });

    const [students, setStudents] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingInvitations, setLoadingInvitations] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'students') {
            fetchStudents();
        } else if (activeTab === 'invitations') {
            fetchInvitations();
        }
    }, [activeTab, id]);

    const fetchCourse = () => {
        fetch(`/api/admin/courses/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.course) {
                    setCourse({
                        ...data.course,
                        learningOutcomes: data.course.learningOutcomes ? JSON.parse(data.course.learningOutcomes) : [],
                        requirements: data.course.requirements ? JSON.parse(data.course.requirements) : []
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const fetchStudents = () => {
        setLoadingStudents(true);
        fetch(`/api/admin/courses/${id}/students`)
            .then(res => res.json())
            .then(data => {
                setStudents(data.students || []);
                setLoadingStudents(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingStudents(false);
            });
    };

    const fetchInvitations = () => {
        setLoadingInvitations(true);
        fetch(`/api/admin/courses/${id}/invitations`)
            .then(res => res.json())
            .then(data => {
                setInvitations(data.invitations || []);
                setLoadingInvitations(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingInvitations(false);
            });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            });
            if (res.ok) {
                alert('Formation sauvegardée !');
                router.refresh();
            } else {
                alert('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        }
        setSaving(false);
    };

    const handleRevokeAccess = async (userId) => {
        if (!confirm('Êtes-vous sûr de vouloir révoquer l\'accès de cet étudiant ?')) return;

        try {
            const res = await fetch(`/api/admin/courses/${id}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action: 'revoke' })
            });

            if (res.ok) {
                fetchStudents();
            } else {
                alert('Erreur lors de la révocation');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        }
    };

    const handleInvitationAction = async (invitationId, action) => {
        try {
            const res = await fetch(`/api/admin/courses/${id}/invitations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invitationId, action })
            });

            if (res.ok) {
                fetchInvitations();
            } else {
                alert('Erreur lors du traitement');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        }
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...course[field]];
        newArray[index] = value;
        setCourse(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setCourse(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field, index) => {
        const newArray = course[field].filter((_, i) => i !== index);
        setCourse(prev => ({ ...prev, [field]: newArray }));
    };

    if (loading) return <div className="p-8 text-center text-white">Chargement...</div>;

    const tabs = [
        { id: 'edit', label: 'Éditer le cours', icon: BookOpen },
        { id: 'students', label: 'Étudiants', icon: Users, count: students.length },
        { id: 'invitations', label: 'Invitations', icon: Mail, count: invitations.filter(i => i.status === 'PENDING').length },
        { id: 'translate', label: 'Traductions IA', icon: Globe },
        { id: 'enrich', label: 'Agent Robot', icon: Brain },
    ];

    return (
        <div className="min-h-screen pt-24 px-4 pb-20 container mx-auto text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/admin/courses" className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <ArrowLeft size={20} /> Retour aux formations
                </Link>
                <div className="flex gap-4">
                    <Link href={`/courses/${course.slug}`} target="_blank" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded flex items-center gap-2">
                        <Globe size={18} /> Voir la page publique
                    </Link>
                    {activeTab === 'edit' && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded flex items-center gap-2 font-bold disabled:opacity-50"
                        >
                            <Save size={18} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    )}
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-6">{course.title}</h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-[#a78bfa] text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            <Icon size={18} />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'edit' && (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="glass-card p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Informations Principales</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Titre de la formation</label>
                                    <input
                                        type="text"
                                        value={course.title}
                                        onChange={e => setCourse({ ...course, title: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={course.slug}
                                        disabled
                                        className="w-full bg-[#0f172a]/50 border border-gray-600 rounded p-2 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description courte (Card)</label>
                                    <textarea
                                        rows={3}
                                        value={course.description}
                                        onChange={e => setCourse({ ...course, description: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Page de Vente (Détails)</h2>
                            <div className="mb-6">
                                <label className="block text-sm text-gray-400 mb-1">Description Complète (Markdown supporté)</label>
                                <textarea
                                    rows={10}
                                    value={course.fullDescription || ''}
                                    onChange={e => setCourse({ ...course, fullDescription: e.target.value })}
                                    className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white font-mono text-sm"
                                    placeholder="# Bienvenue dans cette formation..."
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm text-gray-400 mb-2">Ce que vous allez apprendre (Learning Outcomes)</label>
                                {course.learningOutcomes.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={e => handleArrayChange('learningOutcomes', idx, e.target.value)}
                                            className="flex-1 bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                        />
                                        <button onClick={() => removeArrayItem('learningOutcomes', idx)} className="text-red-400 hover:text-red-300">X</button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('learningOutcomes')} className="text-sm text-indigo-400 hover:text-indigo-300">+ Ajouter un point</button>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Pré-requis</label>
                                {course.requirements.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={e => handleArrayChange('requirements', idx, e.target.value)}
                                            className="flex-1 bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                        />
                                        <button onClick={() => removeArrayItem('requirements', idx)} className="text-red-400 hover:text-red-300">X</button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('requirements')} className="text-sm text-indigo-400 hover:text-indigo-300">+ Ajouter un pré-requis</button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Paramètres</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={course.isPublished}
                                        onChange={e => setCourse({ ...course, isPublished: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-600 bg-[#0f172a]"
                                    />
                                    <label htmlFor="isPublished" className="text-white font-medium">Publier la formation</label>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <input
                                            type="checkbox"
                                            id="isFree"
                                            checked={course.isFree || false}
                                            onChange={e => setCourse({ ...course, isFree: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-600 bg-[#0f172a]"
                                        />
                                        <label htmlFor="isFree" className="text-white font-medium">Cours Gratuit ?</label>
                                    </div>

                                    <label className="block text-sm text-gray-400 mb-1">Prix (DA)</label>
                                    <input
                                        type="number"
                                        value={course.price}
                                        disabled={course.isFree}
                                        onChange={e => setCourse({ ...course, price: parseFloat(e.target.value) })}
                                        className={`w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white ${course.isFree ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Niveau</label>
                                    <select
                                        value={course.level}
                                        onChange={e => setCourse({ ...course, level: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                    >
                                        <option value="Débutant">Débutant</option>
                                        <option value="Intermédiaire">Intermédiaire</option>
                                        <option value="Avancé">Avancé</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Durée (ex: 10h 30m)</label>
                                    <input
                                        type="text"
                                        value={course.duration}
                                        onChange={e => setCourse({ ...course, duration: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">URL Image</label>
                                    <input
                                        type="text"
                                        value={course.image}
                                        onChange={e => setCourse({ ...course, image: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-600 rounded p-2 text-white"
                                    />
                                    {course.image && (
                                        <img src={course.image} alt="Preview" className="mt-2 w-full rounded border border-gray-600" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="glass-card p-6 border border-gray-800">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Users size={24} className="text-[#a78bfa]" />
                        Étudiants Inscrits ({students.length})
                    </h2>

                    {loadingStudents ? (
                        <div className="text-center py-8 text-gray-500">Chargement...</div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucun étudiant inscrit à ce cours
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Étudiant</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Progression</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Inscrit le</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(enrollment => (
                                        <tr key={enrollment.id} className="border-b border-gray-800 hover:bg-white/5">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    {enrollment.user.image ? (
                                                        <img src={enrollment.user.image} className="w-10 h-10 rounded-full" alt="" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#a78bfa] flex items-center justify-center">
                                                            {enrollment.user.name?.[0] || enrollment.user.email?.[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold">{enrollment.user.name || `${enrollment.user.firstName || ''} ${enrollment.user.lastName || ''}`}</p>
                                                        <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${enrollment.enrollmentType === 'FREE'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-purple-500/20 text-purple-400'
                                                    }`}>
                                                    {enrollment.enrollmentType === 'FREE' ? 'Gratuit' : 'Payant'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-[#a78bfa] h-full rounded-full"
                                                            style={{ width: `${enrollment.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-400">{enrollment.progress}%</span>
                                                </div>
                                                {enrollment.completed && (
                                                    <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                                        <CheckCircle size={12} /> Terminé
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-gray-400">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleRevokeAccess(enrollment.user.id)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                                                    title="Révoquer l'accès"
                                                >
                                                    <UserX size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'invitations' && (
                <div className="glass-card p-6 border border-gray-800">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Mail size={24} className="text-[#a78bfa]" />
                        Demandes d'Inscription ({invitations.filter(i => i.status === 'PENDING').length} en attente)
                    </h2>

                    {loadingInvitations ? (
                        <div className="text-center py-8 text-gray-500">Chargement...</div>
                    ) : invitations.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucune demande d'inscription
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invitations.map(invitation => (
                                <div key={invitation.id} className="p-4 bg-[#0a0e17] rounded-lg border border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-lg">{invitation.email}</p>
                                            <p className="text-sm text-gray-500">
                                                Demandé le {new Date(invitation.requestedAt).toLocaleDateString('fr-FR')} à {new Date(invitation.requestedAt).toLocaleTimeString('fr-FR')}
                                            </p>
                                            {invitation.processedAt && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Traité le {new Date(invitation.processedAt).toLocaleDateString('fr-FR')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${invitation.status === 'PENDING'
                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                : invitation.status === 'APPROVED'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {invitation.status === 'PENDING' ? 'En attente' : invitation.status === 'APPROVED' ? 'Approuvé' : 'Refusé'}
                                            </span>
                                            {invitation.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleInvitationAction(invitation.id, 'approve')}
                                                        className="p-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                                                        title="Approuver"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleInvitationAction(invitation.id, 'reject')}
                                                        className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                                                        title="Refuser"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'translate' && (
                <TranslationSection course={course} setCourse={setCourse} />
            )}

            {activeTab === 'enrich' && (
                <EnrichmentSection course={course} />
            )}
        </div>
    );
}

function TranslationSection({ course, setCourse }) {
    const [targetLang, setTargetLang] = useState('en');
    const [status, setStatus] = useState({}); // { [field]: 'idle' | 'loading' | 'success' | 'error' }

    const languages = [
        { code: 'en', label: 'Anglais (EN)' },
        { code: 'ar', label: 'Arabe (AR)' },
        { code: 'ja', label: 'Japonais (JA)' },
    ];

    const fields = [
        { key: 'title', label: 'Titre' },
        { key: 'description', label: 'Description courte' },
        { key: 'fullDescription', label: 'Description complète', type: 'textarea' },
        { key: 'learningOutcomes', label: 'Ce que vous allez apprendre (JSON string)', type: 'textarea' },
        { key: 'requirements', label: 'Pré-requis (JSON string)', type: 'textarea' },
    ];

    const handleTranslate = async (field) => {
        const sourceValue = field === 'learningOutcomes' || field === 'requirements'
            ? JSON.stringify(course[field]) // Use base array
            : course[field];

        if (!sourceValue) return alert('Champ source vide');

        setStatus(prev => ({ ...prev, [field]: 'loading' }));

        try {
            const res = await fetch('/api/ai/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: sourceValue,
                    sourceLang: 'fr',
                    targetLang: targetLang
                })
            });

            const data = await res.json();
            if (res.ok) {
                const targetField = `${field}_${targetLang}`;
                setCourse(prev => ({ ...prev, [targetField]: data.translatedText }));
                setStatus(prev => ({ ...prev, [field]: 'success' }));
            } else {
                alert(data.error || 'Erreur traduction');
                setStatus(prev => ({ ...prev, [field]: 'error' }));
            }
        } catch (error) {
            console.error(error);
            setStatus(prev => ({ ...prev, [field]: 'error' }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-card p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Globe size={24} className="text-[#a78bfa]" />
                    Traductions IA (Z-AI)
                </h2>

                <div className="flex gap-4 mb-8">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => setTargetLang(lang.code)}
                            className={`px-4 py-2 rounded-lg border transition-all ${targetLang === lang.code
                                ? 'bg-[#a78bfa] border-[#a78bfa] text-white'
                                : 'border-gray-700 hover:border-gray-500 text-gray-400'
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {fields.map(field => {
                        const targetKey = `${field.key}_${targetLang}`;
                        const isLoading = status[field.key] === 'loading';

                        return (
                            <div key={field.key} className="p-4 bg-[#0a0e17] rounded-lg border border-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-gray-300">{field.label} ({targetLang.toUpperCase()})</label>
                                    <button
                                        onClick={() => handleTranslate(field.key)}
                                        disabled={isLoading}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Traduction...' : 'Traduire avec Z-AI'}
                                    </button>
                                </div>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        rows={field.key === 'fullDescription' ? 6 : 3}
                                        value={course[targetKey] || ''}
                                        onChange={e => setCourse(prev => ({ ...prev, [targetKey]: e.target.value }))}
                                        className="w-full bg-[#1e293b] border border-gray-700 rounded p-2 text-white font-mono text-sm"
                                        placeholder={`Contenu en ${targetLang}...`}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={course[targetKey] || ''}
                                        onChange={e => setCourse(prev => ({ ...prev, [targetKey]: e.target.value }))}
                                        className="w-full bg-[#1e293b] border border-gray-700 rounded p-2 text-white"
                                        placeholder={`Contenu en ${targetLang}...`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function EnrichmentSection({ course }) {
    const [enriching, setEnriching] = useState(false);
    const [logs, setLogs] = useState([]);
    const [forceAll, setForceAll] = useState(false);

    const handleEnrich = async (lessonId = null) => {
        setEnriching(true);
        setLogs(prev => [...prev, { type: 'info', text: `🤖 Lancement de l'Agent Robot pour l'enrichissement interactif...` }]);
        try {
            const res = await fetch(`/api/admin/courses/${course.id}/enrich`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, forceAll })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setLogs(prev => [
                    ...prev,
                    { type: 'success', text: `✅ Succès : ${data.updatedCount} blocs de leçons ont été enrichis.` },
                    ...(data.logs || []).map(l => ({
                        type: l.status === 'success' ? 'success' : l.status === 'already_enriched' ? 'info' : 'error',
                        text: `[${l.lesson} - ${l.block || 'Général'}] : ${l.message}`
                    }))
                ]);
            } else {
                setLogs(prev => [...prev, { type: 'error', text: `❌ Erreur : ${data.error || 'Une erreur est survenue.'}` }]);
            }
        } catch (error) {
            setLogs(prev => [...prev, { type: 'error', text: `❌ Erreur réseau : ${error.message}` }]);
        }
        setEnriching(false);
    };

    return (
        <div className="space-y-6">
            <div className="glass-card p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Brain size={24} className="text-[#a78bfa]" />
                    Agent Robot d'Enrichissement IA
                </h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    L'Agent Robot de la plateforme analyse automatiquement les textes des leçons de cette formation. Il utilise l'IA pour injecter des widgets interactifs : <strong>Tuteurs de code Python (mémoire vive/variables)</strong>, <strong>Graphiques dynamiques</strong>, <strong>Tableaux triables</strong> et <strong>Nuages de points 3D</strong>. Idéal pour vulgariser les cours pour les novices sans écrire de JSON manuellement !
                </p>

                {/* Configurations */}
                <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-[#0a0e17] border border-gray-800 rounded-xl">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="forceAll"
                            checked={forceAll}
                            onChange={e => setForceAll(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-600 bg-[#0f172a]"
                        />
                        <label htmlFor="forceAll" className="text-sm text-gray-300 font-medium cursor-pointer">
                            Forcer l'enrichissement (réanalyser même si déjà interactif)
                        </label>
                    </div>

                    <button
                        onClick={() => handleEnrich()}
                        disabled={enriching}
                        className="ml-auto bg-[#a78bfa] hover:bg-[#8b5cf6] disabled:opacity-50 text-black px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                    >
                        {enriching ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : '🤖'}
                        <span>{enriching ? 'Enrichissement global en cours...' : 'Enrichir TOUTES les leçons'}</span>
                    </button>
                </div>

                {/* Liste des leçons */}
                <div className="border border-gray-800 rounded-xl overflow-hidden mb-6 text-white">
                    <div className="bg-[#0f172a] px-4 py-3 border-b border-gray-800 font-semibold text-xs text-gray-400 uppercase tracking-wider">
                        Leçons de la formation
                    </div>
                    <div className="divide-y divide-gray-800">
                        {course.lessons?.map((lesson, idx) => {
                            const hasWidgets = (lesson.contents || []).some(c =>
                                c.content?.includes('```codetutor') ||
                                c.content?.includes('```chart') ||
                                c.content?.includes('```tableinteractive') ||
                                c.content?.includes('```threed')
                            );

                            return (
                                <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                                            <span className="text-[#a78bfa] font-mono text-xs">{idx + 1}.</span>
                                            {lesson.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {lesson.contents?.length || 0} bloc(s) de contenu · Statut :{' '}
                                            <span className={hasWidgets ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                                                {hasWidgets ? '✨ Interactif (Enrichi)' : '📄 Statique (Classique)'}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleEnrich(lesson.id)}
                                        disabled={enriching}
                                        className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 disabled:opacity-50 px-4 py-2 border border-blue-500/25 rounded-xl font-semibold text-xs transition-all shrink-0 flex items-center gap-1.5 align-middle"
                                    >
                                        🤖 Enrichir avec l'IA
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Zone de logs */}
                {logs.length > 0 && (
                    <div className="bg-black border border-gray-900 rounded-xl p-4 font-mono text-xs text-green-400">
                        <div className="flex justify-between items-center border-b border-gray-900 pb-2 mb-3">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Logs d'activité de l'Agent Robot</span>
                            <button
                                onClick={() => setLogs([])}
                                className="text-gray-500 hover:text-white transition-colors text-[10px]"
                            >
                                Effacer
                            </button>
                        </div>
                        <div className="space-y-1.5 max-h-[250px] overflow-y-auto scrollbar-thin">
                            {logs.map((log, idx) => (
                                <div
                                    key={idx}
                                    className={
                                        log.type === 'error'
                                            ? 'text-red-400'
                                            : log.type === 'success'
                                            ? 'text-emerald-400'
                                            : 'text-gray-400'
                                    }
                                >
                                    {log.text}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
