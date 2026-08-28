import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { code, filename } = await request.json();

        // Pour l'instant, simulation de l'exécution
        // TODO: Implémenter l'exécution Python réelle via votre backend Python

        // Simulation d'analyse de résultats
        const simulatedOutput = `
Exécution de ${filename}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Statistiques descriptives:
        Age    Salaire
count   4.0      4.000
mean   32.5  65000.000
std     6.5  12909.944
min    25.0  50000.000
25%    28.8  57500.000
50%    32.5  65000.000
75%    36.2  72500.000
max    40.0  80000.000

✅ Données chargées avec succès!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Temps d'exécution: 0.23s
`;

        // Simulation d'un délai d'exécution
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({
            success: true,
            output: simulatedOutput,
            executionTime: '0.23s'
        });

    } catch (error) {
        console.error('Error executing Python:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
