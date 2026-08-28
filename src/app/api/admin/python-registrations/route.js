import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

// GET - Récupérer toutes les inscriptions Python avec filtres
export async function GET(req) {
    try {
        const session = await auth();

        // Vérification des permissions
        const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                         session?.user?.role === 'ADMIN' ||
                         session?.user?.pythonAccess === true;

        if (!hasAccess) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const learningMode = searchParams.get('learningMode');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 50;

        // Construire les filtres
        let where = {};
        
        if (status && status !== 'ALL') {
            where.status = status;
        }
        
        if (learningMode && learningMode !== 'ALL') {
            where.learningMode = learningMode;
        }
        
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } }
            ];
        }

        // Récupérer les inscriptions avec pagination
        const skip = (page - 1) * limit;
        
        const [registrations, total] = await Promise.all([
            prisma.pythonRegistration.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.pythonRegistration.count({ where })
        ]);

        // Calculer les statistiques
        const stats = await prisma.pythonRegistration.aggregate({
            _count: { id: true },
            where: {}
        });

        const statsByStatus = await prisma.pythonRegistration.groupBy({
            by: ['status'],
            _count: true
        });

        const statsByMode = await prisma.pythonRegistration.groupBy({
            by: ['learningMode'],
            _count: true
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const newToday = await prisma.pythonRegistration.count({
            where: { createdAt: { gte: today } }
        });

        return NextResponse.json({
            registrations,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            stats: {
                total: stats._count.id,
                newToday,
                byStatus: statsByStatus,
                byMode: statsByMode
            }
        });

    } catch (error) {
        console.error('Error fetching Python registrations:', error);
        return NextResponse.json({ 
            error: 'Erreur lors de la récupération des inscriptions' 
        }, { status: 500 });
    }
}

// PATCH - Mettre à jour le statut d'une inscription
export async function PATCH(req) {
    try {
        const session = await auth();

        if (!session?.user?.role || 
            (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const body = await req.json();
        const { id, status, notes } = body;

        if (!id || !status) {
            return NextResponse.json({ 
                error: 'ID et statut requis' 
            }, { status: 400 });
        }

        const validStatuses = ['PENDING', 'CONTACTED', 'APPROVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ 
                error: 'Statut invalide' 
            }, { status: 400 });
        }

        const updateData = {
            status,
            notes: notes || undefined
        };

        if (status === 'APPROVED') {
            updateData.approvedBy = session.user.id;
            updateData.approvedAt = new Date();
        }

        const registration = await prisma.pythonRegistration.update({
            where: { id },
            data: updateData
        });

        // Logger l'action
        await prisma.activityLog.create({
            data: {
                action: `PYTHON_REGISTRATION_${status}`,
                userId: session.user.id,
                targetId: id,
                targetType: 'PythonRegistration',
                details: JSON.stringify({ status, notes })
            }
        });

        return NextResponse.json({ 
            success: true, 
            registration 
        });

    } catch (error) {
        console.error('Error updating registration:', error);
        return NextResponse.json({ 
            error: 'Erreur lors de la mise à jour' 
        }, { status: 500 });
    }
}
