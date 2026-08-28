import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized - Super Admin only' }, { status: 401 });
        }

        const { name, email, password, role, analyticsAccess, geminiAccess, openaiAccess, affiliateAccess, rStatAccess, pythonAccess } = await request.json();

        // Validation
        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur avec tous les accès
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                emailVerified: new Date(),
                analyticsAccess: analyticsAccess || false,
                geminiAccess: geminiAccess !== false,
                openaiAccess: openaiAccess !== false,
                affiliateAccess: affiliateAccess || false,
                rStatAccess: rStatAccess || false,
                pythonAccess: pythonAccess || false
            }
        });

        // Envoyer un email de bienvenue avec les détails d'accès
        try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elsayf.statlabo.com';

            // Générer la liste des accès
            const accesses = [];
            if (analyticsAccess) accesses.push('✅ Google Analytics');
            if (rStatAccess) accesses.push('✅ R Stat');
            if (pythonAccess) accesses.push('✅ Python');
            if (geminiAccess) accesses.push('✅ Gemini AI');
            if (openaiAccess) accesses.push('✅ OpenAI');
            if (affiliateAccess) accesses.push('✅ Affiliate / Parrainage');

            const accessList = accesses.length > 0 ? accesses.join('\n') : 'Aucun accès spécial';

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
                to: email,
                subject: '🎉 Votre compte El Sayf a été créé',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .access-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
                            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🎉 Bienvenue sur El Sayf !</h1>
                                <p>Votre compte a été créé avec succès</p>
                            </div>
                            <div class="content">
                                <p>Bonjour <strong>${name}</strong>,</p>
                                <p>Votre compte a été créé sur la plateforme El Sayf. Voici vos informations de connexion :</p>

                                <div class="access-box">
                                    <p><strong>📧 Email :</strong> ${email}</p>
                                    <p><strong>🔑 Mot de passe :</strong> ${password}</p>
                                    <p><strong>👤 Rôle :</strong> ${role}</p>
                                </div>

                                <h3>🔐 Vos accès :</h3>
                                <div class="access-box">
                                    <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${accessList}</pre>
                                </div>

                                <div style="text-align: center;">
                                    <a href="${appUrl}/login" class="button">🚀 Se connecter maintenant</a>
                                </div>

                                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                                    ⚠️ <strong>Important :</strong> Nous vous recommandons de changer votre mot de passe lors de votre première connexion.
                                </p>

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
            console.log('Email de bienvenue envoyé à:', email);
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
            // On continue même si l'email échoue
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                analyticsAccess: user.analyticsAccess,
                geminiAccess: user.geminiAccess,
                openaiAccess: user.openaiAccess,
                affiliateAccess: user.affiliateAccess,
                rStatAccess: user.rStatAccess,
                pythonAccess: user.pythonAccess
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
