/**
 * API pour vérifier l'accès VS Code d'un utilisateur
 * Cette API est appelée par le serveur statlabo pour vérifier les permissions
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        // Vérifier l'authentification
        const session = await auth();
        
        if (!session?.user?.email) {
            return NextResponse.json({ 
                error: 'Unauthorized',
                hasAccess: false 
            }, { status: 401 });
        }

        // Récupérer l'utilisateur avec ses permissions
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                vscodeAccess: true,
                // Inclure d'autres accès si nécessaire
                pythonAccess: true,
                analyticsAccess: true
            }
        });

        if (!user) {
            return NextResponse.json({ 
                error: 'User not found',
                hasAccess: false 
            }, { status: 404 });
        }

        // Vérifier si l'utilisateur a accès à VS Code
        // Les SUPER_ADMIN ont toujours accès
        const hasAccess = user.vscodeAccess === true || user.role === 'SUPER_ADMIN';

        return NextResponse.json({
            hasAccess,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                vscodeAccess: user.vscodeAccess,
                pythonAccess: user.pythonAccess,
                analyticsAccess: user.analyticsAccess
            }
        });

    } catch (error) {
        console.error('Error checking VS Code access:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            hasAccess: false 
        }, { status: 500 });
    }
}

/**
 * Vérification par token API (pour les appels serveur-à-serveur)
 * Le serveur statlabo peut utiliser cette méthode avec un token secret
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { userEmail, apiToken } = body;

        // Vérifier le token API secret (pour les appels depuis statlabo)
        const expectedToken = process.env.VSCODE_API_SECRET;
        
        if (!expectedToken || apiToken !== expectedToken) {
            return NextResponse.json({ 
                error: 'Invalid API token',
                hasAccess: false 
            }, { status: 403 });
        }

        if (!userEmail) {
            return NextResponse.json({ 
                error: 'User email required',
                hasAccess: false 
            }, { status: 400 });
        }

        // Récupérer l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                vscodeAccess: true
            }
        });

        if (!user) {
            return NextResponse.json({ 
                error: 'User not found',
                hasAccess: false 
            }, { status: 404 });
        }

        const hasAccess = user.vscodeAccess === true || user.role === 'SUPER_ADMIN';

        return NextResponse.json({
            hasAccess,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                vscodeAccess: user.vscodeAccess
            }
        });

    } catch (error) {
        console.error('Error in VS Code access check (POST):', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            hasAccess: false 
        }, { status: 500 });
    }
}
