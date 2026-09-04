'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Calculator, Search, Sparkles, CheckCircle2, AlertCircle, Copy, Check,
    HelpCircle, ChevronRight, Play, Maximize2, Minimize2, Award, Zap,
    BookOpen, Terminal, Layers, ArrowRight, CornerDownRight, Filter,
    RefreshCw, FileSpreadsheet, Eye, Info, CheckCheck
} from 'lucide-react';

// ==============================================================================
// BASE DE DONNÉES DU DATASET INTERACTIF (CAS ENTREPRISE ALGÉRIE)
// ==============================================================================
export const CORPORATE_DATASET = [
    { ref: 'ART-101', desig: 'Serveur Dell PowerEdge T150', cat: 'Serveur', fournisseur: 'SARL IT Alger', stock: 12, pa: 185000, pv: 230000, ville: 'Alger', statut: 'Actif' },
    { ref: 'ART-102', desig: 'Licence Microsoft 365 Business', cat: 'Logiciel', fournisseur: 'Oran Soft Tech', stock: 45, pa: 28000, pv: 36000, ville: 'Oran', statut: 'Actif' },
    { ref: 'ART-103', desig: 'Routeur Cisco Gigabit VPN', cat: 'Réseau', fournisseur: 'Algiers Network', stock: 8, pa: 45000, pv: 59000, ville: 'Alger', statut: 'Rupture Proche' },
    { ref: 'ART-104', desig: 'Bobine Câble RJ45 Cat6 305m', cat: 'Câblage', fournisseur: 'Constantine Cable', stock: 110, pa: 12500, pv: 18000, ville: 'Constantine', statut: 'Actif' },
    { ref: 'ART-105', desig: 'Onduleur APC Smart-UPS 1500VA', cat: 'Protection', fournisseur: 'SARL IT Alger', stock: 5, pa: 68000, pv: 89000, ville: 'Alger', statut: 'Rupture Proche' },
    { ref: 'ART-106', desig: 'Écran Dell 27 pouces IPS 4K', cat: 'Périphérique', fournisseur: 'Distrib Alger Est', stock: 24, pa: 52000, pv: 68000, ville: 'Sétif', statut: 'Actif' },
    { ref: 'ART-107', desig: 'Switch Manageable 24 Ports PoE', cat: 'Réseau', fournisseur: 'Algiers Network', stock: 16, pa: 78000, pv: 102000, ville: 'Oran', statut: 'Actif' },
    { ref: 'ART-108', desig: 'Clavier & Souris Sans Fil Pro', cat: 'Périphérique', fournisseur: 'Oran Soft Tech', stock: 60, pa: 6500, pv: 9800, ville: 'Alger', statut: 'Actif' },
];

