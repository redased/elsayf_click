import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
    try {
        const resolvedParams = await params;
        const customId = resolvedParams.customId;

        const survey = await prisma.survey.findUnique({
            where: { customId },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!survey || !survey.isActive) {
            return NextResponse.json({ error: 'Sondage introuvable ou inactif' }, { status: 404 });
        }

        // Only return necessary public data (exclude sensitive info if any in future)
        const publicSurvey = {
            id: survey.id,
            customId: survey.customId,
            title: survey.title,
            description: survey.description,
            fields: survey.fields.map(f => ({
                id: f.id,
                label: f.label,
                type: f.type,
                options: f.options ? JSON.parse(f.options) : null,
                required: f.required
            }))
        };

        return NextResponse.json(publicSurvey);
    } catch (error) {
        console.error('Error fetching public survey:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération du sondage' }, { status: 500 });
    }
}
