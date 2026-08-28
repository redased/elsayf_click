const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Adding TP references to Google Sheets Course lessons...')

    // Récupérer le cours
    const course = await prisma.course.findUnique({
        where: { slug: 'python-google-sheets-automation' },
        include: { lessons: true }
    })

    if (!course) {
        console.error('Course not found!')
        return
    }

    console.log(`Found course: ${course.title}`)
    console.log(`Adding TP references to ${course.lessons.length} lessons...`)

    // Ajouter une section TP à la fin de chaque leçon
    let updatedCount = 0

    for (const lesson of course.lessons) {
        // Créer le contenu TP à ajouter
        const tpSection = `

---

## 📝 TP Pratique

### À faire après cette leçon

Un travail pratique vous est proposé pour mettre en application les concepts appris.

**Fichiers disponibles:**
- 📁 [Accéder au dossier des TP](/tps-google-sheets/)
- 📖 [README - Guide complet des TP](/tps-google-sheets/README.md)
- 📦 [requirements.txt](/tps-google-sheets/requirements.txt) - Dépendances Python

### Comment réaliser ce TP ?

1. **Télécharger le fichier TP** correspondant à cette leçon
2. **Installer les dépendances** si nécessaire:
   \`\`\`bash
   pip install -r /tps-google-sheets/requirements.txt
   \`\`\`
3. **Configurer votre clé API Google Sheets** via le Super Admin
4. **Exécuter le TP** et suivre les instructions

### Validation

Une fois le TP terminé:
- ✅ Le script s'exécute sans erreur
- ✅ Les résultats sont visibles dans Google Sheets
- ✅ Vous comprenez le code et pouvez le modifier

### Besoin d'aide ?

- Consultez le README des TP pour le dépannage
- Posez vos questions sur le Discord
- Revoyez la leçon si nécessaire

---

**Note:** Les TP sont conçus pour être réalisés après avoir vu la leçon. Prenez votre temps pour comprendre chaque concept avant de passer au TP.
`

        // Mettre à jour la leçon
        try {
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: {
                    content: lesson.content + tpSection,
                    content_en: lesson.content_en + tpSection.replace(/Comment réaliser/g, 'How to complete').replace(/Besoin d'aide/g, 'Need help'),
                    content_ar: lesson.content_ar + tpSection
                }
            })
            updatedCount++
            console.log(`✅ Updated: ${lesson.title}`)
        } catch (error) {
            console.error(`❌ Error updating ${lesson.title}: ${error.message}`)
        }
    }

    console.log(`\n📚 Summary:`)
    console.log(`   - Updated ${updatedCount} lessons with TP references`)
    console.log(`   - Total lessons: ${course.lessons.length}`)
    console.log(`\n🔗 Resources created:`)
    console.log(`   - /tps-google-sheets/ folder`)
    console.log(`   - /tps-google-sheets/README.md`)
    console.log(`   - /tps-google-sheets/requirements.txt`)
    console.log(`   - Sample TP files (TP01_Connexion.py, TP04_CRUD_Complets.py)`)
    console.log(`\n📝 Next steps:`)
    console.log(`   1. Create more TP files as needed`)
    console.log(`   2. Add your Google API key via Super Admin`)
    console.log(`   3. Students can now access TPs from each lesson`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
