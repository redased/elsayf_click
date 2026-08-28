const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupSuperAdmin() {
    try {
        console.log('🔍 Recherche du compte sed.red88@gmail.com...');

        // Rechercher l'utilisateur
        let user = await prisma.user.findUnique({
            where: { email: 'sed.red88@gmail.com' }
        });

        if (!user) {
            console.log('❌ Utilisateur non trouvé. L\'utilisateur doit d\'abord se connecter.');
            console.log('📝 Demande à sed.red88 de se connecter une première fois, puis relance ce script.');
            return;
        }

        console.log('✅ Utilisateur trouvé:', user.email);
        console.log('📋 Rôle actuel:', user.role);

        // Mettre à jour le rôle en SUPER_ADMIN
        user = await prisma.user.update({
            where: { email: 'sed.red88@gmail.com' },
            data: {
                role: 'SUPER_ADMIN'
            }
        });

        console.log('🎉 Compte mis à jour avec succès !');
        console.log('📧 Email:', user.email);
        console.log('👑 Rôle:', user.role);
        console.log('');
        console.log('✨ sed.red88@gmail.com est maintenant SUPER ADMIN');
        console.log('🚀 Il sera redirigé vers /admin après la connexion');

        // Créer les permissions admin si elles n'existent pas
        const existingPermissions = await prisma.adminPermission.findUnique({
            where: { userId: user.id }
        });

        if (!existingPermissions) {
            console.log('🔑 Création des permissions admin...');

            await prisma.adminPermission.create({
                data: {
                    userId: user.id,
                    canUseLinkedInScraper: true,
                    linkedInScrapeLimit: 1000, // Limite élevée pour super admin
                    canViewAllCourses: true,
                    canEditCourses: true,
                    canDeleteCourses: true,
                    canViewAllUsers: true,
                    canEditUsers: true,
                    canDeleteUsers: true,
                    canAssignRoles: true,
                    canViewMarketing: true,
                    canEditCampaigns: true,
                    canManageAffiliates: true,
                    canViewAnalytics: true,
                    canViewRevenue: true,
                    canExportData: true,
                    canViewEmailLogs: true,
                    canSendEmails: true,
                    canViewSettings: true,
                    canEditSettings: true,
                }
            });

            console.log('✅ Permissions admin créées avec tous les accès');
        } else {
            console.log('✅ Permissions admin existent déjà');
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

setupSuperAdmin();