// ==============================================================================
// BIBLIOTHÈQUE DES FORMULES EXPERT (AVEC DISSECTION DÉTAILLÉE)
// ==============================================================================
export const FORMULA_LIBRARY = [
    {
        id: 'xlookup',
        name: 'RECHERCHEX (XLOOKUP)',
        category: 'recherche',
        badge: 'Incontournable 2026',
        level: 'Expert',
        icon: Search,
        shortDesc: 'Remplace RECHERCHEV et INDEX/EQUIV avec recherche vers la gauche et gestion native des erreurs.',
        syntaxFr: '=RECHERCHEX(K3; A2:A9; G2:G9; "Article inconnu"; 0)',
        syntaxEn: '=XLOOKUP(K3, A2:A9, G2:G9, "Unknown item", 0)',
        pythonOpenPyXL: `ws['L3'] = f'=XLOOKUP(K{row}, A2:A9, G2:G9, "Article inconnu", 0)'`,
        arguments: [
            { name: 'valeur_cherchée (K3)', desc: 'La référence à rechercher (ex: "ART-103")', color: 'text-amber-400 bg-amber-500/10' },
            { name: 'tableau_recherche (A2:A9)', desc: 'Colonne où chercher la référence (Réf Article)', color: 'text-blue-400 bg-blue-500/10' },
            { name: 'tableau_renvoyé (G2:G9)', desc: 'Colonne contenant la réponse à renvoyer (Prix Vente HT)', color: 'text-emerald-400 bg-emerald-500/10' },
            { name: '[si_non_trouvé]', desc: 'Texte si la référence n\'existe pas (évite le vilain #N/A !)', color: 'text-purple-400 bg-purple-500/10' },
            { name: '[mode_correspondance]', desc: '0 pour correspondance exacte (par défaut)', color: 'text-gray-400 bg-gray-500/10' }
        ],
        whySuperior: 'Contrairement à RECHERCHEV, RECHERCHEX ne casse JAMAIS si vous insérez une colonne, et peut chercher vers la gauche sans aucun bidouillage !',
        targetCells: { lookupCol: 'A', returnCol: 'G', searchVal: 'ART-103', expectedResult: '59 000 DZD' }
    },
    {
        id: 'index_match',
        name: 'INDEX + EQUIV (INDEX + MATCH)',
        category: 'recherche',
        badge: 'Standard Robuste',
        level: 'Avancé',
        icon: Layers,
        shortDesc: 'Le duo tout-terrain compatible avec toutes les versions d\'Excel et LibreOffice.',
        syntaxFr: '=INDEX(G2:G9; EQUIV(K3; A2:A9; 0))',
        syntaxEn: '=INDEX(G2:G9, MATCH(K3, A2:A9, 0))',
        pythonOpenPyXL: `ws['L3'] = f'=INDEX(G2:G9, MATCH(K{row}, A2:A9, 0))'`,
        arguments: [
            { name: 'matrice (G2:G9)', desc: 'Plage contenant la donnée à renvoyer (Prix Vente)', color: 'text-emerald-400 bg-emerald-500/10' },
            { name: 'EQUIV(...)', desc: 'Renvoie le numéro de ligne où se trouve la référence', color: 'text-blue-400 bg-blue-500/10' },
            { name: 'EQUIV -> valeur_cherchée (K3)', desc: 'La référence recherchée ("ART-105")', color: 'text-amber-400 bg-amber-500/10' },
            { name: 'EQUIV -> type_correspondance (0)', desc: '0 = correspondance exacte', color: 'text-gray-400 bg-gray-500/10' }
        ],
        whySuperior: 'Fonctionne sur 100% des postes des collègues ou clients (même sous Excel 2010 ou LibreOffice Calc).',
        targetCells: { lookupCol: 'A', returnCol: 'G', searchVal: 'ART-105', expectedResult: '89 000 DZD' }
    },
    {
        id: 'sumifs',
        name: 'SOMME.SI.ENS (SUMIFS)',
        category: 'agregation',
        badge: 'KPIs & Finance',
        level: 'Avancé',
        icon: Calculator,
        shortDesc: 'Calcule la somme de valeurs sous 1, 2 ou 10 conditions simultanées.',
        syntaxFr: '=SOMME.SI.ENS(G2:G9; H2:H9; "Alger"; I2:I9; "Actif")',
        syntaxEn: '=SUMIFS(G2:G9, H2:H9, "Alger", I2:I9, "Actif")',
        pythonOpenPyXL: `ws['L5'] = '=SUMIFS(G2:G9, H2:H9, "Alger", I2:I9, "Actif")'`,
        arguments: [
            { name: 'plage_somme (G2:G9)', desc: 'Les valeurs numériques à additionner (Prix Vente)', color: 'text-emerald-400 bg-emerald-500/10' },
            { name: 'plage_critère_1 (H2:H9)', desc: 'Première colonne à vérifier (Ville Dépôt)', color: 'text-blue-400 bg-blue-500/10' },
            { name: 'critère_1 ("Alger")', desc: 'La condition 1 : doit être à Alger', color: 'text-amber-400 bg-amber-500/10' },
            { name: 'plage_critère_2 (I2:I9)', desc: 'Deuxième colonne à vérifier (Statut)', color: 'text-purple-400 bg-purple-500/10' },
            { name: 'critère_2 ("Actif")', desc: 'La condition 2 : doit être Actif', color: 'text-teal-400 bg-teal-500/10' }
        ],
        whySuperior: 'Remplace avantageusement les tableaux croisés dynamiques (TCD) pour des dashboards automatisés et fluides.',
        targetCells: { sumCol: 'G', critCol1: 'H', val1: 'Alger', critCol2: 'I', val2: 'Actif', expectedResult: '239 800 DZD' }
    },
    {
        id: 'countifs',
        name: 'NB.SI.ENS (COUNTIFS)',
        category: 'agregation',
        badge: 'Audit & Stocks',
        level: 'Intermédiaire',
        icon: Filter,
        shortDesc: 'Compte le nombre de lignes respectant plusieurs critères stricts.',
        syntaxFr: '=NB.SI.ENS(H2:H9; "Alger"; I2:I9; "Rupture Proche")',
        syntaxEn: '=COUNTIFS(H2:H9, "Alger", I2:I9, "Rupture Proche")',
        pythonOpenPyXL: `ws['L6'] = '=COUNTIFS(H2:H9, "Alger", I2:I9, "Rupture Proche")'`,
        arguments: [
            { name: 'plage_critère_1 (H2:H9)', desc: 'Colonne de la ville', color: 'text-blue-400 bg-blue-500/10' },
            { name: 'critère_1 ("Alger")', desc: 'Filtrer sur "Alger"', color: 'text-amber-400 bg-amber-500/10' },
            { name: 'plage_critère_2 (I2:I9)', desc: 'Colonne du statut stock', color: 'text-purple-400 bg-purple-500/10' },
            { name: 'critère_2 ("Rupture Proche")', desc: 'Filtrer sur "Rupture Proche"', color: 'text-red-400 bg-red-500/10' }
        ],
        whySuperior: 'Idéal pour créer des alertes automatiques dans les fiches de suivi d\'approvisionnement.',
        targetCells: { critCol1: 'H', val1: 'Alger', critCol2: 'I', val2: 'Rupture Proche', expectedResult: '2 articles' }
    },
    {
        id: 'ifs',
        name: 'SI.CONDITIONS (IFS)',
        category: 'logique',
        badge: 'Code Moderne',
        level: 'Expert',
        icon: Zap,
        shortDesc: 'Élimine les vieux SI imbriqués illisibles : test 1 -> val 1, test 2 -> val 2.',
        syntaxFr: '=SI.CONDITIONS(E2<=10; "🔴 URGENCE"; E2<=25; "🟡 MOYEN"; VRAI; "🟢 CONFORT")',
        syntaxEn: '=IFS(E2<=10, "🔴 CRITICAL", E2<=25, "🟡 MEDIUM", TRUE, "🟢 SAFE")',
        pythonOpenPyXL: `ws.cell(row=r, column=10, value=f'=IFS(E{r}<=10, "🔴 CRITICAL", E{r}<=25, "🟡 MEDIUM", TRUE, "🟢 SAFE")')`,
        arguments: [
            { name: 'condition_1 (E2<=10)', desc: 'Si le stock est inférieur ou égal à 10', color: 'text-red-400 bg-red-500/10' },
            { name: 'valeur_si_1 ("🔴 URGENCE")', desc: 'Résultat renvoyé si condition 1 est vraie', color: 'text-amber-400 bg-amber-500/10' },
            { name: 'condition_2 (E2<=25)', desc: 'Si le stock est compris entre 11 et 25', color: 'text-yellow-400 bg-yellow-500/10' },
            { name: 'VRAI / TRUE (Option par défaut)', desc: 'Attrape toutes les autres valeurs restantes', color: 'text-emerald-400 bg-emerald-500/10' }
        ],
        whySuperior: 'Finis les 7 parenthèses de fin ))))))) qui causent des erreurs de frappe dans Excel !',
        targetCells: { testCol: 'E', rowTest: 2, expectedResult: '🟡 MOYEN (car stock = 12)' }
    },
    {
        id: 'iferror',
        name: 'SIERREUR (IFERROR)',
        category: 'logique',
        badge: 'Sécurité Dashboard',
        level: 'Indispensable',
        icon: AlertCircle,
        shortDesc: 'Enrobe n\'importe quelle formule pour attraper les erreurs (#N/A, #DIV/0!, #VALEUR!).',
        syntaxFr: '=SIERREUR(G2/E2; 0)',
        syntaxEn: '=IFERROR(G2/E2, 0)',
        pythonOpenPyXL: `ws['M2'] = f'=IFERROR(G{row}/E{row}, 0)'`,
        arguments: [
            { name: 'valeur (G2/E2)', desc: 'Le calcul ou la recherche risquée pouvant provoquer une division par zéro', color: 'text-blue-400 bg-blue-500/10' },
            { name: 'valeur_si_erreur (0 ou "-")', desc: 'La valeur propre à afficher au lieu d\'un code d\'erreur moche', color: 'text-emerald-400 bg-emerald-500/10' }
        ],
        whySuperior: 'Garantit que vos rapports destinés à la direction restent impeccables et professionnels.',
        targetCells: { expectedResult: '0 ou texte personnalisé' }
    },
    {
        id: 'dynamic_filter',
        name: 'FILTRE (FILTER) & UNIQUE',
        category: 'dynamique',
        badge: 'Dynamic Arrays (Excel 365/2021)',
        level: 'Master',
        icon: Sparkles,
        shortDesc: 'Renvoie automatiquement tout un sous-tableau filtré qui déborde (spill) sans copier-coller.',
        syntaxFr: '=FILTRE(B2:G9; H2:H9="Alger"; "Aucun résultat")',
        syntaxEn: '=FILTER(B2:G9, H2:H9="Alger", "No result")',
        pythonOpenPyXL: `ws['K2'] = '=FILTER(B2:G9, H2:H9="Alger", "No result")'`,
        arguments: [
            { name: 'tableau (B2:G9)', desc: 'Plage complète à extraire', color: 'text-blue-400 bg-blue-500/10' },
            { name: 'inclure (H2:H9="Alger")', desc: 'Condition booléenne de filtrage', color: 'text-amber-400 bg-amber-500/10' },
            { name: '[si_vide]', desc: 'Message affiché si aucune ligne ne correspond', color: 'text-purple-400 bg-purple-500/10' }
        ],
        whySuperior: 'Mise à jour en temps réel : ajoutez une ligne dans la base, le filtre dynamique l\'affiche automatiquement sans macro !',
        targetCells: { expectedResult: '4 lignes complètes générées instantanément' }
    },
    {
        id: 'let_variable',
        name: 'LET (Variables dans Excel)',
        category: 'dynamique',
        badge: 'Performance Turbo',
        level: 'Architecte',
        icon: Terminal,
        shortDesc: 'Permet de nommer des variables intermédiaires à l\'intérieur de la formule pour éviter de recalculer 10 fois la même chose.',
        syntaxFr: '=LET(marge; G2-F2; taux; marge/F2; SI(taux>0.25; "Excellente"; "Standard"))',
        syntaxEn: '=LET(marge, G2-F2, taux, marge/F2, IF(taux>0.25, "Excellent", "Standard"))',
        pythonOpenPyXL: `ws['N2'] = f'=LET(marge, G{row}-F{row}, taux, marge/F{row}, IF(taux>0.25, "Excellent", "Standard"))'`,
        arguments: [
            { name: 'nom_variable_1 (marge)', desc: 'Déclaration du nom de la variable', color: 'text-blue-400 bg-blue-500/10' },
            { name: 'valeur_variable_1 (G2-F2)', desc: 'Calcul stocké en mémoire RAM', color: 'text-amber-400 bg-amber-500/10' },
            { name: 'nom_variable_2 (taux)', desc: 'Deuxième variable réutilisant la première (marge/F2)', color: 'text-purple-400 bg-purple-500/10' },
            { name: 'calcul_final', desc: 'L\'expression finale qui renvoie le résultat', color: 'text-emerald-400 bg-emerald-500/10' }
        ],
        whySuperior: 'Multiplie par 20 la vitesse de calcul des gros classeurs Excel et rend les formules lisibles comme du code Python !',
        targetCells: { expectedResult: '"Standard" (Taux = 24.3%)' }
    }
];

