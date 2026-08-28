import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const resolvedParams = await params;
        const surveyId = resolvedParams.id;

        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                },
                responses: {
                    include: {
                        answers: true,
                        user: { select: { id: true, name: true, email: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!survey) {
            return NextResponse.json({ error: 'Sondage introuvable' }, { status: 404 });
        }

        // --- Calculate Statistics ---
        const stats = {};

        survey.fields.forEach(field => {
            const fieldAnswers = survey.responses.flatMap(r => r.answers.filter(a => a.fieldId === field.id));

            if (fieldAnswers.length === 0) {
                stats[field.id] = { totalResponses: 0 };
                return;
            }

            if (field.type === 'NOMBRE' || field.type === 'EVALUATION') {
                const values = fieldAnswers.map(a => parseFloat(a.responseValue)).filter(v => !isNaN(v));
                if (values.length > 0) {
                    const sum = values.reduce((a, b) => a + b, 0);
                    const mean = sum / values.length;

                    // Standard Deviation
                    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
                    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
                    const stdDev = Math.sqrt(avgSquareDiff);

                    stats[field.id] = {
                        totalResponses: values.length,
                        mean: mean.toFixed(2),
                        stdDev: stdDev.toFixed(2),
                        min: Math.min(...values),
                        max: Math.max(...values)
                    };
                } else {
                    stats[field.id] = { totalResponses: 0, error: 'Pas de valeurs numériques valides' };
                }
            } else if (field.type === 'CHOIX_UNIQUE' || field.type === 'CHOIX_MULTIPLES') {
                const counts = {};
                fieldAnswers.forEach(a => {
                    let values = [];
                    if (field.type === 'CHOIX_MULTIPLES') {
                        try { values = JSON.parse(a.responseValue); }
                        catch (e) { values = [a.responseValue]; }
                    } else {
                        values = [a.responseValue];
                    }

                    values.forEach(val => {
                        if (val) counts[val] = (counts[val] || 0) + 1;
                    });
                });

                stats[field.id] = {
                    totalResponses: fieldAnswers.length,
                    counts
                };
            } else { // TEXTE
                stats[field.id] = {
                    totalResponses: fieldAnswers.length,
                    latest: fieldAnswers.slice(0, 5).map(a => a.responseValue) // return last 5 texts
                }
            }
        });

        return NextResponse.json({ survey, stats });

    } catch (error) {
        console.error('Error fetching survey details:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des détails' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const resolvedParams = await params;
        await prisma.survey.delete({
            where: { id: resolvedParams.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting survey:', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }
}
