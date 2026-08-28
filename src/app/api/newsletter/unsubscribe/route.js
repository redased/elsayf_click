import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/newsletter/unsubscribe?token=base64email
export async function GET(req) {
    try {
        const token = req.nextUrl.searchParams.get('token');
        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
        }

        const email = Buffer.from(token, 'base64').toString('utf-8');
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 400 });
        }

        // Désabonner (mettre active: false)
        const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });
        if (subscriber) {
            await prisma.newsletterSubscriber.update({
                where: { email },
                data: { active: false }
            });
        }

        // Rediriger vers la page de confirmation (utiliser l'URL publique)
        const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'https://elsayf.statlabo.com';
        return NextResponse.redirect(`${baseUrl}/newsletter/unsubscribe?success=1&email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST /api/newsletter/unsubscribe  { email }
export async function POST(req) {
    try {
        const { email } = await req.json();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
        }

        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (!subscriber) {
            // On renvoie quand même succès pour ne pas révéler si l'email existe
            return NextResponse.json({ success: true, message: 'Désabonnement effectué' });
        }

        await prisma.newsletterSubscriber.update({
            where: { email: email.toLowerCase().trim() },
            data: { active: false }
        });

        return NextResponse.json({ success: true, message: 'Vous avez été désabonné avec succès' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
