import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';

/**
 * POST /api/register/python
 * Inscription Python avec champs étendus
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const {
            // Informations personnelles
            firstName,
            lastName,
            email,
            phone,
            
            // Parcours
            educationLevel,
            studyField,
            institution,
            
            // Modules
            modules,
            otherModule,
            
            // Projet
            projectDescription,
            projectType,
            
            // Préférences
            learningMode,
            preferredSchedule
        } = body;

        // Validation des champs obligatoires
        if (!firstName || !lastName || !email || !phone) {
            return NextResponse.json({
                error: 'Les champs nom, prénom, email et téléphone sont obligatoires'
            }, { status: 400 });
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                error: 'Adresse email invalide'
            }, { status: 400 });
        }

        // Validation mode de formation
        if (!learningMode || !['online', 'presentiel'].includes(learningMode)) {
            return NextResponse.json({
                error: 'Veuillez sélectionner un mode de formation (en ligne ou présentiel)'
            }, { status: 400 });
        }

        // Vérifier si une inscription existe déjà avec cet email
        const existingRegistration = await prisma.pythonRegistration.findFirst({
            where: { email }
        });

        if (existingRegistration) {
            return NextResponse.json({
                error: 'Une inscription avec cet email existe déjà'
            }, { status: 409 });
        }

        // Vérifier le cookie de parrainage
        const cookieStore = cookies();
        const refCode = cookieStore.get('ref_code')?.value;

        // Récupérer les infos du navigateur
        const headersList = headers();
        const userAgent = headersList.get('user-agent') || '';
        const ipAddress = headersList.get('x-forwarded-for') || 
                         headersList.get('x-real-ip') || 
                         'unknown';

        // Créer l'inscription
        const registration = await prisma.pythonRegistration.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                educationLevel: educationLevel || null,
                studyField: studyField || null,
                institution: institution || null,
                modules: modules ? JSON.stringify(modules) : null,
                otherModule: otherModule || null,
                projectDescription: projectDescription || null,
                projectType: projectType || null,
                learningMode,
                preferredSchedule: preferredSchedule || null,
                affiliateCode: refCode || null,
                ipAddress: ipAddress.split(',')[0].trim(),
                userAgent,
                status: 'PENDING'
            }
        });

        // Mettre à jour le compteur de parrainage si applicable
        if (refCode) {
            try {
                const link = await prisma.affiliateLink.findUnique({ 
                    where: { code: refCode } 
                });
                if (link) {
                    await prisma.affiliateLink.update({
                        where: { code: refCode },
                        data: { registrations: { increment: 1 } }
                    });
                }
            } catch (affError) {
                console.error('Error updating affiliate:', affError);
                // Continue même si le parrainage échoue
            }
        }

        // Envoyer un email de confirmation
        try {
            await sendConfirmationEmail({
                firstName,
                lastName,
                email,
                phone,
                educationLevel,
                studyField,
                modules,
                otherModule,
                projectDescription,
                projectType,
                learningMode,
                preferredSchedule
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Continue même si l'email échoue
        }

        // Notifier les admins
        try {
            await notifyAdmins({
                firstName,
                lastName,
                email,
                learningMode
            });
        } catch (notifError) {
            console.error('Error notifying admins:', notifError);
        }

        return NextResponse.json({
            success: true,
            message: 'Inscription réussie',
            registration: {
                id: registration.id,
                firstName: registration.firstName,
                lastName: registration.lastName,
                email: registration.email
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Python Registration Error:', error);
        return NextResponse.json({
            error: 'Erreur du serveur',
            details: error.message
        }, { status: 500 });
    }
}

/**
 * Envoyer l'email de confirmation au candidat
 */
