import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req, { params }) {
    try {
        const resolvedParams = await params;
        const customId = resolvedParams.customId;
        const body = await req.json();
        const { answers } = body;

        if (!answers || Object.keys(answers).length === 0) {
            return NextResponse.json({ error: 'Aucune réponse fournie' }, { status: 400 });
        }

        const survey = await prisma.survey.findUnique({
            where: { customId },
            include: { fields: true }
        });

        if (!survey || !survey.isActive) {
            return NextResponse.json({ error: 'Sondage introuvable ou inactif' }, { status: 404 });
        }

        // Validate required fields
        for (const field of survey.fields) {
            if (field.required && !answers[field.id]) {
                return NextResponse.json({ error: `Le champ ${field.label} est requis` }, { status: 400 });
            }
        }

        // Get optional user info
        const session = await auth();
        const userId = session?.user?.id || null;

        // Simple info extraction
        const ipAddress = req.headers.get('x-forwarded-for') || req.ip || null;
        const userAgent = req.headers.get('user-agent') || null;

        // Save response
        const responseData = {
            surveyId: survey.id,
            userId,
            ipAddress,
            userAgent,
            answers: {
                create: Object.entries(answers).map(([fieldId, value]) => {
                    let responseValue = value;
                    if (Array.isArray(value)) {
                        responseValue = JSON.stringify(value);
                    } else if (typeof value !== 'string') {
                        responseValue = String(value);
                    }
                    return {
                        fieldId,
                        responseValue
                    };
                })
            }
        };

        const response = await prisma.surveyResponse.create({
            data: responseData
        });

        return NextResponse.json({ success: true, responseId: response.id });
    } catch (error) {
        console.error('Error submitting survey response:', error);
        return NextResponse.json({ error: 'Erreur lors de la soumission de la réponse' }, { status: 500 });
    }
}
