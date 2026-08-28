import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { code, language, packages } = await request.json();

        if (language !== 'python') {
            return NextResponse.json({ output: 'Language not supported yet.' });
        }

        const backendUrl = process.env.PYTHON_BACKEND_URL;

        // Essayer le backend Django si disponible
        if (backendUrl) {
            try {
                const res = await fetch(`${backendUrl}/api/v1/execute/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, packages: packages || [] }),
                    signal: AbortSignal.timeout(55000),
                });
                if (res.ok) {
                    const data = await res.json();
                    return NextResponse.json({ output: data.output || '(Aucun output)' });
                }
            } catch (_) {}
        }

        // Fallback : Wandbox API (Python 3.10, gratuit, sans auth)
        const res = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                compiler: 'cpython-3.10.0',
                stdin: '',
                options: '',
            }),
            signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) {
            return NextResponse.json({ output: `Erreur d'exécution (${res.status}). Configure le backend Python sur Render pour un accès complet.` });
        }

        const data = await res.json();
        let output = data.program_output || '';
        if (data.compiler_error) output += (output ? '\n' : '') + data.compiler_error;
        if (data.program_error) output += (output ? '\n' : '') + data.program_error;

        return NextResponse.json({ output: output || '(Aucun output)' });

    } catch (error) {
        return NextResponse.json({ output: `Erreur: ${error.message}` });
    }
}