// ==============================================================================
// 5 DÉFIS PRATIQUES INTERACTIFS (GAMIFICATION)
// ==============================================================================
export const FORMULA_CHALLENGES = [
    {
        id: 'c1',
        title: 'Défi 1 : Trouver le prix du Routeur Cisco',
        difficulty: 'Débutant',
        category: 'Recherche',
        mission: 'Vous devez renvoyer le Prix de Vente HT de la référence "ART-103" en utilisant la formule moderne la plus robuste.',
        options: [
            { id: 'a', text: '=RECHERCHEV("ART-103"; A2:G9; 7; FAUX)', isGood: false, feedback: 'Fonctionne mais casse si une colonne est insérée ultérieurement ! Préférez RECHERCHEX.' },
            { id: 'b', text: '=RECHERCHEX("ART-103"; A2:A9; G2:G9)', isGood: true, feedback: 'Bravo ! RECHERCHEX est direct, sécurisé et insensible aux ajouts de colonnes.' },
            { id: 'c', text: '=SOMME(G2:G9)', isGood: false, feedback: 'Non, SOMME calcule le total et non la recherche d\'un article précis.' }
        ],
        hint: 'RECHERCHEX prend d\'abord la valeur cherchée, puis la colonne où chercher, puis la colonne à renvoyer.'
    },
    {
        id: 'c2',
        title: 'Défi 2 : Chiffre d\'Affaires du Dépôt d\'Alger',
        difficulty: 'Intermédiaire',
        category: 'Agrégation',
        mission: 'Calculez la somme des Prix de Vente des articles situés exclusivement dans la ville "Alger".',
        options: [
            { id: 'a', text: '=SOMME.SI(H2:H9; "Alger"; G2:G9)', isGood: true, feedback: 'Parfait ! SOMME.SI filtre la colonne H sur "Alger" et additionne la colonne G.' },
            { id: 'b', text: '=NB.SI(H2:H9; "Alger")', isGood: false, feedback: 'NB.SI compte le nombre d\'articles (3), mais ne fait pas la somme financière !' },
            { id: 'c', text: '=SOMME(G2:G9)', isGood: false, feedback: 'SOMME additionne tout le pays sans filtrer Alger.' }
        ],
        hint: 'SOMME.SI ou SOMME.SI.ENS permettent d\'additionner sous condition.'
    },
    {
        id: 'c3',
        title: 'Défi 3 : Détecter les Alertes Stocks Critiques',
        difficulty: 'Intermédiaire',
        category: 'Logique',
        mission: 'Si le stock (E2) est <= 10, afficher "ALERTE", sinon si stock <= 20 afficher "ATTENTION", sinon "OK".',
        options: [
            { id: 'a', text: '=SI.CONDITIONS(E2<=10; "ALERTE"; E2<=20; "ATTENTION"; VRAI; "OK")', isGood: true, feedback: 'Excellent ! SI.CONDITIONS gère les tranches de manière limpide avec VRAI comme sécurité finale.' },
            { id: 'b', text: '=SI(E2<=10; "ALERTE")', isGood: false, feedback: 'Incomplet, la fonction n\'indique pas quoi faire au-dessus de 10.' },
            { id: 'c', text: '=OU(E2<=10; E2<=20)', isGood: false, feedback: 'La fonction OU renvoie seulement VRAI ou FAUX.' }
        ],
        hint: 'La fonction SI.CONDITIONS (IFS en anglais) évalue les conditions de gauche à droite.'
    },
    {
        id: 'c4',
        title: 'Défi 4 : Sécuriser un Rapprochement contre les #N/A',
        difficulty: 'Avancé',
        category: 'Sécurité & Audit',
        mission: 'Lors d\'une recherche d\'un code inconnu dans une table, comment renvoyer "Inconnu" sans afficher le vilain code d\'erreur #N/A ?',
        options: [
            { id: 'a', text: '=SIERREUR(RECHERCHEX(K3; A2:A9; B2:B9); "Inconnu")', isGood: true, feedback: 'Très bien ! Soit avec SIERREUR(), soit directement dans le 4ème argument de RECHERCHEX !' },
            { id: 'b', text: '=EFFACER.ERREUR(RECHERCHEX(K3; A2:A9; B2:B9))', isGood: false, feedback: 'Cette fonction n\'existe pas sous Excel.' },
            { id: 'c', text: '=SI(ESTVIDE(K3); "Inconnu")', isGood: false, feedback: 'ESTVIDE vérifie si la cellule source est vide, pas si la recherche échoue.' }
        ],
        hint: 'SIERREUR (IFERROR) entoure la formule et définit une valeur de repli propre.'
    },
    {
        id: 'c5',
        title: 'Défi 5 : Écriture de la Formule en Python openpyxl',
        difficulty: 'Expert Python',
        category: 'Automatisation',
        mission: 'Comment écrire correctement dans openpyxl une formule de somme dynamique qui s\'adapte au nombre de lignes `last_row` ?',
        options: [
            { id: 'a', text: 'ws[f"G{last_row+1}"] = f"=SOMME(G2:G{last_row})"', isGood: false, feedback: '❌ ERREUR CLASSIQUE ! openpyxl exige STRICTEMENT les noms de fonctions en anglais (SUM et non SOMME) !' },
            { id: 'b', text: 'ws[f"G{last_row+1}"] = f"=SUM(G2:G{last_row})"', isGood: true, feedback: '⭐ PARFAIT ! Toujours utiliser le nom anglais SUM. Excel en français le traduira automatiquement à l\'ouverture !' },
            { id: 'c', text: 'ws[f"G{last_row+1}"] = sum(ws["G2":"G10"])', isGood: false, feedback: 'La fonction sum() native de Python ne sait pas interpréter les objets cellules d\'openpyxl directement comme une formule.' }
        ],
        hint: 'Règle d\'or openpyxl : TOUJOURS les noms de fonctions en anglais (SUM, AVERAGE, IF, XLOOKUP, VLOOKUP).'
    }
];

