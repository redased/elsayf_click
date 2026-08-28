import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const session = await auth();

        // Vérification des permissions
        const hasAccess = session?.user?.role === 'SUPER_ADMIN' ||
                         session?.user?.role === 'ADMIN' ||
                         session?.user?.pythonAccess === true;

        if (!hasAccess) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
        }

        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Approuver l'accès Python
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                pythonAccess: true
            },
            select: {
                id: true,
                name: true,
                firstName: true,
                email: true,
                pythonAccess: true
            }
        });

        // Envoyer un email de notification
        try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elsayf.statlabo.com';

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM || `"El Sayf" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: '🎉 Accès Python approuvé - Formation Python',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🎉 Félicitations !</h1>
                                <p>Votre accès Python a été approuvé</p>
                            </div>
                            <div class="content">
                                <p>Bonjour <strong>${user.firstName || user.name}</strong>,</p>
                                <p>Nous avons le plaisir de vous informer que votre inscription à la formation Python a été <strong>approuvée</strong> !</p>

                                <p>Vous pouvez maintenant accéder à :</p>
                                <ul>
                                    <li>🐍 Tous les cours Python</li>
                                    <li>📚 Les exercices et projets</li>
                                    <li>💬 Le forum de discussion</li>
                                    <li>🎯 Le suivi de progression</li>
                                </ul>

                                <div style="text-align: center;">
                                    <a href="${appUrl}/dashboard" class="button">🚀 Accéder à la formation</a>
                                </div>

                                <p style="margin-top: 20px;">
                                    Si vous avez des questions, n'hésitez pas à nous contacter.
                                </p>

                                <p>Cordialement,<br>L'équipe El Sayf</p>
                            </div>
                            <div class="footer">
                                <p>© 2026 El Sayf - Plateforme d'apprentissage en ligne</p>
                                <p>${appUrl}</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Email d\'approbation envoyé à:', user.email);
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
            // On continue même si l'email échoue
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: `Accès Python approuvé pour ${user.email}`
        });

    } catch (error) {
        console.error('Error approving Python access:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'approbation' }, { status: 500 });
    }
}
