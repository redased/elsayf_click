'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-white">Une erreur s'est produite !</h2>
            <p className="mb-8 text-gray-400 max-w-md">
                Nous sommes désolés, une erreur inattendue est survenue lors du chargement de cette page.
            </p>

            {/* Error Details (Only in development or admins - simplified here for general use) */}
            <div className="p-4 bg-black/40 rounded-lg mb-8 max-w-lg w-full text-left border border-white/5 overflow-hidden">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Message d'erreur</p>
                <code className="text-red-400 text-sm font-mono block break-words">
                    {error.message || "Erreur inconnue"}
                </code>
            </div>

            <button
                onClick={() => reset()}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all font-bold"
            >
                <RefreshCw size={18} />
                Réessayer
            </button>
        </div>
    );
}
