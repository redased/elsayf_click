const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding R Course...')
    const rStatsCourse = await prisma.course.upsert({
        where: { slug: 'r-statistics-finance' },
        update: {
            title_en: 'R for Statistics & Finance',
            title_ar: 'لغة R للإحصاء والمالية',
            description_en: 'Analyze complex financial data and build predictive models with R.',
            description_ar: 'تحليل البيانات المالية المعقدة وبناء نماذج تنبؤية باستخدام R.',
            price: 0,
            isFree: true,
            isInviteOnly: true,
        },
        create: {
            title: 'R pour Statistiques & Finance',
            title_en: 'R for Statistics & Finance',
            title_ar: 'لغة R للإحصاء والمالية',
            slug: 'r-statistics-finance',
            description: 'Analysez des données financières complexes et créez des modèles prédictifs avec R.',
            description_en: 'Analyze complex financial data and build predictive models with R.',
            description_ar: 'تحليل البيانات المالية المعقدة وبناء نماذج تنبؤية باستخدام R.',
            isInviteOnly: true,
            price: 0,
            isFree: true,
            level: 'Top',
            duration: '12h 00m',
            image: '/images/courses/r-stats.png',
            lessons: {
                create: [
                    {
                        title: 'Introduction à R et RStudio',
                        title_en: 'Introduction to R and RStudio',
                        title_ar: 'مقدمة في R و RStudio',
                        duration: 20,
                        order: 1,
                        content: `
# Introduction à l'analyse financière avec R

Bienvenue dans ce module. Nous allons configurer votre environnement pour le trading algorithmique.

## Installation des packages
\`\`\`r
install.packages(c("quantmod", "xts", "TTR"))
library(quantmod)
\`\`\`

## Récupération des données
Nous allons télécharger les données historiques d'Apple (AAPL) :

\`\`\`r
getSymbols("AAPL", src = "yahoo", from = "2023-01-01")
head(AAPL)
candleChart(AAPL, theme = "white", type = "candles")
\`\`\`

Ce script simple vous permet déjà de visualiser les cours de bourse en chandeliers japonais.
`,

                        content_en: 'Installation and getting started with the R working environment.',
                        content_ar: 'تثبيت وبدء العمل مع بيئة R.',
                    },
                    {
                        title: 'Structures de données en R',
                        title_en: 'Data Structures in R',
                        title_ar: 'هياكل البيانات في R',
                        duration: 35,
                        order: 2,
                        content: 'Vecteurs, Matrices, Listes et Data Frames.',
                        content_en: 'Vectors, Matrices, Lists and Data Frames.',
                        content_ar: 'المتجهات، المصفوفات، القوائم وإطارات البيانات.',
                    },
                    {
                        title: 'Visualisation avec ggplot2',
                        title_en: 'Visualization with ggplot2',
                        title_ar: 'التصور البياني باستخدام ggplot2',
                        duration: 45,
                        order: 3,
                        content: 'Créer des graphiques professionnels pour la finance.',
                        content_en: 'Create professional charts for finance.',
                        content_ar: 'إنشاء رسوم بيانية احترافية للمالية.',
                    },
                    {
                        title: 'Analyse de Séries Temporelles',
                        title_en: 'Time Series Analysis',
                        title_ar: 'تحليل السلاسل الزمنية',
                        duration: 50,
                        order: 4,
                        content: 'Modélisation ARIMA et prévisions boursières.',
                        content_en: 'ARIMA modeling and stock forecasting.',
                        content_ar: 'نمذجة ARIMA والتنبؤات بالأسهم.',
                    }
                ]
            }
        }
    });
    console.log('✅ Cours R Statistics ajouté terminé.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
