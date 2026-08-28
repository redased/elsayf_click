import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

// GET - Statistiques avancées pour SuperAdmin
export async function GET(req) {
    try {
        const session = await auth();

        if (session?.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Accès réservé aux Super Admins' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const period = searchParams.get('period') || '30days'; // 7days, 30days, 90days, all

        // Calculer la date de début selon la période
        let startDate = null;
        if (period !== 'all') {
            startDate = new Date();
            const days = parseInt(period.replace('days', ''));
            startDate.setDate(startDate.getDate() - days);
        }

        const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

        // Statistiques globales
        const totalStats = await prisma.pythonRegistration.aggregate({
            _count: { id: true },
            where: dateFilter
        });

        // Par statut
        const byStatus = await prisma.pythonRegistration.groupBy({
            by: ['status'],
            where: dateFilter,
            _count: true
        });

        // Par mode de formation
        const byMode = await prisma.pythonRegistration.groupBy({
            by: ['learningMode'],
            where: dateFilter,
            _count: true
        });

        // Par niveau d'éducation
        const byEducation = await prisma.pythonRegistration.groupBy({
            by: ['educationLevel'],
            where: { ...dateFilter, educationLevel: { not: null } },
            _count: true
        });

        // Par type de projet
        const byProjectType = await prisma.pythonRegistration.groupBy({
            by: ['projectType'],
            where: { ...dateFilter, projectType: { not: null } },
            _count: true
        });

        // Par horaire préféré
        const bySchedule = await prisma.pythonRegistration.groupBy({
            by: ['preferredSchedule'],
            where: { ...dateFilter, preferredSchedule: { not: null } },
            _count: true
        });

        // Évolution temporelle (par jour)
        let dailyEvolution = [];
        try {
            const registrations = await prisma.pythonRegistration.findMany({
                where: dateFilter,
                select: {
                    createdAt: true,
                    learningMode: true,
                    status: true
                },
                orderBy: { createdAt: 'asc' }
            });

            // Grouper par jour
            const grouped = {};
            registrations.forEach(reg => {
                const date = reg.createdAt.toISOString().split('T')[0];
                if (!grouped[date]) {
                    grouped[date] = { date, count: 0, online: 0, presentiel: 0 };
                }
                grouped[date].count++;
                if (reg.learningMode === 'online') grouped[date].online++;
                else grouped[date].presentiel++;
            });

            dailyEvolution = Object.values(grouped).slice(-90);
        } catch (e) {
            console.error('Error calculating daily evolution:', e);
        }

        // Top modules demandés (nécessite parsing JSON)
        const allRegistrations = await prisma.pythonRegistration.findMany({
            where: dateFilter,
            select: { modules: true }
        });

        const moduleCounts = {};
        allRegistrations.forEach(reg => {
            if (reg.modules) {
                try {
                    const mods = JSON.parse(reg.modules);
                    mods.forEach(m => {
                        moduleCounts[m] = (moduleCounts[m] || 0) + 1;
                    });
                } catch (e) {
                    console.error('Error parsing modules:', e);
                }
            }
        });

        const topModules = Object.entries(moduleCounts)
            .map(([module, count]) => ({ module, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Inscriptions récentes (7 derniers jours)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        
        const recentCount = await prisma.pythonRegistration.count({
            where: { createdAt: { gte: last7Days } }
        });

        // Comparaison avec période précédente
        let growthRate = 0;
        if (period !== 'all' && startDate) {
            const previousPeriodStart = new Date(startDate);
            const daysDiff = parseInt(period.replace('days', ''));
            previousPeriodStart.setDate(previousPeriodStart.getDate() - daysDiff);

            const previousPeriodCount = await prisma.pythonRegistration.count({
                where: {
                    createdAt: {
                        gte: previousPeriodStart,
                        lt: startDate
                    }
                }
            });

            growthRate = previousPeriodCount > 0 
                ? ((totalStats._count.id - previousPeriodCount) / previousPeriodCount * 100)
                : 100;
        }

        // Sources de parrainage
        const byAffiliate = await prisma.pythonRegistration.groupBy({
            by: ['affiliateCode'],
            where: { ...dateFilter, affiliateCode: { not: null } },
            _count: true
        });

        return NextResponse.json({
            period,
            summary: {
                total: totalStats._count.id,
                recent7Days: recentCount,
                growthRate: parseFloat(growthRate.toFixed(1)),
                conversionPending: byStatus.find(s => s.status === 'PENDING')?._count || 0,
                conversionApproved: byStatus.find(s => s.status === 'APPROVED')?._count || 0,
                conversionRate: totalStats._count.id > 0 
                    ? ((byStatus.find(s => s.status === 'APPROVED')?._count || 0) / totalStats._count.id * 100).toFixed(1)
                    : 0
            },
            distributions: {
                byStatus,
                byMode,
                byEducation,
                byProjectType,
                bySchedule,
                byAffiliate: byAffiliate
                    .filter(a => a.affiliateCode)
                    .sort((a, b) => b._count - a._count)
                    .slice(0, 10)
            },
            topModules,
            dailyEvolution,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching Python stats:', error);
        return NextResponse.json({ 
            error: 'Erreur lors de la récupération des statistiques',
            details: error.message
        }, { status: 500 });
    }
}

// DELETE - Supprimer une inscription (SuperAdmin uniquement)
export async function DELETE(req) {
    try {
        const session = await auth();

        if (session?.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Accès réservé aux Super Admins' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        await prisma.pythonRegistration.delete({
            where: { id }
        });

        // Logger l'action
        await prisma.activityLog.create({
            data: {
                action: 'DELETE_PYTHON_REGISTRATION',
                userId: session.user.id,
                targetId: id,
                targetType: 'PythonRegistration'
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting registration:', error);
        return NextResponse.json({ 
            error: 'Erreur lors de la suppression' 
        }, { status: 500 });
    }
}
