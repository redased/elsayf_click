import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const surveys = await prisma.survey.findMany({
            include: {
                _count: {
                    select: { responses: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(surveys);
    } catch (error) {
        console.error('Error fetching surveys:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des sondages' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await req.json();
        const { customId, title, description, fields } = body;

        if (!customId || !title || !fields || fields.length === 0) {
            return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
        }

        // Check if customId already exists
        const existingSurvey = await prisma.survey.findUnique({
            where: { customId }
        });

        if (existingSurvey) {
            return NextResponse.json({ error: 'Cet identifiant de sondage existe déjà (customId)' }, { status: 400 });
        }

        const survey = await prisma.survey.create({
            data: {
                customId,
                title,
                description,
                fields: {
                    create: fields.map((field, index) => ({
                        label: field.label,
                        type: field.type,
                        options: field.options ? JSON.stringify(field.options) : null,
                        required: field.required || false,
                        order: index
                    }))
                }
            }
        });

        return NextResponse.json(survey);

    } catch (error) {
        console.error('Error creating survey:', error);
        return NextResponse.json({ error: 'Erreur lors de la création du sondage' }, { status: 500 });
    }
}
