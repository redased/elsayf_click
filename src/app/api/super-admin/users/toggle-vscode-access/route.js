/**
 * API pour activer/désactiver l'accès VS Code d'un utilisateur
 * Accessible uniquement aux SUPER_ADMIN
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        // Vérifier l'authentification
        const session = await auth();
        
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ 
                error: 'Unauthorized - Super Admin only' 
            }, { status: 401 });
        }

        const body = await request.json();
        const { userId, vscodeAccess } = body;

        if (!userId) {
            return NextResponse.json({ 
                error: 'User ID is required' 
            }, { status: 400 });
        }

        if (typeof vscodeAccess !== 'boolean') {
            return NextResponse.json({ 
                error: 'vscodeAccess boolean is required' 
            }, { status: 400 });
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { vscodeAccess },
            select: {
                id: true,
                email: true,
                name: true,
                vscodeAccess: true,
                role: true
            }
        });

        // Logger l'action
        await prisma.activityLog.create({
            data: {
                action: vscodeAccess ? 'GRANT_VSCODE_ACCESS' : 'REVOKE_VSCODE_ACCESS',
                userId: session.user.id,
                targetId: userId,
                targetType: 'User',
                details: JSON.stringify({
                    vscodeAccess,
                    adminEmail: session.user.email
                })
            }
        });

        return NextResponse.json({
            success: true,
            message: vscodeAccess 
                ? 'Accès VS Code accordé avec succès' 
                : 'Accès VS Code révoqué avec succès',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error toggling VS Code access:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Récupérer la liste des utilisateurs avec leur statut VS Code
 */
export async function GET(request) {
    try {
        const session = await auth();
        
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ 
                error: 'Unauthorized' 
            }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all'; // all, with_access, without_access

        let whereClause = {};
        
        if (filter === 'with_access') {
            whereClause = { vscodeAccess: true };
        } else if (filter === 'without_access') {
            whereClause = { vscodeAccess: false };
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                vscodeAccess: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Statistiques
        const stats = {
            total: await prisma.user.count(),
            withAccess: await prisma.user.count({ where: { vscodeAccess: true } }),
            withoutAccess: await prisma.user.count({ where: { vscodeAccess: false } })
        };

        return NextResponse.json({
            users,
            stats,
            filter
        });

    } catch (error) {
        console.error('Error fetching VS Code users:', error);
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
