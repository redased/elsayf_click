'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal as TerminalIcon, Play, Copy, Check, Info, Lightbulb, Zap, Shield, HelpCircle, ChevronRight, RotateCcw } from 'lucide-react';

// Shell virtuel réaliste avec réponses simulées pour les commandes cybersécurité
function runVirtualCommand(cmd, os = 'powershell') {
    const cleanCmd = cmd ? cmd.trim() : '';
    if (!cleanCmd) return { output: '', error: false };

    const lower = cleanCmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
        return { output: '__CLEAR__', error: false };
    }

    if (lower === 'help' || lower === 'get-help') {
        return {
            output: `💡 COMMANDES RECOMMANDÉES À TESTER :
  - ping <host>                         : Test d'accessibilité réseau
  - sha256sum / Get-FileHash <file>     : Audit d'intégrité de fichier
  - nmap -sS -p 80,443 <target>         : Cartographie et scan de ports
  - sqlmap -u <url> --dbs               : Test d'injection SQL
  - openssl genrsa -out key.pem 2048    : Génération de clé RSA
  - netsh advfirewall show allprofiles  : Inspection du pare-feu Windows
  - Get-WinEvent -LogName Security      : Audit des logs d'événements
  - yara64 -r rules.yar <dir>           : Scan de détection de malware YARA
  - docker run --read-only <image>      : Lancement de conteneur sécurisé
  - whoami /priv                        : Audit des privilèges utilisateur
  - clear / cls                         : Effacer l'écran`,
            error: false
        };
    }

    // SHA256 / Get-FileHash
    if (lower.includes('get-filehash') || lower.includes('sha256sum') || lower.includes('certutil')) {
        return {
            output: `Algorithm : SHA256\nHash      : 660A900A9F9E2A895A231C925A1A8D49E8C76D229EBB05E857C12F21950A9467\nPath      : C:\\Windows\\System32\\cmd.exe\nStatus    : ✅ INTEGRE (Aucune altération détectée)`,
            error: false
        };
    }

    // Ping
    if (lower.startsWith('ping')) {
        const target = cleanCmd.split(' ')[1] || '192.168.1.50';
        return {
            output: `Pinging ${target} with 32 bytes of data:\nReply from ${target}: bytes=32 time=1ms TTL=64\nReply from ${target}: bytes=32 time=1ms TTL=64\nReply from ${target}: bytes=32 time=1ms TTL=64\n\nPing statistics for ${target}:\n    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)`,
            error: false
        };
    }

    // Nmap
    if (lower.startsWith('nmap')) {
        return {
            output: `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for target.elsayf.local (192.168.1.50)\nHost is up (0.0012s latency).\nPORT     STATE SERVICE       VERSION\n22/tcp   open  ssh           OpenSSH 8.9p1 Ubuntu\n80/tcp   open  http          Apache httpd 2.4.52\n443/tcp  open  ssl/https     nginx 1.18.0\n3306/tcp open  mysql         MySQL 8.0.32\n\nNmap done: 1 IP address (1 host up) scanned in 0.85 seconds`,
            error: false
        };
    }

    // SQLMap
    if (lower.startsWith('sqlmap') || lower.includes('sqlmap')) {
        return {
            output: `[+] Testing connection to target URL...\n[+] GET parameter 'id' is vulnerable to Boolean-based blind & UNION query SQLi.\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] elsayf_db\n\nDump table admin_users:\n+----+-------------------+----------------------------------+\n| id | email             | password_hash                    |\n+----+-------------------+----------------------------------+\n| 1  | admin@elsayf.click| $2b$12$e8ZbJ2... (bcrypt hash)   |\n+----+-------------------+----------------------------------+`,
            error: false
        };
    }

    // Gobuster / Fuzzing
    if (lower.startsWith('gobuster') || lower.startsWith('ffuf')) {
        return {
            output: `===================================================\nGobuster v3.6 - Directory Fuzzing\n===================================================\n/admin                (Status: 301) [Size: 315]\n/config.php           (Status: 200) [Size: 0]\n/db_backup.sql        (Status: 200) [Size: 145200] 🚨 DUMP ACCESSIBLE !\n/uploads              (Status: 301) [Size: 316]\n===================================================`,
            error: false
        };
    }

    // OpenSSL
    if (lower.startsWith('openssl')) {
        return {
            output: `Generating RSA private key, 2048 bit long modulus (2 primes)\n....................................................+++++\ne is 65537 (0x10001)\n✅ Key file generated: server.key\n✅ Certificate Signing Request generated: server.csr`,
            error: false
        };
    }

    // Netsh / Firewall
    if (lower.startsWith('netsh') || lower.includes('netfirewall')) {
        return {
            output: `Ok.\nSUCCESS: Profils du pare-feu Windows Defender configurés.\nRule 'Block-SMB-445-Inbound' added successfully. Action: Block.`,
            error: false
        };
    }

    // Get-WinEvent / Logs
    if (lower.includes('winevent') || lower.includes('eventlog')) {
        return {
            output: `TimeCreated          ID Message\n-----------          -- ------\n2026-07-27 01:14:02 4625 An account failed to log on. Account: admin, Source IP: 185.220.101.4\n2026-07-27 01:14:00 4625 An account failed to log on. Account: root, Source IP: 185.220.101.4\n🚨 2 échecs de connexion détectés (Event ID 4625)`,
            error: false
        };
    }

    // YARA
    if (lower.includes('yara')) {
        return {
            output: `[MATCH] Detect_PHP_Webshell C:\\inetpub\\wwwroot\\uploads\\cmd.php\n🚨 ALERTE FORENSICS: Webshell malveillant détecté dans /uploads/cmd.php !`,
            error: false
        };
    }

    // Docker
    if (lower.startsWith('docker')) {
        return {
            output: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n✅ Conteneur démarre en mode Read-Only avec privilèges restreints.`,
            error: false
        };
    }

    // Whoami
    if (lower.startsWith('whoami')) {
        return {
            output: `USER INFORMATION\n----------------\nUser Name: ELSAYF-SEC\\Student\n\nPRIVILEGES INFORMATION\n----------------------\nSeChangeNotifyPrivilege       Bypass traverse checking             Enabled\nSeImpersonatePrivilege        Impersonate a client after auth      Enabled 🚨 PrivEsc Risk!`,
            error: false
        };
    }

    // Get-Service / Get-LocalUser
    if (lower.startsWith('get-service') || lower.startsWith('get-localuser')) {
        return {
            output: `Name          Enabled LastLogin\n----          ------- ---------\nAdministrator False   2026-07-20 10:15:00\nGuest         False   Never\nSecStudent    True    2026-07-27 02:00:00\n\nStatus   Name        DisplayName\n------   ----        -----------\nRunning  WinDefend   Windows Defender Antivirus Service\nRunning  WazuhSvc    Wazuh Agent`,
            error: false
        };
    }

    // Default execution
    return {
        output: `[System Shell]: Commande exécutée avec succès.\nCommand: "${cleanCmd}"\nResponse: OK (0)`,
        error: false
    };
}

function parsePlaygroundConfig(config) {
    if (!config) return null;
    if (typeof config === 'object') return config;

    try {
        return JSON.parse(config);
    } catch (e1) {
        try {
            // Nettoyer les anti-slashs simples des chemins Windows (ex: C:\Windows -> C:\\Windows)
            const cleaned = config.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
            return JSON.parse(cleaned);
        } catch (e2) {
            try {
                const fn = new Function(`return (${config})`);
                return fn();
            } catch (e3) {
                return null;
            }
        }
    }
}

const DEFAULT_GUIDES = [
    { cmd: 'ping 192.168.1.50', desc: 'Tester l\'accessibilité du serveur cible' },
    { cmd: 'nmap -sS -p 80,443 192.168.1.50', desc: 'Scanner les ports et services ouverts' },
    { cmd: 'Get-FileHash C:\\Windows\\System32\\cmd.exe', desc: 'Vérifier l\'empreinte SHA-256 d\'un binaire' },
    { cmd: 'whoami /priv', desc: 'Auditer les privilèges de l\'utilisateur actuel' },
    { cmd: 'help', desc: 'Afficher la liste de toutes les commandes disponibles' }
];

export default function RealTerminalPlayground({ config }) {
    let parsed = parsePlaygroundConfig(config) || {};

    const title = parsed.title || 'Terminal Réel d\'Entraînement';
    const os = parsed.os || 'powershell';

    // Normalisation des guides (g.cmd ou g.command)
    let rawGuides = Array.isArray(parsed.guides) && parsed.guides.length > 0 ? parsed.guides : DEFAULT_GUIDES;
    const guides = rawGuides.map(g => ({
        cmd: g.cmd || g.command || 'help',
        desc: g.desc || g.description || g.explanation || 'Commande à tester'
    }));

    const promptText = os === 'powershell' ? 'PS C:\\Security>' : os === 'windows' ? 'C:\\Users\\Student>' : 'student@elsayf:~$';

    const [history, setHistory] = useState([
        { type: 'sys', text: `🖥️ ${title} — Terminal Interactif Réel` },
        { type: 'sys', text: `Cliquez sur les boutons "👉 TESTER LA COMMANDE" à droite ou tapez directement ci-dessous.` }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [testedCmds, setTestedCmds] = useState([]);

    const terminalEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll à la fin du terminal
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Exécuter une commande
    const handleExecute = (cmdToRun) => {
        const cmd = cmdToRun !== undefined ? cmdToRun : inputVal;
        if (!cmd || !cmd.trim()) return;

        const cleanCmd = cmd.trim();
        const res = runVirtualCommand(cleanCmd, os);

        if (res.output === '__CLEAR__') {
            setHistory([]);
        } else {
            setHistory(prev => [
                ...prev,
                { type: 'cmd', text: cleanCmd, prompt: promptText },
                { type: res.error ? 'err' : 'out', text: res.output }
            ]);
        }

        setCommandHistory(prev => [...prev, cleanCmd]);
        setHistoryIndex(-1);
        setInputVal('');

        // Marquer comme testée dans le guide
        if (!testedCmds.includes(cleanCmd)) {
            setTestedCmds(prev => [...prev, cleanCmd]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleExecute();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIdx = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIdx);
                setInputVal(commandHistory[commandHistory.length - 1 - newIdx] || '');
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIdx = historyIndex - 1;
                setHistoryIndex(newIdx);
                setInputVal(commandHistory[commandHistory.length - 1 - newIdx] || '');
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInputVal('');
            }
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="my-8 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-[#090d16]">
            {/* ── Header du composant ── */}
            <div className="bg-[#121824] border-b border-gray-800 px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                        <TerminalIcon size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white m-0 flex items-center gap-2">
                            {title}
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full uppercase font-mono font-bold tracking-wider">
                                Terminal Réel & Interactif
                            </span>
                        </h4>
                        <p className="text-[11px] text-gray-400 m-0">Tapez directement au clavier ou cliquez sur les boutons de test à droite 👉</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setHistory([])}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1.5 transition-all"
                    >
                        <RotateCcw size={12} /> Clear
                    </button>
                </div>
            </div>

            {/* ── Contenu principal en 2 colonnes ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
                
                {/* ── Colonne Gauche : TERMINAL INTERACTIF (7 colonnes) ── */}
                <div
                    className="lg:col-span-7 bg-[#0c1017] p-4 font-mono text-xs sm:text-sm flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-800 cursor-text"
                    onClick={() => inputRef.current?.focus()}
                >
                    <div className="overflow-y-auto max-h-[380px] space-y-2 pr-1">
                        {history.map((item, idx) => (
                            <div key={idx}>
                                {item.type === 'sys' && (
                                    <div className="text-cyan-400 text-xs py-0.5 font-semibold">
                                        {item.text}
                                    </div>
                                )}
                                {item.type === 'cmd' && (
                                    <div className="flex items-center gap-1.5 text-gray-200 mt-2">
                                        <span className="text-yellow-400 font-bold">{item.prompt}</span>
                                        <span className="text-emerald-300 font-bold">{item.text}</span>
                                    </div>
                                )}
                                {item.type === 'out' && (
                                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-lg border border-white/10 mt-1 text-xs font-mono">
                                        {item.text}
                                    </div>
                                )}
                                {item.type === 'err' && (
                                    <div className="text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 text-xs mt-1">
                                        {item.text}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={terminalEndRef} />
                    </div>

                    {/* Ligne de frappe */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-800/80 mt-3">
                        <span className="text-yellow-400 font-bold shrink-0">{promptText}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Entrez une commande (ex: help)..."
                            className="flex-1 bg-transparent text-emerald-300 outline-none border-none font-mono text-xs sm:text-sm placeholder-gray-600 focus:ring-0"
                            autoFocus
                        />
                        <button
                            onClick={() => handleExecute()}
                            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-cyan-600/30"
                        >
                            <Play size={12} /> Entrée
                        </button>
                    </div>
                </div>

                {/* ── Colonne Droite : PANNEAU EXPLICATIONS & BOUTONS DE TEST (5 colonnes) ── */}
                <div className="lg:col-span-5 bg-[#0f1420] p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <Lightbulb size={18} className="text-yellow-400" />
                                <h5 className="text-xs font-bold text-white m-0 uppercase tracking-wider">
                                    💡 Ce qu'il faut tester
                                </h5>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                                {testedCmds.length}/{guides.length} fait(s)
                            </span>
                        </div>

                        <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                            {guides.map((g, idx) => {
                                const isTested = testedCmds.includes(g.cmd);
                                return (
                                    <div
                                        key={idx}
                                        className={`p-3.5 rounded-xl border transition-all ${isTested ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-white/5 border-white/10 hover:border-cyan-500/40'}`}
                                    >
                                        <p className="text-xs text-gray-300 font-medium mb-2 leading-relaxed flex items-center gap-1.5">
                                            <span className="text-cyan-400 font-bold">#{idx + 1}</span> {g.desc}
                                        </p>

                                        <div className="flex items-center justify-between gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
                                            <code className="text-[11px] font-mono text-cyan-300 font-bold break-all">
                                                {g.cmd}
                                            </code>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => copyToClipboard(g.cmd, idx)}
                                                    className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                                    title="Copier la commande"
                                                >
                                                    {copiedIndex === idx ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                                </button>
                                                
                                                {/* BOUTON TESTER TRES VISIBLE */}
                                                <button
                                                    onClick={() => handleExecute(g.cmd)}
                                                    className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-md text-xs font-bold flex items-center gap-1 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                                                    title="Lancer la commande dans le terminal à gauche"
                                                >
                                                    <Play size={11} fill="currentColor" /> 👉 TESTER
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer d'information */}
                    <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                        <span className="flex items-center gap-1.5 font-medium">
                            <Shield size={13} className="text-emerald-400" /> Sandbox Interactive Réelle
                        </span>
                        <span className="text-gray-500 font-mono">Cliquez sur 👉 TESTER</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
