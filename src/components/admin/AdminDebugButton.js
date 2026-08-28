'use client';
import { useSession } from 'next-auth/react';
import { Bug, Play, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminDebugButton() {
    const { data: session } = useSession();
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [running, setRunning] = useState(false);

    const isAdmin = session?.user?.role === 'SUPER_ADMIN' ||
        session?.user?.role === 'ADMIN' ||
        session?.user?.role === 'R_STAT_ADMIN';

    if (!isAdmin) return null;

    const runTests = async (testGroup) => {
        setRunning(true);
        setTestResults([]);

        try {
            const response = await fetch('/api/super-admin/run-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testGroup })
            });

            const data = await response.json();
            setTestResults(data.results || []);
        } catch (error) {
            setTestResults([{
                name: 'Erreur',
                status: 'error',
                message: error.message
            }]);
        } finally {
            setRunning(false);
        }
    };

    const runAllTests = async () => {
        setRunning(true);
        setTestResults([]);

        const groups = ['auth', 'database', 'api', 'python', 'email'];
        const allResults = [];

        for (const group of groups) {
            try {
                const response = await fetch('/api/super-admin/run-tests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ testGroup: group })
                });

                const data = await response.json();
                allResults.push(...(data.results || []));
            } catch (error) {
                allResults.push({
                    name: `${group} - Erreur`,
                    status: 'error',
                    message: error.message
                });
            }
        }

        setTestResults(allResults);
        setRunning(false);
    };

    return (
        <>
            {/* Bouton debug flottant */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowDebugPanel(!showDebugPanel)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 p-4 rounded-full shadow-2xl transition-all hover:scale-110"
                    title="Outils de debug admin"
                >
                    <Bug size={24} className="text-white" />
                </button>
            </div>

            {/* Panel debug */}
            {showDebugPanel && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Bug className="text-orange-500" size={28} />
                                Admin Debug Panel
                            </h2>
                            <button
                                onClick={() => {
                                    setShowDebugPanel(false);
                                    setTestResults([]);
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Informations système */}
                        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                            <h3 className="font-bold mb-2">🖥️ Informations système</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><strong>Utilisateur:</strong> {session?.user?.name}</div>
                                <div><strong>Email:</strong> {session?.user?.email}</div>
                                <div><strong>Rôle:</strong> {session?.user?.role}</div>
                                <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
                                <div><strong>URL:</strong> {window.location.href}</div>
                                <div><strong>Time:</strong> {new Date().toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Boutons de test rapide */}
                        <div className="mb-6">
                            <h3 className="font-bold mb-3">🧪 Tests rapides</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button
                                    onClick={() => runTests('auth')}
                                    disabled={running}
                                    className="bg-purple-600 hover:bg-purple-500 px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Play size={16} /> Auth
                                </button>
                                <button
                                    onClick={() => runTests('database')}
                                    disabled={running}
                                    className="bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Play size={16} /> DB
                                </button>
                                <button
                                    onClick={() => runTests('python')}
                                    disabled={running}
                                    className="bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Play size={16} /> Python
                                </button>
                                <button
                                    onClick={() => runTests('email')}
                                    disabled={running}
                                    className="bg-pink-600 hover:bg-pink-500 px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Play size={16} /> Email
                                </button>
                            </div>

                            <button
                                onClick={runAllTests}
                                disabled={running}
                                className="w-full mt-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 px-6 py-4 rounded-xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {running ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Tests en cours...
                                    </>
                                ) : (
                                    <>
                                        <Play size={24} />
                                        Exécuter tous les tests
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Résultats des tests */}
                        {testResults.length > 0 && (
                            <div>
                                <h3 className="font-bold mb-3">📊 Résultats</h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {testResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border ${result.status === 'success'
                                                    ? 'bg-green-500/20 border-green-500/30'
                                                    : result.status === 'error'
                                                        ? 'bg-red-500/20 border-red-500/30'
                                                        : 'bg-yellow-500/20 border-yellow-500/30'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {result.status === 'success' ? (
                                                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                                                ) : result.status === 'error' ? (
                                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                                                ) : (
                                                    <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-medium">{result.name}</div>
                                                    {result.message && (
                                                        <div className="text-sm text-gray-400 mt-1">{result.message}</div>
                                                    )}
                                                    {result.details && (
                                                        <pre className="text-xs bg-black/30 p-2 mt-2 rounded overflow-x-auto">
                                                            {JSON.stringify(result.details, null, 2)}
                                                        </pre>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Liens rapides */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h3 className="font-bold mb-3">🔗 Liens rapides</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {session?.user?.role === 'SUPER_ADMIN' && (
                                    <>
                                        <a
                                            href="/super-admin/tests"
                                            className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-center"
                                        >
                                            📋 Tests unitaires
                                        </a>
                                        <a
                                            href="/super-admin/settings"
                                            className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-center"
                                        >
                                            ⚙️ Paramètres
                                        </a>
                                    </>
                                )}
                                <a
                                    href="/dashboard"
                                    className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-center"
                                >
                                    📊 Dashboard
                                </a>
                                <a
                                    href="/api/health"
                                    target="_blank"
                                    className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-center"
                                >
                                    💓 Health Check
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