// ==============================================================================
// COMPOSANT PRINCIPAL
// ==============================================================================
export default function ExcelFormulaExpert({ config }) {
    const [selectedFormulaId, setSelectedFormulaId] = useState('xlookup');
    const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'challenges' | 'cheatSheet' | 'openpyxl'
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [copiedKey, setCopiedKey] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // État simulateur interactif
    const [activeSearchRef, setActiveSearchRef] = useState('ART-103');
    const [selectedGridCell, setSelectedGridCell] = useState(null);
    
    // État défis
    const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
    const [challengeAnswers, setChallengeAnswers] = useState({});
    const [score, setScore] = useState(0);

    // Gérer l'échap pour le plein écran
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    const activeFormula = FORMULA_LIBRARY.find(f => f.id === selectedFormulaId) || FORMULA_LIBRARY[0];

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Calcul interactif en temps réel selon la référence sélectionnée
    const currentSearchedRow = CORPORATE_DATASET.find(d => d.ref === activeSearchRef) || CORPORATE_DATASET[0];

    const handleAnswerChallenge = (challengeId, option) => {
        const prev = challengeAnswers[challengeId];
        const updated = { ...challengeAnswers, [challengeId]: option };
        setChallengeAnswers(updated);
        
        if (option.isGood && (!prev || !prev.isGood)) {
            setScore(s => s + 20);
        } else if (!option.isGood && prev && prev.isGood) {
            setScore(s => Math.max(0, s - 20));
        }
    };

    const filteredFormulas = FORMULA_LIBRARY.filter(f => {
        if (categoryFilter === 'all') return true;
        return f.category === categoryFilter;
    });

    return (
        <div className={`transition-all duration-300 ${
            isFullscreen 
                ? 'fixed inset-0 z-50 bg-[#080c14] overflow-y-auto p-4 sm:p-6 flex flex-col' 
                : 'my-8 rounded-2xl overflow-hidden border border-blue-500/30 bg-[#080c14] shadow-2xl shadow-blue-950/40'
        }`}>
            {/* 1. EN-TÊTE CORPORATE AVANCÉ */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-[#0d1627] via-[#0e1c38] to-[#0d1627] border-b border-blue-500/20">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-violet-500/10 border border-blue-400/40 flex items-center justify-center shadow-lg shadow-blue-500/10">
                        <Calculator size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                                Laboratoire Expert Formules Excel & Automatisation
                            </h3>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 border border-blue-400/30">
                                <Sparkles size={11} className="text-amber-400" /> 100% Interactif
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Maîtrisez RECHERCHEX, SOMME.SI.ENS, Dynamic Arrays, équivalences FR 🇫🇷 / EN 🇬🇧 et génération openpyxl
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* Score Défi badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        <Award size={15} className="text-amber-400" />
                        <span>XP Défi : {score}/100</span>
                    </div>

                    {/* Plein écran */}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            isFullscreen
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/40'
                                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
                        }`}
                        title={isFullscreen ? "Quitter plein écran (Échap)" : "Plein écran"}
                    >
                        {isFullscreen ? <><Minimize2 size={14} /> Réduire</> : <><Maximize2 size={14} /> Plein écran</>}
                    </button>
                </div>
            </div>

            {/* 2. NAVIGATION PAR ONGLETS */}
            <div className="px-5 py-2.5 bg-[#0a0f1d] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                        onClick={() => setActiveTab('simulator')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'simulator'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Zap size={14} /> Simulateur & Dissection Live
                    </button>

                    <button
                        onClick={() => setActiveTab('challenges')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'challenges'
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Award size={14} /> 5 Défis Pratiques
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    </button>

                    <button
                        onClick={() => setActiveTab('cheatSheet')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'cheatSheet'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <BookOpen size={14} /> Grand Dictionnaire FR / EN / Python
                    </button>
                </div>

                {/* Filtres par catégorie de formules */}
                {activeTab === 'simulator' && (
                    <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-gray-500 mr-1 font-semibold">Filtrer :</span>
                        {[
                            { id: 'all', label: 'Toutes' },
                            { id: 'recherche', label: '🔍 Recherche' },
                            { id: 'agregation', label: '📊 Agrégation' },
                            { id: 'logique', label: '⚡ Logique' },
                            { id: 'dynamique', label: '🚀 Dynamic Arrays' },
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoryFilter(cat.id)}
                                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                                    categoryFilter === cat.id
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. VUE PRINCIPALE 1 : SIMULATEUR & DISSECTION INTERACTIVE */}
            {activeTab === 'simulator' && (
                <div className="p-4 sm:p-6 space-y-6">
                    {/* A. SÉLECTION RAPIDE DE LA FORMULE À ÉTUDIER */}
                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={13} className="text-blue-400" /> Choisissez la formule à disséquer :
                            </span>
                            <span className="text-[11px] text-gray-500">
                                {filteredFormulas.length} formules professionnelles disponibles
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {filteredFormulas.map(f => {
                                const isSel = f.id === selectedFormulaId;
                                const Icon = f.icon;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setSelectedFormulaId(f.id)}
                                        className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                                            isSel
                                                ? 'bg-gradient-to-br from-blue-900/40 to-indigo-950/60 border-blue-400/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/40'
                                                : 'bg-[#0c1220] hover:bg-[#11192e] border-white/5 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-mono font-bold ${isSel ? 'text-blue-300' : 'text-gray-300'}`}>
                                                {f.name.split(' ')[0]}
                                            </span>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                                isSel ? 'bg-blue-500/30 text-blue-200' : 'bg-white/5 text-gray-500'
                                            }`}>
                                                {f.level}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                                            {f.shortDesc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* B. TABLEUR INTERACTIF EN DIRECT (DATASET D'ENTREPRISE) */}
                    <div className="rounded-2xl border border-gray-800 bg-[#060913] overflow-hidden shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0d1424] border-b border-gray-800 text-xs">
                            <div className="flex items-center gap-2.5">
                                <FileSpreadsheet size={16} className="text-emerald-400" />
                                <span className="font-bold text-white">Tableau Source : Catalogue & Stocks SARL IT Alger</span>
                                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                                    Feuille: "Catalogue_2026"
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[11px] text-gray-400">
                                    Référence testée :
                                </span>
                                <select
                                    value={activeSearchRef}
                                    onChange={(e) => setActiveSearchRef(e.target.value)}
                                    className="bg-black/40 border border-blue-500/40 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                >
                                    {CORPORATE_DATASET.map(d => (
                                        <option key={d.ref} value={d.ref} className="bg-gray-900 text-white">
                                            {d.ref} - {d.desig.substring(0, 22)}...
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Grille Excel stylisée */}
                        <div className="overflow-x-auto p-3">
                            <table className="w-full text-xs font-mono border-collapse bg-[#0a0f1d] rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-[#121b2f] text-gray-400 border-b border-gray-700 select-none">
                                        <th className="px-3 py-2 text-center text-[10px] text-gray-500 bg-[#0f172a] border-r border-gray-700 w-12">
                                            #
                                        </th>
                                        <th className="px-3 py-2 text-left text-gray-300 border-r border-gray-700">A : Réf</th>
                                        <th className="px-3 py-2 text-left text-gray-300 border-r border-gray-700">B : Désignation</th>
                                        <th className="px-3 py-2 text-left text-gray-300 border-r border-gray-700">C : Catégorie</th>
                                        <th className="px-3 py-2 text-center text-gray-300 border-r border-gray-700">E : Stock</th>
                                        <th className="px-3 py-2 text-right text-gray-300 border-r border-gray-700">F : P. Achat HT</th>
                                        <th className="px-3 py-2 text-right text-gray-300 border-r border-gray-700">G : P. Vente HT</th>
                                        <th className="px-3 py-2 text-center text-gray-300 border-r border-gray-700">H : Ville</th>
                                        <th className="px-3 py-2 text-center text-gray-300">I : Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CORPORATE_DATASET.map((row, idx) => {
                                        const rowNum = idx + 2;
                                        const isSearched = row.ref === activeSearchRef;
                                        return (
                                            <tr
                                                key={row.ref}
                                                onClick={() => setActiveSearchRef(row.ref)}
                                                className={`border-b border-gray-800/60 cursor-pointer transition-all ${
                                                    isSearched
                                                        ? 'bg-blue-500/15 ring-1 ring-blue-500/40'
                                                        : 'hover:bg-white/[0.03]'
                                                }`}
                                            >
                                                <td className="px-3 py-2 text-center text-[10px] font-bold text-gray-500 bg-[#0d1424] border-r border-gray-700">
                                                    {rowNum}
                                                </td>
                                                <td className={`px-3 py-2 font-bold border-r border-gray-800/60 ${isSearched ? 'text-amber-300 font-extrabold' : 'text-blue-300'}`}>
                                                    {row.ref}
                                                </td>
                                                <td className="px-3 py-2 text-gray-200 border-r border-gray-800/60">
                                                    {row.desig}
                                                </td>
                                                <td className="px-3 py-2 text-gray-400 border-r border-gray-800/60">
                                                    {row.cat}
                                                </td>
                                                <td className={`px-3 py-2 text-center font-bold border-r border-gray-800/60 ${
                                                    row.stock <= 10 ? 'text-red-400 bg-red-500/10' : 'text-emerald-300'
                                                }`}>
                                                    {row.stock}
                                                </td>
                                                <td className="px-3 py-2 text-right text-gray-400 border-r border-gray-800/60">
                                                    {row.pa.toLocaleString()} DZD
                                                </td>
                                                <td className={`px-3 py-2 text-right font-bold border-r border-gray-800/60 ${
                                                    isSearched ? 'text-emerald-300 font-black bg-emerald-500/10' : 'text-emerald-400'
                                                }`}>
                                                    {row.pv.toLocaleString()} DZD
                                                </td>
                                                <td className="px-3 py-2 text-center text-gray-300 border-r border-gray-800/60">
                                                    {row.ville}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        row.statut === 'Actif'
                                                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                                    }`}>
                                                        {row.statut}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* C. DISSECTION DÉTAILLÉE DE LA FORMULE SÉLECTIONNÉE */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Colonne Gauche : Les 3 Syntaxes (FR, EN, Python) - 7 cols */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="p-4 rounded-2xl bg-[#0b1120] border border-blue-500/20 shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <CodeSnippetIcon /> Syntaxes Prêtes à l'Emploi
                                    </h4>
                                    <span className="text-xs text-blue-400 font-mono font-bold">
                                        {activeFormula.name}
                                    </span>
                                </div>

                                {/* 1. Syntaxe Excel FR */}
                                <div className="space-y-2.5">
                                    <div className="p-3 rounded-xl bg-[#060912] border border-white/10">
                                        <div className="flex items-center justify-between mb-1 text-[11px] text-gray-400">
                                            <span className="flex items-center gap-1.5 font-bold text-gray-300">
                                                🇫🇷 Version Excel Français (séparateur point-virgule ;)
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(activeFormula.syntaxFr, 'fr')}
                                                className="hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-white/5"
                                            >
                                                {copiedKey === 'fr' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                <span>{copiedKey === 'fr' ? 'Copié' : 'Copier'}</span>
                                            </button>
                                        </div>
                                        <code className="block text-xs font-mono font-bold text-emerald-300 whitespace-pre-wrap">
                                            {activeFormula.syntaxFr}
                                        </code>
                                    </div>

                                    {/* 2. Syntaxe Excel EN */}
                                    <div className="p-3 rounded-xl bg-[#060912] border border-white/10">
                                        <div className="flex items-center justify-between mb-1 text-[11px] text-gray-400">
                                            <span className="flex items-center gap-1.5 font-bold text-gray-300">
                                                🇬🇧 Version Excel International (séparateur virgule ,)
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(activeFormula.syntaxEn, 'en')}
                                                className="hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-white/5"
                                            >
                                                {copiedKey === 'en' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                <span>{copiedKey === 'en' ? 'Copié' : 'Copier'}</span>
                                            </button>
                                        </div>
                                        <code className="block text-xs font-mono font-bold text-blue-300 whitespace-pre-wrap">
                                            {activeFormula.syntaxEn}
                                        </code>
                                    </div>

                                    {/* 3. Syntaxe Python openpyxl */}
                                    <div className="p-3 rounded-xl bg-[#060912] border border-emerald-500/20">
                                        <div className="flex items-center justify-between mb-1 text-[11px] text-gray-400">
                                            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                                                🐍 Automatisation Python avec openpyxl (nom anglais obligatoire !)
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(activeFormula.pythonOpenPyXL, 'py')}
                                                className="hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-white/5"
                                            >
                                                {copiedKey === 'py' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                <span>{copiedKey === 'py' ? 'Copié' : 'Copier'}</span>
                                            </button>
                                        </div>
                                        <code className="block text-xs font-mono font-bold text-yellow-300 whitespace-pre-wrap">
                                            {activeFormula.pythonOpenPyXL}
                                        </code>
                                    </div>
                                </div>

                                {/* Pourquoi cette formule est supérieure */}
                                <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-2.5">
                                    <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                    <div className="text-xs text-blue-200">
                                        <strong className="text-white">Avantage Clé d'Expert : </strong>
                                        {activeFormula.whySuperior}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Colonne Droite : Décomposition des Arguments & Résultat Live - 5 cols */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Résultat Calculé en Direct */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c182d] to-[#0a1222] border border-blue-400/30 shadow-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Résultat en Temps Réel
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                        Cellule Cible
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                                    <div>
                                        <div className="text-[11px] text-gray-400">Valeur calculée pour {activeSearchRef} :</div>
                                        <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                                            {currentSearchedRow.pv.toLocaleString()} DZD
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 font-mono">Désignation :</div>
                                        <div className="text-xs font-bold text-gray-200 max-w-[150px] truncate">
                                            {currentSearchedRow.desig}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dissection des Arguments pas-à-pas */}
                            <div className="p-4 rounded-2xl bg-[#0b1120] border border-white/10">
                                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Layers size={14} className="text-indigo-400" /> Dissection des Arguments
                                </h4>
                                <div className="space-y-2">
                                    {activeFormula.arguments.map((arg, i) => (
                                        <div key={i} className="p-2.5 rounded-xl bg-[#070a14] border border-white/5 flex items-start gap-2.5">
                                            <span className="w-5 h-5 rounded-lg bg-white/10 text-gray-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-xs font-mono font-bold ${arg.color.split(' ')[0]}`}>
                                                    {arg.name}
                                                </div>
                                                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                                                    {arg.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. VUE PRINCIPALE 2 : DÉFIS PRATIQUES INTERACTIFS (GAMIFICATION) */}
            {activeTab === 'challenges' && (
                <div className="p-4 sm:p-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
                        <div>
                            <h4 className="text-base font-black text-white flex items-center gap-2">
                                <Award size={20} className="text-amber-400" />
                                5 Défis Pratiques pour Valider Votre Niveau d'Expert
                            </h4>
                            <p className="text-xs text-gray-300 mt-1">
                                Testez vos réflexes face aux situations concrètes d'entreprise. Gagnez 20 XP par défi réussi !
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {FORMULA_CHALLENGES.map((ch, idx) => {
                                const ans = challengeAnswers[ch.id];
                                const isDone = ans && ans.isGood;
                                return (
                                    <button
                                        key={ch.id}
                                        onClick={() => setActiveChallengeIdx(idx)}
                                        className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                                            activeChallengeIdx === idx
                                                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                                                : isDone
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                        }`}
                                    >
                                        {isDone ? <Check size={14} /> : idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Défi Actif */}
                    {(() => {
                        const challenge = FORMULA_CHALLENGES[activeChallengeIdx];
                        const answer = challengeAnswers[challenge.id];

                        return (
                            <div className="p-6 rounded-2xl bg-[#0c1222] border border-amber-500/30 shadow-2xl space-y-5">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                {challenge.difficulty}
                                            </span>
                                            <span className="text-xs font-mono text-gray-400">
                                                Catégorie : {challenge.category}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-white mt-1.5">
                                            {challenge.title}
                                        </h3>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono">
                                        Question {activeChallengeIdx + 1} / {FORMULA_CHALLENGES.length}
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-100">
                                    <strong className="text-white">Énoncé de la Mission : </strong>
                                    {challenge.mission}
                                </div>

                                {/* Choix interactifs */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                                        Sélectionnez la meilleure formule professionnelle :
                                    </p>
                                    {challenge.options.map(opt => {
                                        const isSelected = answer?.id === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleAnswerChallenge(challenge.id, opt)}
                                                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                                                    isSelected
                                                        ? opt.isGood
                                                            ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                                                            : 'bg-red-950/40 border-red-500 text-white shadow-lg shadow-red-500/10'
                                                        : 'bg-[#080d18] hover:bg-[#10192d] border-white/10 text-gray-300'
                                                }`}
                                            >
                                                <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                                    isSelected
                                                        ? opt.isGood ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                                                        : 'bg-white/10 text-gray-400'
                                                }`}>
                                                    {opt.id.toUpperCase()}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <code className="text-xs font-mono font-bold text-white block mb-1">
                                                        {opt.text}
                                                    </code>
                                                    {isSelected && (
                                                        <div className={`text-xs mt-2 p-2.5 rounded-lg flex items-start gap-2 ${
                                                            opt.isGood
                                                                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                                                                : 'bg-red-500/20 text-red-200 border border-red-500/30'
                                                        }`}>
                                                            {opt.isGood ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />}
                                                            <span>{opt.feedback}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Indices & Navigation */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                                    <div className="text-xs text-gray-400 italic flex items-center gap-1.5">
                                        <HelpCircle size={14} className="text-amber-400" /> Indice : {challenge.hint}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={activeChallengeIdx === 0}
                                            onClick={() => setActiveChallengeIdx(i => Math.max(0, i - 1))}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 disabled:opacity-30"
                                        >
                                            Précédent
                                        </button>
                                        <button
                                            disabled={activeChallengeIdx === FORMULA_CHALLENGES.length - 1}
                                            onClick={() => setActiveChallengeIdx(i => Math.min(FORMULA_CHALLENGES.length - 1, i + 1))}
                                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white disabled:opacity-30 flex items-center gap-1"
                                        >
                                            Suivant <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* 5. VUE PRINCIPALE 3 : GRAND DICTIONNAIRE FR / EN / PYTHON */}
            {activeTab === 'cheatSheet' && (
                <div className="p-4 sm:p-6 space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <BookOpen size={18} className="text-emerald-400" />
                            Guide de Traduction Instantané : Excel FR ➔ Excel EN ➔ openpyxl
                        </h4>
                        <p className="text-xs text-gray-300 mt-1">
                            Tous les tableurs francophones traduisent automatiquement vos formules. Cependant, dans vos scripts Python openpyxl, vous devez <strong>systématiquement utiliser la fonction anglaise</strong> !
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#090e1a] shadow-xl">
                        <table className="w-full text-xs font-mono border-collapse">
                            <thead>
                                <tr className="bg-[#121a2d] text-gray-300 border-b border-gray-700 select-none">
                                    <th className="px-4 py-3 text-left font-bold text-blue-300">Formule Excel (Français 🇫🇷)</th>
                                    <th className="px-4 py-3 text-left font-bold text-emerald-300">Formule Excel (Anglais 🇬🇧)</th>
                                    <th className="px-4 py-3 text-left font-bold text-yellow-300">Syntaxe Python (openpyxl 🐍)</th>
                                    <th className="px-4 py-3 text-left font-bold text-gray-400">Cas d'Utilisation Métier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { fr: '=RECHERCHEX(K2; A:A; B:B)', en: '=XLOOKUP(K2, A:A, B:B)', py: `ws['C2'] = '=XLOOKUP(K2, A:A, B:B)'`, use: 'Recherche moderne sans limitation' },
                                    { fr: '=INDEX(B:B; EQUIV(K2; A:A; 0))', en: '=INDEX(B:B, MATCH(K2, A:A, 0))', py: `ws['C2'] = '=INDEX(B:B, MATCH(K2, A:A, 0))'`, use: 'Recherche rétrocompatible tous postes' },
                                    { fr: '=SOMME.SI.ENS(C:C; A:A; "Alger")', en: '=SUMIFS(C:C, A:A, "Alger")', py: `ws['D2'] = '=SUMIFS(C:C, A:A, "Alger")'`, use: 'Calcul de totaux multi-critères' },
                                    { fr: '=NB.SI.ENS(A:A; "Actif")', en: '=COUNTIFS(A:A, "Actif")', py: `ws['D3'] = '=COUNTIFS(A:A, "Actif")'`, use: 'Dénombrement d\'anomalies ou clients' },
                                    { fr: '=SI.CONDITIONS(A1>10; "A"; VRAI; "B")', en: '=IFS(A1>10, "A", TRUE, "B")', py: `ws['B1'] = '=IFS(A1>10, "A", TRUE, "B")'`, use: 'Paliers et barèmes (ex: IRG Algérie)' },
                                    { fr: '=SIERREUR(A1/B1; 0)', en: '=IFERROR(A1/B1, 0)', py: `ws['C1'] = '=IFERROR(A1/B1, 0)'`, use: 'Nettoyage des erreurs #DIV/0! et #N/A' },
                                    { fr: '=UNIQUE(A2:A100)', en: '=UNIQUE(A2:A100)', py: `ws['F2'] = '=UNIQUE(A2:A100)'`, use: 'Extraction sans doublon automatique' },
                                    { fr: '=TRIER(FILTRE(A:D; D:D>0))', en: '=SORT(FILTER(A:D, D:D>0))', py: `ws['H2'] = '=SORT(FILTER(A:D, D:D>0))'`, use: 'Génération de dashboards dynamiques' },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-800/60 hover:bg-white/[0.02]">
                                        <td className="px-4 py-3 font-bold text-blue-300">{row.fr}</td>
                                        <td className="px-4 py-3 font-bold text-emerald-300">{row.en}</td>
                                        <td className="px-4 py-3 text-yellow-300">{row.py}</td>
                                        <td className="px-4 py-3 text-gray-400 font-sans text-[11px]">{row.use}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 6. PIED DE PAGE ET ASTUCE EXPERT */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#060912] border-t border-white/5 text-[11px] text-gray-400">
                <div className="flex items-center gap-2">
                    <CheckCheck size={14} className="text-emerald-400" />
                    <span>Toutes les formules générées via Python sont vérifiées 100% compatibles Microsoft Excel 2016 à 365, LibreOffice et Google Sheets.</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] text-gray-500">
                    <span>💡 Astuce : Utilisez F4 dans Excel pour verrouiller ($A$1) vos plages de recherche !</span>
                </div>
            </div>
        </div>
    );
}

function CodeSnippetIcon() {
    return (
        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    );
}