async function sendConfirmationEmail(data) {
    const {
        firstName,
        lastName,
        email,
        phone,
        educationLevel,
        studyField,
        modules,
        otherModule,
        projectDescription,
        projectType,
        learningMode,
        preferredSchedule
    } = data;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elsayf.statlabo.com';

    // Préparer la liste des modules
    const moduleNames = {
        excel: '📊 Excel',
        word: '📝 Word',
        powerpoint: '📽️ PowerPoint',
        email: '📧 Email Marketing',
        automatisation: '🤖 Automatisation',
        data_analysis: '📈 Analyse de données',
        web_scraping: '🌐 Web Scraping',
        dashboards: '📊 Tableaux de bord',
        api: '🔗 API & Intégration',
        database: '🗄️ Bases de données',
        ai_ml: '🧠 IA & Machine Learning',
        reporting: '📄 Rapports auto'
    };

    const modulesList = modules || [];
    const modulesText = modulesList.length > 0
        ? modulesList.map(m => moduleNames[m] || m).join('\n')
        : 'Aucun module spécifié';

    const modeText = learningMode === 'online' ? '🖥️ En ligne' : '🏫 Présentiel';
    
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
        subject: '🐍 Confirmation inscription - Formation Python',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
                    .modules-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; border-radius: 5px; }
                    .project-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; border-radius: 5px; }
                    .mode-badge { display: inline-block; padding: 8px 16px; background: ${learningMode === 'online' ? '#3b82f6' : '#10b981'}; color: white; border-radius: 20px; font-weight: bold; }
                    .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🐍 Bienvenue sur El Sayf !</h1>
                        <p>Votre inscription Python a été enregistrée</p>
                    </div>
                    <div class="content">
                        <p>Bonjour <strong>${firstName}</strong>,</p>
                        <p>Merci pour votre inscription à notre formation Python ! Nous avons bien reçu votre candidature.</p>

                        <div class="info-box">
                            <h3>👤 Vos informations</h3>
                            <p><strong>Nom :</strong> ${firstName} ${lastName}</p>
                            <p><strong>Email :</strong> ${email}</p>
                            <p><strong>Téléphone :</strong> ${phone}</p>
                            ${educationLevel ? `<p><strong>Niveau :</strong> ${educationLevel}</p>` : ''}
                            ${studyField ? `<p><strong>Filière :</strong> ${studyField}</p>` : ''}
                        </div>

                        <div style="text-align: center; margin: 20px 0;">
                            <span class="mode-badge">${modeText}</span>
                        </div>

                        ${modulesList.length > 0 ? `
                        <div class="modules-box">
                            <h3>📚 Modules sélectionnés</h3>
                            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${modulesText}</pre>
                        </div>
                        ` : ''}

                        ${otherModule ? `
                        <div class="info-box">
                            <p><strong>➕ Autre besoin :</strong> ${otherModule}</p>
                        </div>
                        ` : ''}

                        ${projectDescription ? `
                        <div class="project-box">
                            <h3>🎯 Votre projet</h3>
                            <p><strong>Type :</strong> ${projectType || 'Non spécifié'}</p>
                            <p>${projectDescription}</p>
                        </div>
                        ` : ''}

                        <div style="text-align: center;">
                            <a href="${appUrl}/login" class="button">🚀 Accéder à la plateforme</a>
                        </div>

                        <p style="margin-top: 20px;">
                            <strong>Prochaines étapes :</strong>
                        </p>
                        <ul>
                            <li>Notre équipe va examiner votre candidature</li>
                            <li>Vous serez contacté sous 24-48h pour finaliser votre inscription</li>
                            <li>Un compte sera créé pour vous sur la plateforme</li>
                        </ul>

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
    console.log('Confirmation email sent to:', email);
}

/**
 * Notifier les admins d'une nouvelle inscription
 */
async function notifyAdmins(data) {
    const { firstName, lastName, email, learningMode } = data;
    
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const adminMailOptions = {
        from: process.env.EMAIL_FROM || `"El Sayf" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `🎓 Nouvelle inscription Python - ${firstName} ${lastName}`,
        html: `
            <h2>Nouvelle inscription formation Python</h2>
            <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mode:</strong> ${learningMode === 'online' ? 'En ligne' : 'Présentiel'}</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/python-registrations">
                Voir les inscriptions
            </a></p>
        `
    };

    await transporter.sendMail(adminMailOptions);
}

/**
 * GET /api/register/python
 * Statistiques d'inscriptions Python (admin only)
 */
export async function GET(request) {
    try {
        // Vérifier l'authentification (optionnel pour les stats publiques basiques)
        // Pour les stats détaillées, utiliser /api/admin/python-registrations ou /api/super-admin/python-stats
        
        const stats = await prisma.pythonRegistration.groupBy({
            by: ['status'],
            _count: true
        });

        const modeStats = await prisma.pythonRegistration.groupBy({
            by: ['learningMode'],
            _count: true
        });

        const totalCount = await prisma.pythonRegistration.count();

        return NextResponse.json({
            total: totalCount,
            byStatus: stats,
            byMode: modeStats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({
            error: 'Error fetching statistics'
        }, { status: 500 });
    }
}
