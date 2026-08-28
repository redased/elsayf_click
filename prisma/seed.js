const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // --- 1. Facultés Algériennes ---
    const facultiesData = [
        { name: 'Université des Sciences et de la Technologie Houari Boumediene', shortName: 'USTHB', city: 'Alger' },
        { name: 'Université d\'Alger 1 - Benyoucef Benkhedda', shortName: 'Alger 1', city: 'Alger' },
        { name: 'Université d\'Alger 2 - Abou El Kacem Saâdallah', shortName: 'Alger 2', city: 'Alger' },
        { name: 'Université d\'Alger 3 - Brahim Soltane Chaibout', shortName: 'Alger 3', city: 'Alger' },
        { name: 'École Nationale Supérieure d\'Informatique', shortName: 'ESI (ex-INI)', city: 'Alger' },
        { name: 'École Nationale Polytechnique', shortName: 'ENP', city: 'Alger' },
        { name: 'Université M\'Hamed Bougara de Boumerdès', shortName: 'UMBB', city: 'Boumerdès' },
        { name: 'Université de Blida 1', shortName: 'Blida 1', city: 'Blida' },
        { name: 'Université de Tizi Ouzou', shortName: 'UMMTO', city: 'Tizi Ouzou' },
        { name: 'Université de Béjaïa', shortName: 'Univ Béjaïa', city: 'Béjaïa' },
        { name: 'Université d\'Oran 1 - Ahmed Ben Bella', shortName: 'Oran 1', city: 'Oran' },
        { name: 'Université des Sciences et de la Technologie d\'Oran', shortName: 'USTO', city: 'Oran' },
        { name: 'Université de Constantine 1 - Frères Mentouri', shortName: 'Constantine 1', city: 'Constantine' },
        { name: 'Université de Constantine 2 - Abdelhamid Mehri', shortName: 'Constantine 2', city: 'Constantine' },
        { name: 'Université de Sétif 1 - Ferhat Abbas', shortName: 'Sétif 1', city: 'Sétif' },
        { name: 'Université Badji Mokhtar d\'Annaba', shortName: 'UBMA', city: 'Annaba' },
        { name: 'Université Kasdi Merbah de Ouargla', shortName: 'UKMO', city: 'Ouargla' },
        { name: 'Université Abou Bekr Belkaïd', shortName: 'Tlemcen', city: 'Tlemcen' },
    ]

    for (const fac of facultiesData) {
        await prisma.faculty.upsert({
            where: { name: fac.name },
            update: {},
            create: fac,
        })
    }
    console.log('✅ Facultés ajoutées.')

    // --- 2. Channels Forum (Discord-like) ---
    const channelsData = [
        { name: 'annonces', description: 'Annonces officielles', type: 'text', category: 'INFO', icon: '📢', position: 0 },
        { name: 'général', description: 'Discussions générales', type: 'text', category: 'GÉNÉRAL', icon: '💬', position: 1 },
        { name: 'présentations', description: 'Présentez-vous ici', type: 'text', category: 'GÉNÉRAL', icon: '👋', position: 2 },

        { name: 'python-help', description: 'Entraide Python', type: 'text', category: 'DEV', icon: '🐍', position: 3 },
        { name: 'javascript-help', description: 'Entraide JS/React/Next', type: 'text', category: 'DEV', icon: '📜', position: 4 },
        { name: 'ia-machine-learning', description: 'Discussions sur l\'IA', type: 'text', category: 'DEV', icon: '🤖', position: 5 },

        { name: 'offres-stage', description: 'Offres de stages et emplois', type: 'text', category: 'CARRIÈRE', icon: '💼', position: 6 },

        { name: 'Cafétéria', description: 'Vocal - Discussion libre', type: 'voice', category: 'VOCAL', icon: '🔊', position: 7 },
    ]

    for (const channel of channelsData) {
        // On utilise findFirst car name n'est pas unique dans le schema @unique globalement (si modif schema necessaire on fera)
        // Ici on va juste createMany ou upsert par name si possible. 
        // Pour simplifier, on check si existe.
        const exists = await prisma.channel.findFirst({ where: { name: channel.name } })
        if (!exists) {
            await prisma.channel.create({ data: channel })
        }
    }
    console.log('✅ Channels forum ajoutés.')

    // --- 3. Cours et Leçons ---
    const rStatsCourse = await prisma.course.upsert({
        where: { slug: 'r-statistics-finance' },
        update: {
            title: 'R pour Statistiques & Finance',
            title_en: 'R for Statistics & Finance',
            title_ar: 'لغة R للإحصاء والمالية',
            description: 'Analysez des données financières complexes et créez des modèles prédictifs avec R.',
            description_en: 'Analyze complex financial data and build predictive models with R.',
            description_ar: 'تحليل البيانات المالية المعقدة وبناء نماذج تنبؤية باستخدام R.',
        },
        create: {
            title: 'R pour Statistiques & Finance',
            title: 'R pour Statistiques & Finance',
            title_en: 'R for Statistics & Finance',
            title_ar: 'لغة R للإحصاء والمالية',
            slug: 'r-statistics-finance',
            description: 'Analysez des données financières complexes et créez des modèles prédictifs avec R.',
            description: 'Analysez des données financières complexes et créez des modèles prédictifs avec R.',
            description_en: 'Analyze complex financial data and build predictive models with R.',
            description_ar: 'تحليل البيانات المالية المعقدة وبناء نماذج تنبؤية باستخدام R.',
            price: 59.99,
            level: 'Intermédiaire',
            duration: '12h 00m',
            image: '/images/courses/r-stats.png',
            lessons: {
                create: [
                    {
                        title: 'Introduction à R et RStudio',
                        title: 'Introduction à R et RStudio',
                        title_en: 'Introduction to R and RStudio',
                        title_ar: 'مقدمة في R و RStudio',
                        duration: 20,
                        order: 1,
                        content: 'Installation et prise en main de l\'environnement de travail R.',
                        content: 'Installation et prise en main de l\'environnement de travail R.',
                        content_en: 'Installation and getting started with the R working environment.',
                        content_ar: 'تثبيت وبدء العمل مع بيئة R.',
                    },
                    {
                        title: 'Structures de données en R',
                        title: 'Structures de données en R',
                        title_en: 'Data Structures in R',
                        title_ar: 'هياكل البيانات في R',
                        duration: 35,
                        order: 2,
                        content: 'Vecteurs, Matrices, Listes et Data Frames.',
                        content: 'Vecteurs, Matrices, Listes et Data Frames.',
                        content_en: 'Vectors, Matrices, Lists and Data Frames.',
                        content_ar: 'المتجهات، المصفوفات، القوائم وإطارات البيانات.',
                    },
                    {
                        title: 'Visualisation avec ggplot2',
                        title: 'Visualisation avec ggplot2',
                        title_en: 'Visualization with ggplot2',
                        title_ar: 'التصور البياني باستخدام ggplot2',
                        duration: 45,
                        order: 3,
                        content: 'Créer des graphiques professionnels pour la finance.',
                        content: 'Créer des graphiques professionnels pour la finance.',
                        content_en: 'Create professional charts for finance.',
                        content_ar: 'إنشاء رسوم بيانية احترافية للمالية.',
                    },
                    {
                        title: 'Analyse de Séries Temporelles',
                        title: 'Analyse de Séries Temporelles',
                        title_en: 'Time Series Analysis',
                        title_ar: 'تحليل السلاسل الزمنية',
                        duration: 50,
                        order: 4,
                        content: 'Modélisation ARIMA et prévisions boursières.',
                        content: 'Modélisation ARIMA et prévisions boursières.',
                        content_en: 'ARIMA modeling and stock forecasting.',
                        content_ar: 'نمذجة ARIMA والتنبؤات بالأسهم.',
                    }
                ]
            }
        }
    });
    console.log('✅ Cours R Statistics ajouté.');

    // --- 4. Paramètres admin par défaut (si nécessaire) ---
    const settings = await prisma.settings.findFirst()
    if (!settings) {
        await prisma.settings.create({
            data: {
                aiProvider: 'gemini',
            }
        })
        console.log('✅ Paramètres par défaut créés.')
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
