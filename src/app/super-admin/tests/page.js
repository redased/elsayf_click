'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { FlaskConical, Bug, Play, CheckCircle, XCircle, AlertCircle, RefreshCw, Download, ChevronDown, ChevronUp } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SuperAdminTests() {
    const { data: session, status } = useSession();
    const [tests, setTests] = useState([]);
    const [running, setRunning] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});

    // Définition des suites de tests
    const testSuites = [
        {
            id: 'auth',
            name: 'Authentification',
            icon: '🔐',
            description: 'Tests de connexion, sessions, rôles',
            tests: [
                { name: 'Session active', description: 'Vérifie que la session admin est valide' },
                { name: 'Rôles utilisateurs', description: 'Compte les utilisateurs par rôle' },
                { name: 'Permissions', description: 'Vérifie les permissions des rôles' },
                { name: 'Connexion Google', description: 'Test OAuth Google' }
            ]
        },
        {
            id: 'database',
            name: 'Base de données',
            icon: '🗄️',
            description: 'Tests de connexion et requêtes DB',
            tests: [
                { name: 'Connexion DB', description: 'Teste la connexion à la base' },
                { name: 'Comptes utilisateurs', description: 'Compte les utilisateurs par rôle' },
                { name: 'Cours publiés', description: 'Vérifie les cours publiés' },
                { name: 'Inscriptions Python', description: 'Compte les inscriptions Python' },
                { name: 'Logs email', description: 'Vérifie les logs d\'envoi' }
            ]
        },
        {
            id: 'api',
            name: 'API',
            icon: '🌐',
            description: 'Tests des endpoints API',
            tests: [
                { name: 'Python Register', description: 'Teste l\'inscription Python' },
                { name: 'Settings API', description: 'Teste la récupération des settings' },
                { name: 'Super Admin Users', description: 'Teste la gestion des utilisateurs' },
                { name: 'Affiliate Links', description: 'Teste les liens de parrainage' }
            ]
        },
        {
            id: 'python',
            name: 'Inscription Python',
            icon: '🐍',
            description: 'Tests du formulaire Python',
            tests: [
                { name: 'Validation email', description: 'Teste le regex de validation email' },
                { name: 'Champs obligatoires', description: 'Vérifie la validation des champs' },
                { name: 'Modules disponibles', description: 'Liste les modules configurés' },
                { name: 'Filières', description: 'Vérifie les filières disponibles' },
                { name: 'Inscription complète', description: 'Teste une inscription complète' }
            ]
        },
        {
            id: 'email',
            name: 'Email',
            icon: '📧',
            description: 'Tests du système d\'email',
            tests: [
                { name: 'Configuration SMTP', description: 'Vérifie la configuration SMTP' },
                { name: 'Logs récents', description: 'Affiche les derniers emails envoyés' },
                { name: 'Template welcome', description: 'Teste le template de bienvenue' },
                { name: 'Template Python', description: 'Teste le template Python' }
            ]
        },
        {
            id: 'affiliate',
            name: 'Affiliation & Analytics',
            icon: '🔗',
            description: 'Tests du système d\'affiliation',
            tests: [
                { name: 'Création lien affiliation', description: 'Teste la création d\'un lien' },
                { name: 'Tracking clic v1', description: 'Vérifie le tracking legacy' },
                { name: 'Tracking clic v2', description: 'Vérifie le tracking avancé' },
                { name: 'Détection device', description: 'Teste la détection mobile/tablet/desktop' },
                { name: 'Détection OS', description: 'Teste la détection Windows/macOS/iOS/Android' },
                { name: 'Détection browser', description: 'Teste la détection Chrome/Safari/Firefox' },
                { name: 'Détection source', description: 'Teste la détection Facebook/Instagram/etc' },
                { name: 'Attribution conversion', description: 'Vérifie l\'attribution des inscriptions' },
                { name: 'Cookie tracking', description: 'Teste les cookies de tracking 30j' },
                { name: 'Stats affiliate', description: 'Vérifie les statistiques par affilié' },
                { name: 'Top performers', description: 'Teste le classement des performeurs' },
                { name: 'Export analytics', description: 'Teste l\'export des données' }
            ]
        },
        {
            id: 'performance',
            name: 'Performance',
            icon: '⚡',
            description: 'Tests de performance',
            tests: [
                { name: 'Temps de réponse API', description: 'Mesure le temps de réponse moyen' },
                { name: 'Taille de la base', description: 'Vérifie la taille de la DB' },
                { name: 'Mémoire utilisée', description: 'Estime la mémoire utilisée' },
                { name: 'Connexions actives', description: 'Compte les connexions DB actives' }
            ]
        },
        {
            id: 'security',
            name: 'Sécurité',
            icon: '🛡️',
            description: 'Tests de sécurité',
            tests: [
                { name: 'Injection SQL', description: 'Tente une injection SQL' },
                { name: 'XSS Prevention', description: 'Teste la prévention XSS' },
                { name: 'CSRF Token', description: 'Vérifie les tokens CSRF' },
                { name: 'Rate Limiting', description: 'Teste la limitation de taux' }
            ]
        },
        {
            id: 'integration',
            name: 'Intégration',
            icon: '🔗',
            description: 'Tests d\'intégration',
            tests: [
                { name: 'Google Analytics', description: 'Vérifie l\'intégration GA' },
                { name: 'Chargily Payment', description: 'Teste l\'intégration Chargily' },
                { name: 'Pusher', description: 'Teste les websockets Pusher' },
                { name: 'AI Providers', description: 'Teste les providers IA' }
            ]
        }
    ];

    const runTestSuite = async (suiteId) => {
        setRunning(true);
        setSelectedTest(suiteId);

        try {
            const response = await fetch('/api/super-admin/run-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testGroup: suiteId })
            });

            const data = await response.json();

            if (response.ok) {
                setTests(prev => {
                    const updated = prev.filter(t => t.suiteId !== suiteId);
                    return [
                        ...updated,
                        {
                            suiteId,
                            timestamp: new Date().toISOString(),
                            ...data
                        }
                    ];
                });
            }
        } catch (error) {
            console.error('Error running tests:', error);
        } finally {
            setRunning(false);
        }
    };

    const runAllTests = async () => {
        setRunning(true);

        const allResults = [];

        for (const suite of testSuites) {
            try {
                const response = await fetch('/api/super-admin/run-tests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ testGroup: suite.id })
                });

                const data = await response.json();
                allResults.push({
                    suiteId: suite.id,
                    timestamp: new Date().toISOString(),
                    ...data
                });
            } catch (error) {
                allResults.push({
                    suiteId: suite.id,
                    timestamp: new Date().toISOString(),
                    error: error.message,
                    results: [{
                        name: suite.name,
                        status: 'error',
                        message: error.message
                    }]
                });
            }
        }

        setTests(allResults);
        setRunning(false);
    };

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const exportResults = () => {
        const dataStr = JSON.stringify(tests, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `test-results-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const getTestResults = (suiteId) => {
        return tests.find(t => t.suiteId === suiteId);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <CheckCircle size={20} className="text-green-500" />;
            case 'error': return <XCircle size={20} className="text-red-500" />;
            default: return <AlertCircle size={20} className="text-yellow-500" />;
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen pt-24 text-center text-gray-500">Chargement...</div>;
    }

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-lg">
                    <FlaskConical size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
                    <p className="text-gray-400">Cette page est réservée au Super Admin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <FlaskConical size={40} className="text-purple-500" />
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                Tests Unitaires
                            </h1>
                            <p className="text-gray-400 mt-1">Suite de tests complète pour le projet</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button
                            onClick={runAllTests}
                            disabled={running}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white disabled:opacity-50"
                        >
                            {running ? (
                                <>
                                    <RefreshCw size={20} className="animate-spin" />
                                    Exécution...
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    Tout exécuter
                                </>
                            )}
                        </button>
                        {tests.length > 0 && (
                            <button
                                onClick={exportResults}
                                className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
                            >
                                <Download size={18} />
                                Exporter
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats globales */}
                {tests.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="glass-card p-4 text-center">
                            <FlaskConical className="mx-auto text-blue-500 mb-2" size={24} />
                            <p className="text-2xl font-bold">{tests.length}</p>
                            <p className="text-xs text-gray-500">Suites exécutées</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
                            <p className="text-2xl font-bold text-green-500">
                                {tests.reduce((sum, t) => sum + (t.summary?.success || 0), 0)}
                            </p>
                            <p className="text-xs text-gray-500">Succès</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <XCircle className="mx-auto text-red-500 mb-2" size={24} />
                            <p className="text-2xl font-bold text-red-500">
                                {tests.reduce((sum, t) => sum + (t.summary?.error || 0), 0)}
                            </p>
                            <p className="text-xs text-gray-500">Erreurs</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <AlertCircle className="mx-auto text-yellow-500 mb-2" size={24} />
                            <p className="text-2xl font-bold text-yellow-500">
                                {tests.reduce((sum, t) => sum + (t.summary?.warning || 0), 0)}
                            </p>
                            <p className="text-xs text-gray-500">Warnings</p>
                        </div>
                    </div>
                )}

                {/* Suites de tests */}
                <div className="space-y-4">
                    {testSuites.map((suite) => {
                        const results = getTestResults(suite.id);
                        const isExpanded = expandedSections[suite.id];

                        return (
                            <div key={suite.id} className="glass-card overflow-hidden">
                                <button
                                    onClick={() => toggleSection(suite.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{suite.icon}</span>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold">{suite.name}</h3>
                                            <p className="text-sm text-gray-400">{suite.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {results && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-green-500">✓ {results.summary?.success || 0}</span>
                                                <span className="text-red-500">✗ {results.summary?.error || 0}</span>
                                                <span className="text-yellow-500">⚠ {results.summary?.warning || 0}</span>
                                            </div>
                                        )}
                                        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-gray-800 p-6">
                                        {/* Liste des tests */}
                                        <div className="mb-6">
                                            <h4 className="font-medium mb-3">Tests disponibles :</h4>
                                            <div className="grid md:grid-cols-2 gap-2">
                                                {suite.tests.map((test, idx) => (
                                                    <div key={idx} className="text-sm p-2 bg-white/5 rounded">
                                                        <span className="font-medium">{test.name}</span>
                                                        <p className="text-gray-400 text-xs">{test.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bouton d'exécution */}
                                        <button
                                            onClick={() => runTestSuite(suite.id)}
                                            disabled={running}
                                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            {running && selectedTest === suite.id ? (
                                                <>
                                                    <RefreshCw size={20} className="animate-spin" />
                                                    Exécution en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={20} />
                                                    Exécuter la suite {suite.name}
                                                </>
                                            )}
                                        </button>

                                        {/* Résultats */}
                                        {results && results.results && (
                                            <div className="mt-6 space-y-2">
                                                <h4 className="font-medium">Résultats :</h4>
                                                {results.results.map((result, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-4 rounded-lg border ${
                                                            result.status === 'success'
                                                                ? 'bg-green-500/10 border-green-500/30'
                                                                : result.status === 'error'
                                                                ? 'bg-red-500/10 border-red-500/30'
                                                                : 'bg-yellow-500/10 border-yellow-500/30'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {getStatusIcon(result.status)}
                                                            <div className="flex-1">
                                                                <div className="font-medium">{result.name}</div>
                                                                <div className="text-sm text-gray-400 mt-1">{result.message}</div>
                                                                {result.details && (
                                                                    <details className="mt-2">
                                                                        <summary className="text-xs cursor-pointer text-gray-500 hover:text-gray-300">
                                                                            Voir les détails
                                                                        </summary>
                                                                        <pre className="text-xs bg-black/30 p-3 mt-2 rounded overflow-x-auto">
                                                                            {JSON.stringify(result.details, null, 2)}
                                                                        </pre>
                                                                    </details>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
