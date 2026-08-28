require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Mise à jour et nettoyage des Terminaux Réels Interactifs (RealTerminalPlayground)...')

    // =========================================================================
    // FORMATION 1 : Defensive Security & SOC
    // =========================================================================
    const slug1 = 'cybersecurite-protection-systemes-defensive'
    const course1 = await prisma.course.findUnique({ where: { slug: slug1 } })

    if (course1) {
        const lessons1 = await prisma.lesson.findMany({
            where: { courseId: course1.id },
            orderBy: { order: 'asc' }
        })

        console.log(`\n📚 Traitement de la Formation 1 : "${course1.title}" (${lessons1.length} leçons)...`)

        for (const lesson of lessons1) {
            let content = lesson.content || ''
            
            // Nettoyer tout ancien bloc realterminal
            if (content.includes('## ⚡ Terminal Réel d\'Entraînement')) {
                content = content.split('## ⚡ Terminal Réel d\'Entraînement')[0].trim()
            } else if (content.includes('```realterminal')) {
                content = content.split('```realterminal')[0].trim()
            }

            const cleanTitle = lesson.title.replace(/"/g, "'").replace(/\\/g, "/")

            const realTerminalBlock = `

---

## ⚡ Terminal Réel d'Entraînement (Pratique Immédiate)

Utilisez le terminal ci-dessous pour tester directement vos propres commandes. Vous pouvez taper au clavier ou utiliser les boutons **"👉 TESTER"** dans le panneau de droite :

\`\`\`realterminal
{
  "title": "Terminal Réel de Pratique — Leçon ${lesson.order}",
  "os": "powershell",
  "guides": [
    {
      "cmd": "Get-ComputerInfo",
      "desc": "Inspecter les informations et métadonnées du système d'exploitation."
    },
    {
      "cmd": "Get-FileHash -Algorithm SHA256 C:/Windows/System32/cmd.exe",
      "desc": "Calculer l'empreinte SHA-256 du binaire pour vérifier son intégrité."
    },
    {
      "cmd": "Get-Service WinDefend, wuauserv",
      "desc": "Vérifier l'état des services de protection et de mise à jour Windows."
    },
    {
      "cmd": "Get-WinEvent -FilterHashtable @{LogName='Security';ID=4625} -MaxEvents 3",
      "desc": "Auditer les journaux d'échecs de connexion (Event ID 4625)."
    },
    {
      "cmd": "help",
      "desc": "Afficher la liste de toutes les commandes disponibles dans la Sandbox."
    }
  ]
}
\`\`\`
`
            content += realTerminalBlock
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { content }
            })
            console.log(`  ✅ Leçon ${lesson.order} ré-équipée du Terminal Réel !`)
        }
    }

    // =========================================================================
    // FORMATION 2 : Ethical Hacking & Pentest Web
    // =========================================================================
    const slug2 = 'ethical-hacking-securite-web-pentest'
    const course2 = await prisma.course.findUnique({ where: { slug: slug2 } })

    if (course2) {
        const lessons2 = await prisma.lesson.findMany({
            where: { courseId: course2.id },
            orderBy: { order: 'asc' }
        })

        console.log(`\n📚 Traitement de la Formation 2 : "${course2.title}" (${lessons2.length} leçons)...`)

        for (const lesson of lessons2) {
            let content = lesson.content || ''

            if (content.includes('## ⚡ Terminal Réel d\'Entraînement')) {
                content = content.split('## ⚡ Terminal Réel d\'Entraînement')[0].trim()
            } else if (content.includes('```realterminal')) {
                content = content.split('```realterminal')[0].trim()
            }

            const realTerminalBlock = `

---

## ⚡ Terminal Réel d'Entraînement (Pratique Immédiate)

Utilisez le terminal ci-dessous pour exécuter directement vos commandes d'audit. Utilisez le panneau de droite **"💡 Ce qu'il faut tester"** pour lancer les tests en un clic :

\`\`\`realterminal
{
  "title": "Terminal Réel de Pentest — Leçon ${lesson.order}",
  "os": "powershell",
  "guides": [
    {
      "cmd": "ping 192.168.1.50",
      "desc": "Tester la joignabilité et le TTL du serveur cible."
    },
    {
      "cmd": "nmap -sS -p 22,80,443,3306 192.168.1.50",
      "desc": "Scanner les ports ouverts et les services actifs."
    },
    {
      "cmd": "gobuster dir -u http://192.168.1.50/ -w common.txt",
      "desc": "Fuzzer et découvrir les répertoires secrets du serveur web."
    },
    {
      "cmd": "python sqlmap.py -u 'http://target.elsayf.local/search.php?id=1' --dbs",
      "desc": "Tester la présence de vulnérabilités d'injection SQL."
    },
    {
      "cmd": "whoami /priv",
      "desc": "Vérifier les privilèges système de l'utilisateur."
    }
  ]
}
\`\`\`
`
            content += realTerminalBlock
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { content }
            })
            console.log(`  ✅ Leçon ${lesson.order} ré-équipée du Terminal Réel !`)
        }
    }

    console.log('\n🎉 TOUTES les 16 leçons ont été ré-équipées proprement avec des Terminaux Réels et leurs boutons !')
}

main()
    .catch(e => {
        console.error('❌ Erreur :', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
