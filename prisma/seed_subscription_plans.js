const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding subscription plans...');

  // Plan Gratuit avec Ads (Global)
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'free-global-plan' },
    update: {},
    create: {
      id: 'free-global-plan',
      name: 'Gratuit avec Publicités',
      name_ar: 'مجاني مع الإعلانات',
      name_en: 'Free with Ads',
      description: 'Accès limité aux leçons gratuites avec publicités Google Ads',
      description_ar: 'وصول محدود إلى الدروس المجانية مع إعلانات جوجل',
      description_en: 'Limited access to free lessons with Google Ads',
      region: 'GLOBAL',
      price: 0,
      currency: 'EUR',
      duration: 365,
      isActive: true,
      features: JSON.stringify([
        'Accès aux leçons gratuites',
        'Certificat de participation',
        'Support communautaire'
      ])
    }
  });

  console.log('✓ Plan gratuit créé:', freePlan.name);

  // Plan Premium Algérie
  const premiumDZ = await prisma.subscriptionPlan.upsert({
    where: { id: 'premium-algeria' },
    update: {},
    create: {
      id: 'premium-algeria',
      name: 'Premium Algérie',
      name_ar: 'بريميوم الجزائر',
      name_en: 'Premium Algeria',
      description: 'Accès complet à toutes les formations avec support en arabe/français',
      description_ar: 'وصول كامل لجميع الدورات مع الدعم بالعربية/الفرنسية',
      description_en: 'Full access to all courses with Arabic/French support',
      region: 'ALGERIA',
      price: 2500,
      currency: 'DZD',
      duration: 30,
      isActive: true,
      features: JSON.stringify([
        'Accès complet à tous les cours',
        'Sans publicité',
        'Certificat professionnel',
        'Support prioritaire en arabe/français',
        'Accès au forum privé',
        'Paiement via Chargily (CIB, eddahabia)',
        'Mises à jour gratuites'
      ])
    }
  });

  console.log('✓ Plan Premium Algérie créé:', premiumDZ.name);

  // Plan Premium Europe
  const premiumEU = await prisma.subscriptionPlan.upsert({
    where: { id: 'premium-europe' },
    update: {},
    create: {
      id: 'premium-europe',
      name: 'Premium Europe',
      name_ar: 'بريميوم أوروبا',
      name_en: 'Premium Europe',
      description: 'Accès complet avec certification internationale',
      description_ar: 'وصول كامل مع شهادة دولية',
      description_en: 'Full access with international certification',
      region: 'EUROPE',
      price: 19,
      currency: 'EUR',
      duration: 30,
      isActive: true,
      features: JSON.stringify([
        'Accès complet à tous les cours',
        'Sans publicité',
        'Certificat professionnel international',
        'Support prioritaire multilingue',
        'Accès au forum privé',
        'Paiement sécurisé par carte bancaire',
        'Mises à jour gratuites',
        'Accès anticipé aux nouvelles formations'
      ])
    }
  });

  console.log('✓ Plan Premium Europe créé:', premiumEU.name);

  console.log('\n✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
