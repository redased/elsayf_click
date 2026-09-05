'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic';
import {
    Play, Download, Loader2, CheckCircle2, AlertTriangle, RefreshCw,
    FileSpreadsheet, Terminal, Lightbulb, RotateCcw, Cpu, Copy, Check,
    Table, Maximize2, Minimize2, Search, Layers, FileText, Sparkles,
    BarChart3, DollarSign, Package, Users, Filter, ChevronRight, HelpCircle,
    Calculator, ZoomIn, ZoomOut, Type, AlignLeft, Sun, Moon, Braces,
    Sliders, Keyboard, PlusCircle, CheckCheck
} from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0d1322] text-gray-400 p-8 min-h-[380px]">
            <Loader2 size={26} className="animate-spin text-emerald-400 mb-3" />
            <span className="text-xs font-mono font-bold text-gray-300">
                Initialisation de l'éditeur VS Code Python haute visibilité...
            </span>
            <span className="text-[11px] text-gray-500 mt-1">
                Coloration syntaxique, autocomplétion & zoom ergonomique
            </span>
        </div>
    )
});

// ==============================================================================
// PALETTE DE SNIPPETS RAPIDES POUR ÉCRIRE DU CODE OPENPYXL PRO
// ==============================================================================
export const OPENPYXL_SNIPPETS = [
    {
        label: '🔍 RECHERCHEX',
        title: 'Formule XLOOKUP',
        code: `ws['D2'] = f'=XLOOKUP(A{row}, Catalogue!A:A, Catalogue!B:B, "Inconnu", 0)'\n`
    },
    {
        label: '📊 SOMME.SI.ENS',
        title: 'Formule SUMIFS',
        code: `ws['H5'] = '=SUMIFS(E:E, B:B, "Alger", F:F, "Validé")'\n`
    },
    {
        label: '🎨 Style Fond & Texte',
        title: 'PatternFill + Font',
        code: `cell.fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")\ncell.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")\n`
    },
    {
        label: '💰 Format DZD',
        title: 'Format Monétaire Dinars',
        code: `cell.number_format = '#,##0.00 DZD'\ncell.alignment = Alignment(horizontal="right")\n`
    },
    {
        label: '🔄 Boucle Lignes',
        title: 'Parcourir les lignes du tableau',
        code: `for r in range(2, ws.max_row + 1):\n    val = ws[f'A{r}'].value\n`
    },
    {
        label: '💾 Sauvegarder',
        title: 'Sauvegarder le classeur',
        code: `wb.save('mon_fichier_genere.xlsx')\nprint("✅ Fichier Excel généré avec succès !")\n`
    }
];

// ==============================================================================
// 7 MODÈLES CONCRETS & CAS PRATIQUES D'ENTREPRISE
// ==============================================================================
export const EXCEL_TEMPLATES = {
    facture: {
        id: 'facture',
        name: '🧾 Facture Pro & TVA',
        badge: 'Comptabilité / Vente',
        category: 'Finance',
        icon: DollarSign,
        description: 'Facture B2B avec en-têtes corporate, calcul automatique Sous-Total HT, Remise 5%, TVA 19% et Net à Payer TTC par formules.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# 1. Initialiser le classeur
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Facture_FAC2026"
ws.views.sheetView[0].showGridLines = True

# 2. Styles
bleu_fonce = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
bleu_clair = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
gris_clair = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
accent_fill = PatternFill(start_color="DBEAFE", end_color="DBEAFE", fill_type="solid")

font_titre = Font(name="Calibri", size=16, bold=True, color="1E3A8A")
font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
font_bold = Font(name="Calibri", size=11, bold=True, color="1F2937")
font_normal = Font(name="Calibri", size=11, color="374151")
font_total = Font(name="Calibri", size=12, bold=True, color="1E3A8A")

thin = Side(border_style="thin", color="CBD5E1")
thick_bottom = Side(border_style="medium", color="1E3A8A")
border_box = Border(left=thin, right=thin, top=thin, bottom=thin)
border_header = Border(left=thin, right=thin, top=thin, bottom=thick_bottom)

# 3. En-tête de la facture & Coordonnées
ws['A1'] = "SARL ELSAYF TECH SOLUTIONS"
ws['A1'].font = font_titre
ws['A2'] = "14 Boulevard des Martyrs, Alger | contact@elsayf.click"
ws['A2'].font = font_normal

ws['E1'] = "FACTURE N° FAC-2026-084"
ws['E1'].font = Font(name="Calibri", size=13, bold=True, color="1E3A8A")
ws['E1'].alignment = Alignment(horizontal="right")
ws['E2'] = "Date : 19/08/2026  |  Échéance : 19/09/2026"
ws['E2'].font = font_normal
ws['E2'].alignment = Alignment(horizontal="right")

# Cadre Client
ws['A4'] = "CLIENT :"
ws['A4'].font = font_bold
ws['A5'] = "SARL ALGERIA DIGITAL COMMERCE"
ws['A5'].font = font_bold
ws['A6'] = "Adresse : 45 Rue Didouche Mourad, Alger"
ws['A6'].font = font_normal
ws['A7'] = "NIF : 001916012345678  |  RC : 16/00-0987654B20"
ws['A7'].font = font_normal

# 4. Tableau des articles
headers = ["Réf", "Désignation de la prestation", "Quantité", "Prix Unit. HT (DZD)", "Remise", "Total HT (DZD)"]
for col_num, header in enumerate(headers, 1):
    cell = ws.cell(row=9, column=col_num, value=header)
    cell.font = font_header
    cell.fill = bleu_fonce
    cell.alignment = Alignment(horizontal="center" if col_num in [1, 3, 5] else "left" if col_num == 2 else "right", vertical="center")
    cell.border = border_header
ws.row_dimensions[9].height = 26

articles = [
    ("SRV-01", "Audit & Architecture Cloud AWS / VPS", 2, 45000, 0.05),
    ("SRV-02", "Développement Scripts Automatisation Python", 10, 8500, 0.00),
    ("SRV-03", "Formation Équipe : Python & Excel Avancé", 1, 65000, 0.10),
    ("SRV-04", "Support & Maintenance Annuelle 24/7", 12, 12000, 0.05),
]

row_idx = 10
for ref, desig, qte, pu, rem in articles:
    ws.cell(row=row_idx, column=1, value=ref).alignment = Alignment(horizontal="center")
    ws.cell(row=row_idx, column=2, value=desig).alignment = Alignment(horizontal="left")
    ws.cell(row=row_idx, column=3, value=qte).alignment = Alignment(horizontal="center")
    
    cell_pu = ws.cell(row=row_idx, column=4, value=pu)
    cell_pu.number_format = '#,##0.00'
    cell_pu.alignment = Alignment(horizontal="right")
    
    cell_rem = ws.cell(row=row_idx, column=5, value=rem)
    cell_rem.number_format = '0.0%'
    cell_rem.alignment = Alignment(horizontal="center")
    
    # Formule Excel : Quantité * PrixUnit * (1 - Remise)
    cell_tot = ws.cell(row=row_idx, column=6, value=f"=C{row_idx}*D{row_idx}*(1-E{row_idx})")
    cell_tot.number_format = '#,##0.00'
    cell_tot.alignment = Alignment(horizontal="right")
    cell_tot.font = font_bold
    
    # Alternance de couleurs
    fill = gris_clair if row_idx % 2 == 0 else PatternFill(fill_type=None)
    for c in range(1, 7):
        cell_c = ws.cell(row=row_idx, column=c)
        if fill.fill_type: cell_c.fill = fill
        cell_c.border = border_box
        if c != 6: cell_c.font = font_normal
    ws.row_dimensions[row_idx].height = 20
    row_idx += 1

# 5. Bloc des Totaux & TVA
start_totaux = row_idx + 1

# Sous-Total HT
ws.cell(row=start_totaux, column=5, value="Sous-Total HT :").font = font_bold
ws.cell(row=start_totaux, column=5).alignment = Alignment(horizontal="right")
c_st = ws.cell(row=start_totaux, column=6, value=f"=SUM(F10:F{row_idx-1})")
c_st.font = font_bold
c_st.number_format = '#,##0.00'
c_st.border = border_box

# TVA 19%
ws.cell(row=start_totaux+1, column=5, value="TVA (19%) :").font = font_bold
ws.cell(row=start_totaux+1, column=5).alignment = Alignment(horizontal="right")
c_tva = ws.cell(row=start_totaux+1, column=6, value=f"=F{start_totaux}*0.19")
c_tva.font = font_bold
c_tva.number_format = '#,##0.00'
c_tva.border = border_box

# Total TTC Net à Payer
ws.cell(row=start_totaux+2, column=5, value="NET À PAYER TTC :").font = font_total
ws.cell(row=start_totaux+2, column=5).alignment = Alignment(horizontal="right")
ws.cell(row=start_totaux+2, column=5).fill = accent_fill
c_ttc = ws.cell(row=start_totaux+2, column=6, value=f"=F{start_totaux}+F{start_totaux+1}")
c_ttc.font = font_total
c_ttc.fill = accent_fill
c_ttc.number_format = '#,##0.00 DZD'
c_ttc.alignment = Alignment(horizontal="right")
c_ttc.border = Border(left=thin, right=thin, top=thin, bottom=thick_bottom)
ws.row_dimensions[start_totaux+2].height = 24

# 6. Ajustement auto des largeurs de colonnes
ws.column_dimensions['A'].width = 12
ws.column_dimensions['B'].width = 44
ws.column_dimensions['C'].width = 12
ws.column_dimensions['D'].width = 22
ws.column_dimensions['E'].width = 12
ws.column_dimensions['F'].width = 24

# 7. Sauvegarde
wb.save('facture_professionnelle.xlsx')
print("✅ Facture B2B 'facture_professionnelle.xlsx' générée avec succès !")
print("📊 Formules Excel appliquées pour le Sous-Total, la TVA 19% et le Net TTC.")`
    },

    kpi: {
        id: 'kpi',
        name: '📊 Dashboard Commercial & KPIs',
        badge: 'Marketing & Vente',
        category: 'Analytics',
        icon: BarChart3,
        description: 'Tableau de bord de performance avec objectifs, taux d’atteinte %, calcul automatique des commissions via formule IF, moyennes et totaux.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Dashboard_Ventes_2026"
ws.views.sheetView[0].showGridLines = True

# Styles
fond_header = PatternFill(start_color="0F766E", end_color="0F766E", fill_type="solid")
fond_kpi = PatternFill(start_color="CCFBF1", end_color="CCFBF1", fill_type="solid")
font_titre = Font(name="Segoe UI", size=15, bold=True, color="0F766E")
font_header = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
font_normal = Font(name="Segoe UI", size=10, color="1E293B")
font_bold = Font(name="Segoe UI", size=10, bold=True, color="0F172A")

thin = Side(border_style="thin", color="E2E8F0")
border_cell = Border(left=thin, right=thin, top=thin, bottom=thin)

# Titre
ws['A1'] = "PERFORMANCE COMMERCIALE & COMMISSIONS - EXERCICE 2026"
ws['A1'].font = font_titre
ws['A2'] = "Rapport consolidé par représentant commercial"
ws['A2'].font = Font(name="Segoe UI", size=10, italic=True, color="64748B")

# En-têtes
headers = ["Commercial", "Région", "Objectif (DZD)", "Réalisé (DZD)", "Taux Atteinte", "Statut", "Taux Comm.", "Commission (DZD)"]
for col_idx, h in enumerate(headers, 1):
    c = ws.cell(row=4, column=col_idx, value=h)
    c.font = font_header
    c.fill = fond_header
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = border_cell
ws.row_dimensions[4].height = 26

commerciaux = [
    ("Amine Mansouri", "Alger Centre", 1200000, 1450000),
    ("Karim Benali", "Oran Ouest", 950000, 890000),
    ("Sara Haddad", "Constantine Est", 1100000, 1320000),
    ("Yassine Bouzid", "Sétif & Bordj", 800000, 620000),
    ("Nadia Chaoui", "Blida & Sud", 1000000, 1050000),
    ("Reda Belkacem", "Annaba Littoral", 750000, 910000),
]

row = 5
for nom, reg, obj, real in commerciaux:
    ws.cell(row=row, column=1, value=nom).font = font_bold
    ws.cell(row=row, column=2, value=reg).font = font_normal
    
    c_obj = ws.cell(row=row, column=3, value=obj)
    c_obj.number_format = '#,##0'
    c_obj.alignment = Alignment(horizontal="right")
    
    c_real = ws.cell(row=row, column=4, value=real)
    c_real.number_format = '#,##0'
    c_real.alignment = Alignment(horizontal="right")
    c_real.font = font_bold
    
    # Formule Taux d'atteinte : Réalisé / Objectif
    c_taux = ws.cell(row=row, column=5, value=f"=D{row}/C{row}")
    c_taux.number_format = '0.0%'
    c_taux.alignment = Alignment(horizontal="center")
    
    # Formule Statut conditionnel : IF >= 100%
    c_stat = ws.cell(row=row, column=6, value=f'=IF(E{row}>=1, "⭐ DÉPASSÉ", IF(E{row}>=0.8, "✅ ATTEINT", "⚠️ RETARD"))')
    c_stat.alignment = Alignment(horizontal="center")
    
    # Taux commission : 8% si dépassé, 4% sinon
    c_tcomm = ws.cell(row=row, column=7, value=f'=IF(E{row}>=1, 0.08, 0.04)')
    c_tcomm.number_format = '0.0%'
    c_tcomm.alignment = Alignment(horizontal="center")
    
    # Montant Commission : Réalisé * Taux commission
    c_comm = ws.cell(row=row, column=8, value=f'=D{row}*G{row}')
    c_comm.number_format = '#,##0'
    c_comm.alignment = Alignment(horizontal="right")
    c_comm.font = font_bold
    
    for c in range(1, 9):
        ws.cell(row=row, column=c).border = border_cell
    row += 1

# Ligne Totaux
ws.cell(row=row, column=1, value="TOTAL GÉNÉRAL").font = font_bold
ws.cell(row=row, column=3, value=f"=SUM(C5:C{row-1})").number_format = '#,##0'
ws.cell(row=row, column=4, value=f"=SUM(D5:D{row-1})").number_format = '#,##0'
ws.cell(row=row, column=5, value=f"=AVERAGE(E5:E{row-1})").number_format = '0.0%'
ws.cell(row=row, column=6, value="-").alignment = Alignment(horizontal="center")
ws.cell(row=row, column=7, value="-").alignment = Alignment(horizontal="center")
ws.cell(row=row, column=8, value=f"=SUM(H5:H{row-1})").number_format = '#,##0'

for c in range(1, 9):
    cell_tot = ws.cell(row=row, column=c)
    cell_tot.fill = fond_kpi
    cell_tot.font = font_bold
    cell_tot.border = Border(top=Side(style="medium", color="0F766E"), bottom=Side(style="double", color="0F766E"))

# Largeurs colonnes
widths = {'A': 22, 'B': 18, 'C': 16, 'D': 16, 'E': 14, 'F': 16, 'G': 14, 'H': 18}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

wb.save('dashboard_kpi_ventes.xlsx')
print("✅ Dashboard commercial 'dashboard_kpi_ventes.xlsx' généré !")
print("📈 Formules : ratios %, conditions IF pour statut et bonus de commission.")`
    },

    stock: {
        id: 'stock',
        name: '📦 Stock & Alertes Réappro',
        badge: 'Logistique / Magasin',
        category: 'Gestion',
        icon: Package,
        description: 'Suivi des stocks avec calcul de valeur globale, formule d’alerte automatique "RECOMMANDER / OK" et formatage dynamique.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Inventaire_Magasin"
ws.views.sheetView[0].showGridLines = True

# Styles
fill_hdr = PatternFill(start_color="C2410C", end_color="C2410C", fill_type="solid")
fill_tot = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid")
font_titre = Font(name="Arial", size=14, bold=True, color="C2410C")
font_hdr = Font(name="Arial", size=10, bold=True, color="FFFFFF")
font_bold = Font(name="Arial", size=10, bold=True, color="18181B")
font_txt = Font(name="Arial", size=10, color="27272A")

thin = Side(border_style="thin", color="D4D4D8")
border_all = Border(left=thin, right=thin, top=thin, bottom=thin)

ws['A1'] = "ÉTAT D'INVENTAIRE & GESTION DES STOCKS"
ws['A1'].font = font_titre
ws['A2'] = "Mise à jour automatique par script Python"
ws['A2'].font = Font(name="Arial", size=9, italic=True, color="71717A")

headers = ["Code SKU", "Désignation Produit", "Rayon", "Stock Actuel", "Seuil Mini", "Prix Achat (DZD)", "Valeur Stock", "Statut / Alerte"]
for idx, h in enumerate(headers, 1):
    c = ws.cell(row=4, column=idx, value=h)
    c.font = font_hdr
    c.fill = fill_hdr
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = border_all
ws.row_dimensions[4].height = 25

articles = [
    ("SKU-1001", "Ordinateur Portable Pro i7", "Informatique", 4, 10, 125000),
    ("SKU-1002", "Écran 27 pouces 4K UHD", "Informatique", 18, 8, 42000),
    ("SKU-1003", "Souris Ergonomique Sans Fil", "Périphérique", 65, 20, 3500),
    ("SKU-1004", "Clavier Mécanique RGB", "Périphérique", 9, 15, 7800),
    ("SKU-1005", "Disque SSD NVMe 1To", "Composants", 32, 10, 11500),
    ("SKU-1006", "Câble HDMI 2.1 Tressé 2m", "Connectique", 3, 25, 1200),
    ("SKU-1007", "Serveur NAS 4 Baies Synology", "Réseau", 2, 5, 89000),
]

row = 5
for sku, nom, cat, qte, seuil, prix in articles:
    ws.cell(row=row, column=1, value=sku).alignment = Alignment(horizontal="center")
    ws.cell(row=row, column=2, value=nom).alignment = Alignment(horizontal="left")
    ws.cell(row=row, column=3, value=cat).alignment = Alignment(horizontal="center")
    
    c_qte = ws.cell(row=row, column=4, value=qte)
    c_qte.alignment = Alignment(horizontal="center")
    c_qte.font = font_bold
    
    ws.cell(row=row, column=5, value=seuil).alignment = Alignment(horizontal="center")
    
    c_prix = ws.cell(row=row, column=6, value=prix)
    c_prix.number_format = '#,##0'
    c_prix.alignment = Alignment(horizontal="right")
    
    # Formule : Valeur Stock = Quantité * Prix
    c_val = ws.cell(row=row, column=7, value=f"=D{row}*F{row}")
    c_val.number_format = '#,##0'
    c_val.alignment = Alignment(horizontal="right")
    c_val.font = font_bold
    
    # Formule Alerte : IF(Stock <= Seuil, "🚨 COMMANDE URGENTE", "🟢 STOCK OK")
    c_alt = ws.cell(row=row, column=8, value=f'=IF(D{row}<=E{row}, "🚨 COMMANDE REQUISE", "🟢 STOCK OK")')
    c_alt.alignment = Alignment(horizontal="center")
    c_alt.font = font_bold
    
    for col in range(1, 9):
        ws.cell(row=row, column=col).border = border_all
    row += 1

# Ligne de synthèse
ws.cell(row=row, column=1, value="VALEUR TOTALE DU MAGASIN").font = font_bold
ws.cell(row=row, column=4, value=f"=SUM(D5:D{row-1})").alignment = Alignment(horizontal="center")
ws.cell(row=row, column=7, value=f"=SUM(G5:G{row-1})").number_format = '#,##0 DZD'

for col in range(1, 9):
    c_t = ws.cell(row=row, column=col)
    c_t.fill = fill_tot
    c_t.font = font_bold
    c_t.border = Border(top=Side(style="medium", color="C2410C"), bottom=Side(style="double", color="C2410C"))

widths = {'A': 14, 'B': 32, 'C': 16, 'D': 14, 'E': 14, 'F': 18, 'G': 18, 'H': 24}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

wb.save('gestion_stock_alertes.xlsx')
print("✅ Inventaire 'gestion_stock_alertes.xlsx' généré !")
print("📦 Détection automatique des produits sous le seuil de sécurité.")`
    },

    paie: {
        id: 'paie',
        name: '💰 Fiche de Paie & Salaires',
        badge: 'Ressources Humaines',
        category: 'RH',
        icon: Users,
        description: 'Grille mensuelle des salaires avec calcul automatique du Brut, Cotisations sociales (CNAS 9%), Impôt IRG (10%) et Net à payer.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Paie_Mois_2026"
ws.views.sheetView[0].showGridLines = True

# Styles
fill_hdr = PatternFill(start_color="4338CA", end_color="4338CA", fill_type="solid")
fill_tot = PatternFill(start_color="EEF2FF", end_color="EEF2FF", fill_type="solid")
font_titre = Font(name="Calibri", size=15, bold=True, color="4338CA")
font_hdr = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
font_bold = Font(name="Calibri", size=10, bold=True, color="1E1B4B")
font_txt = Font(name="Calibri", size=10, color="312E81")

thin = Side(border_style="thin", color="C7D2FE")
border_all = Border(left=thin, right=thin, top=thin, bottom=thin)

ws['A1'] = "ÉTAT RÉCAPITULATIF DE LA PAIE DU PERSONNEL"
ws['A1'].font = font_titre
ws['A2'] = "Période : Mois en cours | Devise : Dinar Algérien (DZD)"
ws['A2'].font = Font(name="Calibri", size=10, italic=True, color="6B7280")

headers = ["Matricule", "Nom & Prénom", "Département", "Salaire Base", "Primes & H.Sup", "Salaire Brut", "CNAS (9%)", "IRG (10%)", "NET À PAYER"]
for idx, h in enumerate(headers, 1):
    c = ws.cell(row=4, column=idx, value=h)
    c.font = font_hdr
    c.fill = fill_hdr
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = border_all
ws.row_dimensions[4].height = 26

salaries = [
    ("EMP-001", "Mohamed Brahimi", "Direction Technique", 95000, 22000),
    ("EMP-002", "Fatima Zohra Kaci", "Ressources Humaines", 75000, 8000),
    ("EMP-003", "Samir Boualem", "Développement Web", 85000, 15000),
    ("EMP-004", "Leila Meziane", "Marketing & Design", 68000, 9500),
    ("EMP-005", "Khaled Ouali", "Comptabilité & Finance", 80000, 12000),
]

row = 5
for mat, nom, dep, sbase, prime in salaries:
    ws.cell(row=row, column=1, value=mat).alignment = Alignment(horizontal="center")
    ws.cell(row=row, column=2, value=nom).font = font_bold
    ws.cell(row=row, column=3, value=dep).font = font_txt
    
    ws.cell(row=row, column=4, value=sbase).number_format = '#,##0'
    ws.cell(row=row, column=5, value=prime).number_format = '#,##0'
    
    # Formule Brut = Base + Primes
    c_brut = ws.cell(row=row, column=6, value=f"=D{row}+E{row}")
    c_brut.number_format = '#,##0'
    c_brut.font = font_bold
    c_brut.alignment = Alignment(horizontal="right")
    
    # Formule CNAS = Brut * 9%
    c_cnas = ws.cell(row=row, column=7, value=f"=F{row}*0.09")
    c_cnas.number_format = '#,##0'
    c_cnas.alignment = Alignment(horizontal="right")
    
    # Formule IRG = Brut * 10%
    c_irg = ws.cell(row=row, column=8, value=f"=F{row}*0.10")
    c_irg.number_format = '#,##0'
    c_irg.alignment = Alignment(horizontal="right")
    
    # Formule Net = Brut - CNAS - IRG
    c_net = ws.cell(row=row, column=9, value=f"=F{row}-G{row}-H{row}")
    c_net.number_format = '#,##0'
    c_net.font = font_bold
    c_net.alignment = Alignment(horizontal="right")
    
    for c in range(1, 10):
        ws.cell(row=row, column=c).border = border_all
    row += 1

# Ligne Totaux
ws.cell(row=row, column=1, value="MASSE SALARIALE TOTALE").font = font_bold
for col_letter, c_num in [('D', 4), ('E', 5), ('F', 6), ('G', 7), ('H', 8), ('I', 9)]:
    c_tot = ws.cell(row=row, column=c_num, value=f"=SUM({col_letter}5:{col_letter}{row-1})")
    c_tot.number_format = '#,##0'
    c_tot.font = font_bold

for col in range(1, 10):
    c_t = ws.cell(row=row, column=col)
    c_t.fill = fill_tot
    c_t.border = Border(top=Side(style="medium", color="4338CA"), bottom=Side(style="double", color="4338CA"))

widths = {'A': 14, 'B': 24, 'C': 24, 'D': 16, 'E': 16, 'F': 16, 'G': 14, 'H': 14, 'I': 18}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

wb.save('fiche_paie_salaires.xlsx')
print("✅ Fiche de paie 'fiche_paie_salaires.xlsx' générée avec succès !")
print("💵 Calculs automatisés : Brut, Cotisations sociales, Retenues et Salaires Nets.")`
    },

    multifeuille: {
        id: 'multifeuille',
        name: '📈 Multi-Feuilles & Consolidation',
        badge: 'Avancé / Multi-onglets',
        category: 'Automatisation',
        icon: Layers,
        description: 'Génération d’un classeur Excel à 3 onglets distincts (Janvier, Février, Synthèse Annuelle) avec formules inter-feuilles.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()

# Feuille 1 : Janvier
ws1 = wb.active
ws1.title = "Janvier_2026"
ws1.views.sheetView[0].showGridLines = True

# Feuille 2 : Février
ws2 = wb.create_sheet(title="Fevrier_2026")
ws2.views.sheetView[0].showGridLines = True

# Feuille 3 : Synthèse
ws3 = wb.create_sheet(title="Synthese_Consolidee")
ws3.views.sheetView[0].showGridLines = True

# Styles
f_hdr = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
f_syn = PatternFill(start_color="475569", end_color="475569", fill_type="solid")
font_hdr = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
font_bold = Font(name="Calibri", size=11, bold=True)
font_titre = Font(name="Calibri", size=14, bold=True, color="0F172A")

produits = [
    ("Abonnements SaaS", 450000, 520000),
    ("Prestations de Conseil", 320000, 290000),
    ("Formations Entreprises", 180000, 240000),
    ("Développement Sur Mesure", 650000, 710000),
]

# Remplissage Feuille 1 (Janvier)
ws1['A1'] = "VENTES DU MOIS DE JANVIER"
ws1['A1'].font = font_titre
ws1['A3'] = "Catégorie de Service"; ws1['B3'] = "Chiffre d'Affaires (DZD)"
ws1['A3'].font = font_hdr; ws1['A3'].fill = f_hdr
ws1['B3'].font = font_hdr; ws1['B3'].fill = f_hdr

for i, (prod, ca_jan, _) in enumerate(produits, 4):
    ws1.cell(row=i, column=1, value=prod)
    c = ws1.cell(row=i, column=2, value=ca_jan)
    c.number_format = '#,##0'

# Remplissage Feuille 2 (Février)
ws2['A1'] = "VENTES DU MOIS DE FÉVRIER"
ws2['A1'].font = font_titre
ws2['A3'] = "Catégorie de Service"; ws2['B3'] = "Chiffre d'Affaires (DZD)"
ws2['A3'].font = font_hdr; ws2['A3'].fill = f_hdr

for i, (prod, _, ca_fev) in enumerate(produits, 4):
    ws2.cell(row=i, column=1, value=prod)
    c = ws2.cell(row=i, column=2, value=ca_fev)
    c.number_format = '#,##0'

# Remplissage Feuille 3 (Synthèse avec formules qui pointent vers les autres feuilles)
ws3['A1'] = "SYNTHÈSE CONSOLIDÉE DES REVENUS (Q1)"
ws3['A1'].font = font_titre

headers_syn = ["Catégorie", "Janvier (DZD)", "Février (DZD)", "Cumul Bimestre", "Évolution %"]
for col_idx, h in enumerate(headers_syn, 1):
    c = ws3.cell(row=3, column=col_idx, value=h)
    c.font = font_hdr
    c.fill = f_syn
    c.alignment = Alignment(horizontal="center")

for i in range(4, 4 + len(produits)):
    # Référence directe au nom du produit
    ws3.cell(row=i, column=1, value=f"=Janvier_2026!A{i}")
    
    # Formules inter-feuilles
    c_jan = ws3.cell(row=i, column=2, value=f"=Janvier_2026!B{i}")
    c_jan.number_format = '#,##0'
    
    c_fev = ws3.cell(row=i, column=3, value=f"=Fevrier_2026!B{i}")
    c_fev.number_format = '#,##0'
    
    c_cum = ws3.cell(row=i, column=4, value=f"=B{i}+C{i}")
    c_cum.number_format = '#,##0'
    c_cum.font = font_bold
    
    c_evo = ws3.cell(row=i, column=5, value=f"=(C{i}-B{i})/B{i}")
    c_evo.number_format = '+0.0%;-0.0%;0.0%'
    c_evo.alignment = Alignment(horizontal="center")

# Largeurs
for ws in [ws1, ws2, ws3]:
    ws.column_dimensions['A'].width = 30
    ws.column_dimensions['B'].width = 24
    if ws == ws3:
        ws.column_dimensions['C'].width = 24
        ws.column_dimensions['D'].width = 24
        ws.column_dimensions['E'].width = 16

wb.save('consolidation_multifeuilles.xlsx')
print("✅ Classeur 3 onglets 'consolidation_multifeuilles.xlsx' généré !")
print("📑 Onglets créés : Janvier_2026, Fevrier_2026, Synthese_Consolidee avec formules croisées.")`
    },

    datacleaning: {
        id: 'datacleaning',
        name: '🧹 Nettoyage & Data Cleaning',
        badge: 'Data Processing',
        category: 'Transformation',
        icon: Filter,
        description: 'Standardisation de données brutes : nettoyage des espaces parasites, correction des majuscules, standardisation des téléphones (+213) et dates.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Clients_Nettoyes"
ws.views.sheetView[0].showGridLines = True

# Données brutes "sales" courantes dans les entreprises
raw_data = [
    ("  amine  mansouri ", "amine.mansouri@GMAIL.COM", "0550123456", "  alger ", "12500.5"),
    ("KARIM BENALI", "karim_benali@yahoo.fr ", "0661 98 76 54", "oran", "8900"),
    (" sara  haddad", "SARA.H@HOTMAIL.COM", "+213 770 11 22 33", " constantine", "45000.75"),
    ("yassine bouzid ", "yassine@societe.dz", "0541-22-33-44", "Setif", "18300"),
    ("  Nadia   Chaoui  ", "nadia.chaoui@ENTREPRISE.COM ", "0662334455", "BLIDA", "32100"),
]

# Style
fill_clean = PatternFill(start_color="065F46", end_color="065F46", fill_type="solid")
font_hdr = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
font_bold = Font(name="Segoe UI", size=10, bold=True)
font_norm = Font(name="Segoe UI", size=10)

ws['A1'] = "BASE CLIENTS STANDARDISÉE & NETTOYÉE VIA PYTHON"
ws['A1'].font = Font(name="Segoe UI", size=14, bold=True, color="065F46")
ws['A2'] = "Automatisé avec fonctions Python (strip, title, lower, regex formatting)"
ws['A2'].font = Font(name="Segoe UI", size=9, italic=True, color="6B7280")

headers = ["ID", "Nom & Prénom Propre", "Email Standardisé", "Téléphone Formaté (+213)", "Ville", "Total Commandes (DZD)", "Statut Validation"]
for idx, h in enumerate(headers, 1):
    c = ws.cell(row=4, column=idx, value=h)
    c.font = font_hdr
    c.fill = fill_clean
    c.alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[4].height = 25

# Traitement & nettoyage
for idx, (raw_nom, raw_email, raw_tel, raw_ville, raw_total) in enumerate(raw_data, 1):
    row = 4 + idx
    
    # 1. Nettoyer Nom : retirer doubles espaces et mettre en Title Case
    nom_propre = " ".join(raw_nom.strip().split()).title()
    
    # 2. Nettoyer Email : strip + lowercase
    email_propre = raw_email.strip().lower()
    
    # 3. Nettoyer Téléphone : garder uniquement les chiffres et formater en +213
    chiffres = "".join(filter(str.isdigit, raw_tel))
    if chiffres.startswith("213"):
        tel_propre = f"+213 (0) {chiffres[3:5]} {chiffres[5:7]} {chiffres[7:9]} {chiffres[9:]}"
    elif chiffres.startswith("0"):
        tel_propre = f"+213 (0) {chiffres[1:3]} {chiffres[3:5]} {chiffres[5:7]} {chiffres[7:]}"
    else:
        tel_propre = chiffres
        
    # 4. Ville propre
    ville_propre = raw_ville.strip().capitalize()
    
    # 5. Montant float
    total_float = float(raw_total.strip())
    
    ws.cell(row=row, column=1, value=f"CLT-{idx:03d}").alignment = Alignment(horizontal="center")
    ws.cell(row=row, column=2, value=nom_propre).font = font_bold
    ws.cell(row=row, column=3, value=email_propre).font = font_norm
    ws.cell(row=row, column=4, value=tel_propre).alignment = Alignment(horizontal="center")
    ws.cell(row=row, column=5, value=ville_propre).alignment = Alignment(horizontal="center")
    
    c_tot = ws.cell(row=row, column=6, value=total_float)
    c_tot.number_format = '#,##0.00'
    c_tot.alignment = Alignment(horizontal="right")
    
    c_ok = ws.cell(row=row, column=7, value="✅ CONFORME")
    c_ok.alignment = Alignment(horizontal="center")
    c_ok.font = Font(name="Segoe UI", size=9, bold=True, color="065F46")

widths = {'A': 10, 'B': 24, 'C': 30, 'D': 24, 'E': 16, 'F': 24, 'G': 18}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

wb.save('clients_nettoyes.xlsx')
print("✅ Fichier nettoyé 'clients_nettoyes.xlsx' généré !")
print("🧹 Données normalisées : noms propres, emails en minuscules, numéros +213.")`
    },

    xlookup_pro: {
        id: 'xlookup_pro',
        name: '🔍 RECHERCHEX & Rapprochement',
        badge: 'Formules Pro / XLOOKUP',
        category: 'Formules Avancées',
        icon: Search,
        description: 'Rapprochement automatisé entre une table de commandes et un catalogue articles avec les formules RECHERCHEX (XLOOKUP) et calcul de marge par formule.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Rapprochement_Commandes"
ws.views.sheetView[0].showGridLines = True

# Styles
f_cat = PatternFill(start_color="1E3A8A", fill_type="solid")
f_cmd = PatternFill(start_color="065F46", fill_type="solid")
f_calc = PatternFill(start_color="047857", fill_type="solid")
font_titre = Font(name="Calibri", size=14, bold=True, color="1E3A8A")
font_hdr = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
font_bold = Font(name="Calibri", size=10, bold=True)
font_norm = Font(name="Calibri", size=10)

thin = Side(border_style="thin", color="CBD5E1")
border_cell = Border(left=thin, right=thin, top=thin, bottom=thin)

ws['A1'] = "TABLEAU DE BORD : RAPPROCHEMENT PAR FORMULE RECHERCHEX (XLOOKUP)"
ws['A1'].font = font_titre

# 1. TABLE SOURCE : CATALOGUE DE RÉFÉRENCE (Colonnes A à C)
ws['A3'] = "CATALOGUE ARTICLES (SOURCE)"
ws['A3'].font = Font(name="Calibri", size=11, bold=True, color="1E3A8A")

headers_cat = ["Réf Article", "Désignation Produit", "Prix Unitaire HT"]
for i, h in enumerate(headers_cat, 1):
    c = ws.cell(row=4, column=i, value=h)
    c.font = font_hdr; c.fill = f_cat; c.alignment = Alignment(horizontal="center"); c.border = border_cell

catalogue = [
    ("ART-101", "Serveur Dell PowerEdge T150", 230000),
    ("ART-102", "Licence Microsoft 365 Business", 36000),
    ("ART-103", "Routeur Cisco Gigabit VPN", 59000),
    ("ART-104", "Bobine Câble RJ45 Cat6 305m", 18000),
    ("ART-105", "Onduleur APC Smart-UPS 1500VA", 89000),
]

for idx, (ref, desig, pu) in enumerate(catalogue, 5):
    ws.cell(row=idx, column=1, value=ref).alignment = Alignment(horizontal="center")
    ws.cell(row=idx, column=2, value=desig)
    c_pu = ws.cell(row=idx, column=3, value=pu)
    c_pu.number_format = '#,##0 DZD'
    c_pu.alignment = Alignment(horizontal="right")
    for col in range(1, 4):
        ws.cell(row=idx, column=col).border = border_cell

# 2. TABLE COMMANDES AVEC FORMULES D'ENRICHISSEMENT (Colonnes E à I)
ws['E3'] = "COMMANDES CLIENTS AVEC RAPPROCHEMENT AUTOMATIQUE"
ws['E3'].font = Font(name="Calibri", size=11, bold=True, color="065F46")

headers_cmd = ["N° Cmd", "Réf Commandée", "Qté", "Désignation (RECHERCHEX)", "Total HT (Formule)"]
for i, h in enumerate(headers_cmd, 5):
    c = ws.cell(row=4, column=i, value=h)
    c.font = font_hdr; c.fill = f_cmd; c.alignment = Alignment(horizontal="center"); c.border = border_cell

commandes = [
    ("CMD-2026-01", "ART-103", 3),
    ("CMD-2026-02", "ART-101", 1),
    ("CMD-2026-03", "ART-105", 2),
    ("CMD-2026-04", "ART-102", 5),
    ("CMD-2026-05", "ART-104", 10),
]

for idx, (n_cmd, ref, qte) in enumerate(commandes, 5):
    ws.cell(row=idx, column=5, value=n_cmd).alignment = Alignment(horizontal="center")
    ws.cell(row=idx, column=6, value=ref).alignment = Alignment(horizontal="center")
    ws.cell(row=idx, column=7, value=qte).alignment = Alignment(horizontal="center")
    
    # FORMULE 1 : XLOOKUP pour trouver la désignation depuis le catalogue A5:C9
    c_des = ws.cell(row=idx, column=8, value=f'=XLOOKUP(F{idx}, A$5:A$9, B$5:B$9, "Réf Inconnue", 0)')
    c_des.font = font_bold
    
    # FORMULE 2 : Qté * XLOOKUP pour chercher le Prix Unitaire et calculer le total
    c_tot = ws.cell(row=idx, column=9, value=f'=G{idx}*XLOOKUP(F{idx}, A$5:A$9, C$5:C$9, 0, 0)')
    c_tot.number_format = '#,##0 DZD'
    c_tot.font = font_bold
    c_tot.alignment = Alignment(horizontal="right")
    
    for col in range(5, 10):
        ws.cell(row=idx, column=col).border = border_cell

# Ligne de Total Général par formule SUM
ws.cell(row=11, column=8, value="TOTAL GÉNÉRAL VENTES :").font = Font(bold=True)
ws.cell(row=11, column=8).alignment = Alignment(horizontal="right")
c_g = ws.cell(row=11, column=9, value="=SUM(I5:I9)")
c_g.font = Font(bold=True, color="065F46", size=11)
c_g.number_format = '#,##0 DZD'
c_g.alignment = Alignment(horizontal="right")
c_g.border = Border(top=thin, bottom=Side(style="double", color="065F46"))

widths = {'A': 14, 'B': 30, 'C': 18, 'D': 4, 'E': 14, 'F': 16, 'G': 10, 'H': 32, 'I': 22}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

wb.save('rapprochement_xlookup.xlsx')
print("✅ Classeur 'rapprochement_xlookup.xlsx' généré avec succès !")
print("🔍 Formules RECHERCHEX / XLOOKUP appliquées sans rupture de lien.")`
    },

    kpi_multicriteres: {
        id: 'kpi_multicriteres',
        name: '🧮 SOMME.SI.ENS & Multi-Critères',
        badge: 'Finance / Contrôle',
        category: 'Formules Avancées',
        icon: Calculator,
        description: 'Agrégation avancée de données volumineuses avec SOMME.SI.ENS, NB.SI.ENS et calcul conditionnel des alertes de stock.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Synthese_Multicriteres"
ws.views.sheetView[0].showGridLines = True

# Styles
f_head = PatternFill(start_color="312E81", fill_type="solid")
f_kpi = PatternFill(start_color="4338CA", fill_type="solid")
font_titre = Font(name="Segoe UI", size=14, bold=True, color="312E81")
font_hdr = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
font_bold = Font(name="Segoe UI", size=10, bold=True)
font_norm = Font(name="Segoe UI", size=10)

thin = Side(border_style="thin", color="E2E8F0")
border_cell = Border(left=thin, right=thin, top=thin, bottom=thin)

ws['A1'] = "CONSOLIDATION FINANCIÈRE & ANALYSE MULTI-CRITÈRES (SOMME.SI.ENS)"
ws['A1'].font = font_titre

# 1. Base des Ventes
headers_base = ["Date", "Agence", "Catégorie", "Commercial", "Montant HT (DZD)", "Statut"]
for col_num, h in enumerate(headers_base, 1):
    c = ws.cell(row=3, column=col_num, value=h)
    c.font = font_hdr; c.fill = f_head; c.alignment = Alignment(horizontal="center"); c.border = border_cell

ventes = [
    ("12/08/2026", "Alger", "Matériel", "Amine M.", 450000, "Validé"),
    ("13/08/2026", "Oran", "Logiciel", "Karim B.", 120000, "Validé"),
    ("14/08/2026", "Alger", "Réseau", "Amine M.", 280000, "Validé"),
    ("15/08/2026", "Constantine", "Matériel", "Sara H.", 310000, "En Attente"),
    ("16/08/2026", "Alger", "Logiciel", "Nadia C.", 95000, "Validé"),
    ("17/08/2026", "Oran", "Matériel", "Karim B.", 540000, "Validé"),
    ("18/08/2026", "Alger", "Matériel", "Amine M.", 620000, "Validé"),
]

for idx, (dt, ag, cat, com, mnt, st) in enumerate(ventes, 4):
    ws.cell(row=idx, column=1, value=dt).alignment = Alignment(horizontal="center")
    ws.cell(row=idx, column=2, value=ag).alignment = Alignment(horizontal="center")
    ws.cell(row=idx, column=3, value=cat)
    ws.cell(row=idx, column=4, value=com)
    c_m = ws.cell(row=idx, column=5, value=mnt)
    c_m.number_format = '#,##0'
    c_m.alignment = Alignment(horizontal="right")
    ws.cell(row=idx, column=6, value=st).alignment = Alignment(horizontal="center")
    for c in range(1, 7): ws.cell(row=idx, column=c).border = border_cell

# 2. TABLEAU RÉCAPITULATIF CROISÉ PAR FORMULES AUTOMATIQUES
ws['H3'] = "AGRÉGATION PAR FORMULES DYNAMIQUES"
ws['H3'].font = Font(name="Segoe UI", size=11, bold=True, color="312E81")

headers_kpi = ["Agence", "Catégorie", "Total Validé (SOMME.SI.ENS)", "Nb Ventes (NB.SI.ENS)"]
for col_num, h in enumerate(headers_kpi, 8):
    c = ws.cell(row=4, column=col_num, value=h)
    c.font = font_hdr; c.fill = f_kpi; c.alignment = Alignment(horizontal="center"); c.border = border_cell

criteres = [
    ("Alger", "Matériel"),
    ("Alger", "Logiciel"),
    ("Alger", "Réseau"),
    ("Oran", "Matériel"),
    ("Oran", "Logiciel"),
]

for idx, (ag, cat) in enumerate(criteres, 5):
    ws.cell(row=idx, column=8, value=ag).alignment = Alignment(horizontal="center")
    ws.cell(row=idx, column=9, value=cat)
    
    # Formule SOMME.SI.ENS : Plage Somme E4:E10 si Agence B=H et Catégorie C=I et Statut F="Validé"
    c_sum = ws.cell(row=idx, column=10, value=f'=SUMIFS(E$4:E$10, B$4:B$10, H{idx}, C$4:C$10, I{idx}, F$4:F$10, "Validé")')
    c_sum.number_format = '#,##0 DZD'
    c_sum.alignment = Alignment(horizontal="right")
    c_sum.font = font_bold
    
    # Formule NB.SI.ENS : Nombre de transactions correspondantes
    c_cnt = ws.cell(row=idx, column=11, value=f'=COUNTIFS(B$4:B$10, H{idx}, C$4:C$10, I{idx}, F$4:F$10, "Validé")')
    c_cnt.alignment = Alignment(horizontal="center")
    c_cnt.font = font_bold
    
    for c in range(8, 12): ws.cell(row=idx, column=c).border = border_cell

widths = {'A': 14, 'B': 14, 'C': 16, 'D': 18, 'E': 18, 'F': 14, 'G': 4, 'H': 14, 'I': 16, 'J': 24, 'K': 20}
for col, w in widths.items(): ws.column_dimensions[col].width = w

wb.save('synthese_multicriteres.xlsx')
print("✅ Classeur 'synthese_multicriteres.xlsx' généré !")
print("📊 Formules SOMME.SI.ENS (SUMIFS) et NB.SI.ENS (COUNTIFS) calculées en temps réel.")`
    },

    libre: {
        id: 'libre',
        name: '⚡ Atelier Libre (Sandbox)',
        badge: 'Bac à sable',
        category: 'Custom',
        icon: Sparkles,
        description: 'Éditeur vierge avec template openpyxl minimaliste pour créer vos propres scripts d’automatisation Excel.',
        code: `import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment

# 1. Créer un classeur
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "MonProjet"

# 2. Vos données et personnalisations
ws['A1'] = "PROJET D'AUTOMATISATION EXCEL"
ws['A1'].font = Font(size=14, bold=True, color="1E3A8A")

ws['A3'] = "Article"
ws['B3'] = "Quantité"
ws['C3'] = "Prix"
ws['D3'] = "Total"

for col in ['A', 'B', 'C', 'D']:
    ws[col + '3'].font = Font(bold=True, color="FFFFFF")
    ws[col + '3'].fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")

donnees = [
    ("Produit A", 10, 1500),
    ("Produit B", 5, 3200),
    ("Produit C", 25, 450),
]

for row_idx, (nom, qte, pu) in enumerate(donnees, 4):
    ws.cell(row=row_idx, column=1, value=nom)
    ws.cell(row=row_idx, column=2, value=qte)
    ws.cell(row=row_idx, column=3, value=pu)
    ws.cell(row=row_idx, column=4, value=f"=B{row_idx}*C{row_idx}")

# Total
ws.cell(row=7, column=3, value="Total Général :").font = Font(bold=True)
ws.cell(row=7, column=4, value="=SUM(D4:D6)").font = Font(bold=True)

# 3. Sauvegarder
wb.save('mon_fichier_excel.xlsx')
print("✅ Fichier Excel généré avec succès !")`
    }
};

// Singleton Pyodide
let pyodidePromise = null;
async function getPyodide(setStatus) {
    if (pyodidePromise) return pyodidePromise;

    pyodidePromise = (async () => {
        setStatus('Chargement du moteur Python (WebAssembly)...');
        await new Promise((resolve, reject) => {
            if (window.loadPyodide) return resolve();
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        const pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
        });

        setStatus('Installation des modules openpyxl & pandas...');
        await pyodide.loadPackage('micropip');
        const micropip = pyodide.pyimport('micropip');
        await micropip.install('openpyxl');
        setStatus('Environnement Python & Excel prêt !');
        return pyodide;
    })();

    return pyodidePromise;
}

export default function PythonExcelGenerator({ config }) {
    // Parser config si présent
    let initialTemplate = 'facture';
    let initialCustomCode = null;
    let initialTitle = null;

    if (config) {
        try {
            if (typeof config === 'string') {
                const parsed = JSON.parse(config.trim());
                if (parsed.template && EXCEL_TEMPLATES[parsed.template]) initialTemplate = parsed.template;
                if (parsed.code) initialCustomCode = parsed.code;
                if (parsed.title) initialTitle = parsed.title;
            } else if (typeof config === 'object') {
                if (config.template && EXCEL_TEMPLATES[config.template]) initialTemplate = config.template;
                if (config.code) initialCustomCode = config.code;
                if (config.title) initialTitle = config.title;
            }
        } catch (_) {}
    }

    const [selectedTemplateKey, setSelectedTemplateKey] = useState(initialTemplate);
    const [code, setCode] = useState(initialCustomCode || EXCEL_TEMPLATES[initialTemplate]?.code || EXCEL_TEMPLATES.facture.code);
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const [running, setRunning] = useState(false);
    const [ready, setReady] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [activeViewTab, setActiveViewTab] = useState('grid'); // 'grid' | 'console' | 'guide'
    const [copied, setCopied] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Ergonomie et lisibilité du code Python (Monaco Editor Pro)
    const [editorFontSize, setEditorFontSize] = useState(14);
    const [editorTheme, setEditorTheme] = useState('vs-dark'); // 'vs-dark' | 'hc-black' | 'vs'
    const [editorWordWrap, setEditorWordWrap] = useState('on'); // 'on' | 'off'
    const [editorMinimap, setEditorMinimap] = useState(false);
    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
    const editorRef = useRef(null);

    // Zoom avant / arrière police de code
    const handleZoomIn = () => setEditorFontSize(s => Math.min(24, s + 1));
    const handleZoomOut = () => setEditorFontSize(s => Math.max(11, s - 1));
    const handleToggleWrap = () => setEditorWordWrap(w => (w === 'on' ? 'off' : 'on'));
    const handleToggleMinimap = () => setEditorMinimap(m => !m);
    const handleCycleTheme = () => {
        setEditorTheme(curr => {
            if (curr === 'vs-dark') return 'hc-black';
            if (curr === 'hc-black') return 'vs';
            return 'vs-dark';
        });
    };

    // Insérer un snippet à la position du curseur
    const insertSnippet = (snippetText) => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const selection = editor.getSelection();
            const op = {
                range: selection,
                text: snippetText,
                forceMoveMarkers: true
            };
            editor.executeEdits('snippet', [op]);
            editor.focus();
        } else {
            setCode(prev => prev + '\n' + snippetText);
        }
    };

    // Quitter le plein écran avec la touche Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        // Bloquer le scroll du body en plein écran
        if (isFullscreen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);
    
    // État du tableur interactif parsé par SheetJS
    const [parsedWorkbook, setParsedWorkbook] = useState(null);
    const [activeSheetName, setActiveSheetName] = useState('');
    const [gridData, setGridData] = useState([]);
    const [selectedCellInfo, setSelectedCellInfo] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');

    const pyodideRef = useRef(null);
    const containerRef = useRef(null);

    // Initialiser Pyodide
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setStatus('Initialisation du moteur Python...');
                pyodideRef.current = await getPyodide(s => { if (!cancelled) setStatus(s); });
                if (!cancelled) setReady(true);
            } catch (e) {
                if (!cancelled) setError('Erreur de chargement Python : ' + e.message);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Changer de modèle
    const handleSelectTemplate = (templateKey) => {
        setSelectedTemplateKey(templateKey);
        const template = EXCEL_TEMPLATES[templateKey];
        if (template) {
            setCode(template.code);
            if (editorRef.current) {
                editorRef.current.setValue(template.code);
            }
            setOutput('');
            setError(null);
            setDownloadUrl(null);
            setParsedWorkbook(null);
            setGridData([]);
            setSelectedCellInfo(null);
        }
    };

    // Parser les octets du fichier Excel généré avec SheetJS
    const parseExcelBuffer = (bytes, filename) => {
        try {
            const wb = XLSX.read(bytes, { type: 'array', cellFormula: true, cellStyles: true });
            if (wb && wb.SheetNames && wb.SheetNames.length > 0) {
                setParsedWorkbook(wb);
                const firstSheet = wb.SheetNames[0];
                setActiveSheetName(firstSheet);
                loadSheetData(wb, firstSheet);
            }
        } catch (err) {
            console.error('Erreur lors du parsing Excel SheetJS:', err);
        }
    };

    // Charger les données d'une feuille spécifique
    const loadSheetData = (wb, sheetName) => {
        const ws = wb.Sheets[sheetName];
        if (!ws) return;
        
        // Obtenir la matrice 2D
        const rawMatrix = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', blankrows: true });
        
        // Déterminer le nombre maximum de colonnes
        let maxCols = 0;
        rawMatrix.forEach(row => {
            if (row && row.length > maxCols) maxCols = row.length;
        });
        if (maxCols === 0) maxCols = 5;

        // Normaliser les lignes
        const normalized = rawMatrix.map((row, rIdx) => {
            const cells = [];
            for (let cIdx = 0; cIdx < maxCols; cIdx++) {
                const cellRef = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
                const cellObj = ws[cellRef];
                const val = row && row[cIdx] !== undefined ? row[cIdx] : '';
                cells.push({
                    ref: cellRef,
                    row: rIdx + 1,
                    col: cIdx + 1,
                    colLetter: XLSX.utils.encode_col(cIdx),
                    value: val,
                    formula: cellObj?.f || null,
                    formatted: cellObj?.w || String(val)
                });
            }
            return cells;
        });

        setGridData(normalized);
        setActiveViewTab('grid');
    };

    // Exécuter le code Python
    const runCode = useCallback(async () => {
        if (!pyodideRef.current || running) return;
        setRunning(true);
        setError(null);
        setOutput('');
        setDownloadUrl(null);
        setSelectedCellInfo(null);

        const pyodide = pyodideRef.current;
        // Toujours récupérer le code en direct depuis l'éditeur Monaco s'il est actif
        const codeToRun = editorRef.current ? editorRef.current.getValue() : code;

        try {
            pyodide.setStdout({ batched: (s) => setOutput(prev => prev + s + '\n') });
            pyodide.setStderr({ batched: (s) => setOutput(prev => prev + '⚠️ ' + s + '\n') });

            // 1. NETTOYAGE PRÉALABLE : Supprimer les anciens fichiers .xlsx de la session précédente
            // afin d'être certain de ne charger QUE le fichier généré par cette exécution
            const searchDirs = ['.', '/home/pyodide', '/tmp', '/'];
            for (const dir of searchDirs) {
                try {
                    const entries = pyodide.FS.readdir(dir);
                    for (const name of entries) {
                        if (name.endsWith('.xlsx')) {
                            try {
                                const fullPath = dir === '/' ? `/${name}` : `${dir}/${name}`;
                                pyodide.FS.unlink(fullPath);
                            } catch (_) {}
                        }
                    }
                } catch (_) {}
            }

            // 2. EXÉCUTION DU CODE PYTHON ACTUELLEMENT DANS L'ÉDITEUR
            await pyodide.runPythonAsync(codeToRun);

            // 3. DÉTECTION DU NOM DE FICHIER ATTENDU DANS LE CODE
            const saveMatch = codeToRun.match(/(?:\.save|\.to_excel)\s*\(\s*['"]([^'"]+\.xlsx)['"]/i);
            const expectedFileName = saveMatch ? saveMatch[1].replace(/^[./\\]+/, '') : null;

            // 4. RÉCUPÉRER LE NOUVEAU FICHIER .XLSX RÉELLEMENT CRÉÉ
            let foundFile = null;
            let candidateFiles = [];

            for (const dir of searchDirs) {
                try {
                    const entries = pyodide.FS.readdir(dir);
                    for (const name of entries) {
                        if (name.endsWith('.xlsx')) {
                            const path = dir === '/' ? `/${name}` : `${dir}/${name}`;
                            try {
                                const stat = pyodide.FS.stat(path);
                                const bytes = pyodide.FS.readFile(path);
                                if (bytes && bytes.length > 0) {
                                    candidateFiles.push({
                                        name,
                                        path,
                                        bytes,
                                        mtime: stat?.mtime ? new Date(stat.mtime).getTime() : Date.now()
                                    });
                                }
                            } catch (_) {}
                        }
                    }
                } catch (_) {}
            }

            // A. Priorité 1 : Fichier dont le nom correspond exactement au save du code
            if (expectedFileName) {
                foundFile = candidateFiles.find(f => f.name === expectedFileName || f.name.endsWith(expectedFileName));
            }

            // B. Priorité 2 : Le fichier le plus récent
            if (!foundFile && candidateFiles.length > 0) {
                candidateFiles.sort((a, b) => b.mtime - a.mtime);
                foundFile = candidateFiles[0];
            }

            if (foundFile) {
                const blob = new Blob([foundFile.bytes], {
                   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                const url = URL.createObjectURL(blob);
                const sizeKb = (foundFile.bytes.length / 1024).toFixed(1);
                setDownloadUrl({ url, name: foundFile.name, size: sizeKb });
                setOutput(prev => prev + `\n✨ Succès ! Nouveau classeur "${foundFile.name}" créé (${sizeKb} KB) et chargé dans le tableur.`);
                
                // Parser et afficher le fichier dans le tableau interactif
                parseExcelBuffer(foundFile.bytes, foundFile.name);
            } else {
                setOutput(prev => prev + '\nℹ️ Code exécuté, mais aucun fichier .xlsx détecté. Utilisez wb.save("nom.xlsx").');
                setActiveViewTab('console');
            }
        } catch (e) {
            setError(e.message || 'Erreur d\'exécution Python');
            setActiveViewTab('console');
        } finally {
            setRunning(false);
        }
    }, [code, running]);

    // Initialisation et liaison de l'éditeur Monaco
    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor;

        // Raccourci clavier Ctrl+Entrée / Cmd+Entrée pour exécuter immédiatement
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            runCode();
        });

        // Suivre la position du curseur
        editor.onDidChangeCursorPosition(e => {
            setCursorPos({ line: e.position.lineNumber, col: e.position.column });
        });
    }, [runCode]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentTemplate = EXCEL_TEMPLATES[selectedTemplateKey] || EXCEL_TEMPLATES.facture;

    // Filtrer les lignes de la grille selon la recherche
    const filteredGridData = gridData.filter(row => {
        if (!searchFilter.trim()) return true;
        return row.some(cell => String(cell.value).toLowerCase().includes(searchFilter.toLowerCase()));
    });

    const colCount = gridData.length > 0 ? gridData[0].length : 0;
    const colLetters = Array.from({ length: colCount }, (_, i) => XLSX.utils.encode_col(i));

    return (
        <>
        {/* Overlay sombre derrière le plein écran */}
        {isFullscreen && (
            <div
                className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsFullscreen(false)}
            />
        )}
        <div 
            ref={containerRef}
            className={`transition-all duration-300 ${
                isFullscreen
                    ? 'fixed inset-0 z-50 flex flex-col rounded-none bg-[#090d16] shadow-[0_0_80px_rgba(16,185,129,0.15)]'
                    : 'my-8 rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#090d16] shadow-2xl shadow-emerald-950/40'
            }`}
        >
            {/* 1. Header principal */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-[#0d1f1b] via-[#0d1624] to-[#090d16] border-b border-emerald-500/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center shadow-inner">
                        <FileSpreadsheet size={22} className="text-emerald-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white tracking-wide">
                                {initialTitle || "Générateur & Tableur Excel Interactif"}
                            </h3>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                OpenPyXL + WebAssembly
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Exécutez du vrai Python, inspectez le tableur généré en direct et téléchargez le classeur .xlsx réel
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Statut Python */}
                    {ready ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Moteur Python prêt
                        </span>
                    ) : error ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg">
                            <AlertTriangle size={13} /> {status || 'Erreur'}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                            <Loader2 size={13} className="animate-spin text-amber-400" /> {status || 'Initialisation...'}
                        </span>
                    )}

                    {/* Bouton Plein Écran — mis en évidence */}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                            isFullscreen
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50 hover:border-red-400'
                                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40 hover:border-emerald-400 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/20'
                        }`}
                        title={isFullscreen ? "Quitter le plein écran (Echap)" : "Ouvrir en plein écran pour mieux travailler"}
                    >
                        {isFullscreen ? (
                            <><Minimize2 size={14} /> Réduire</>
                        ) : (
                            <><Maximize2 size={14} /> Plein écran</>
                        )}
                    </button>
                </div>
            </div>

            {/* 2. Barre de sélection des cas réels (Templates) */}
            <div className="px-5 py-3 bg-[#0c121e] border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Cas pratiques d'entreprise :</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
                    {Object.entries(EXCEL_TEMPLATES).map(([key, t]) => {
                        const Icon = t.icon;
                        const isSelected = selectedTemplateKey === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleSelectTemplate(key)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40'
                                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
                                }`}
                            >
                                <Icon size={14} className={isSelected ? 'text-white' : 'text-emerald-400'} />
                                <span>{t.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Description du cas sélectionné */}
            <div className="px-5 py-2.5 bg-emerald-950/20 border-b border-emerald-500/10 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-300">{currentTemplate.name} :</span>
                    <span className="text-gray-300">{currentTemplate.description}</span>
                </div>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/5 text-gray-400 text-[11px] border border-white/5">
                    {currentTemplate.badge}
                </span>
            </div>

            {/* 3. Corps principal : Éditeur de code à gauche, Résultat / Tableur à droite */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 ${isFullscreen ? 'flex-1 min-h-0 overflow-hidden' : ''}`}>
                
                {/* COLONNE GAUCHE : Éditeur de code Python (5 cols) */}
                <div className={`lg:col-span-5 flex flex-col border-r border-white/10 bg-[#080c14] ${isFullscreen ? 'overflow-hidden' : ''}`}>
                    {/* Header éditeur & Barre de Contrôle Lisibilité */}
                    <div className="px-3.5 py-2.5 bg-[#0e1626] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="flex gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                            </span>
                            <span className="font-mono text-gray-200 font-bold ml-1 flex items-center gap-1.5 text-xs">
                                <Terminal size={14} className="text-emerald-400" /> generate_excel.py
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5">
                                {code.split('\n').length} lignes
                            </span>
                        </div>

                        {/* Outils d'accessibilité & ergonomie (Zoom, Wrap, Thème) */}
                        <div className="flex items-center gap-1.5">
                            {/* Contrôle de Zoom de la police */}
                            <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5" title="Ajuster la taille de la police pour une lisibilité parfaite">
                                <button
                                    onClick={handleZoomOut}
                                    title="Réduire la taille de police (A-)"
                                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                >
                                    <ZoomOut size={13} />
                                </button>
                                <span className="text-[11px] font-mono px-1 text-emerald-300 font-bold min-w-[28px] text-center">
                                    {editorFontSize}px
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    title="Agrandir la taille de police (A+)"
                                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                >
                                    <ZoomIn size={13} />
                                </button>
                            </div>

                            {/* Retour à la ligne (Word Wrap) */}
                            <button
                                onClick={handleToggleWrap}
                                className={`px-2 py-1 rounded text-[11px] font-mono font-semibold border transition-all flex items-center gap-1 ${
                                    editorWordWrap === 'on'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                                }`}
                                title="Activer / Désactiver le retour automatique à la ligne"
                            >
                                <AlignLeft size={12} />
                                <span>{editorWordWrap === 'on' ? 'Wrap: On' : 'Wrap: Off'}</span>
                            </button>

                            {/* Sélecteur de Thème */}
                            <button
                                onClick={handleCycleTheme}
                                className="px-2 py-1 rounded text-[11px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                                title="Changer de thème (VS Dark / Contraste Élevé / Clair)"
                            >
                                {editorTheme === 'vs-dark' ? '🌙 Dark+' : editorTheme === 'hc-black' ? '⚡ Contraste' : '☀️ Clair'}
                            </button>

                            {/* Copier & Reset */}
                            <button
                                onClick={handleCopyCode}
                                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                                title="Copier tout le code"
                            >
                                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                            <button
                                onClick={() => handleSelectTemplate(selectedTemplateKey)}
                                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                                title="Réinitialiser au code initial"
                            >
                                <RotateCcw size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Palette de Snippets Rapides */}
                    <div className="px-3.5 py-1.5 bg-[#0a0f1c] border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
                            <PlusCircle size={12} className="text-emerald-400" /> Snippets :
                        </span>
                        <div className="flex items-center gap-1.5">
                            {OPENPYXL_SNIPPETS.map((snip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => insertSnippet(snip.code)}
                                    title={snip.title}
                                    className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 whitespace-nowrap transition-all font-mono text-[10px] font-semibold"
                                >
                                    {snip.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Zone de code Monaco Editor */}
                    <div className={`flex-1 relative ${isFullscreen ? 'min-h-0 overflow-hidden' : 'min-h-[420px]'}`}>
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            language="python"
                            theme={editorTheme}
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            onMount={handleEditorDidMount}
                            options={{
                                fontSize: editorFontSize,
                                lineNumbers: 'on',
                                minimap: { enabled: editorMinimap },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: editorWordWrap,
                                tabSize: 4,
                                insertSpaces: true,
                                fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', monospace",
                                fontLigatures: true,
                                renderLineHighlight: 'all',
                                bracketPairColorization: { enabled: true },
                                cursorBlinking: 'smooth',
                                smoothScrolling: true,
                                padding: { top: 12, bottom: 12 },
                                suggestOnTriggerCharacters: true,
                                lineHeight: 1.6,
                                contextmenu: true
                            }}
                        />
                    </div>

                    {/* Barre d'état inférieure de l'éditeur */}
                    <div className="px-3.5 py-1.5 bg-[#0a0f1a] border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                        <div className="flex items-center gap-3">
                            <span className="text-emerald-400 font-bold">
                                Ln {cursorPos.line}, Col {cursorPos.col}
                            </span>
                            <span className="text-gray-600">|</span>
                            <span>Python 3.11</span>
                            <span className="text-gray-600">|</span>
                            <span>4 espaces</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Keyboard size={12} className="text-blue-400" />
                            <span>Raccourci : <strong>Ctrl + Entrée</strong></span>
                        </div>
                    </div>

                    {/* Barre d'action d'exécution */}
                    <div className="p-3 bg-[#0d1424] border-t border-white/10 flex items-center gap-2">
                        <button
                            onClick={runCode}
                            disabled={!ready || running}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                        >
                            {running ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Génération en cours...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={16} className="fill-white" />
                                    <span>Exécuter & Générer l'Excel <span className="text-xs text-emerald-200 font-mono font-normal ml-1">(Ctrl+Entrée)</span></span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* COLONNE DROITE : Visualiseur de Tableur & Sortie (7 cols) */}
                <div className={`lg:col-span-7 flex flex-col bg-[#0b0f19] ${isFullscreen ? 'overflow-hidden' : ''}`}>
                    
                    {/* Header onglets de visualisation */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveViewTab('grid')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeViewTab === 'grid'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Table size={14} /> Aperçu Tableur Direct
                                {gridData.length > 0 && (
                                    <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveViewTab('console')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeViewTab === 'console'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Terminal size={14} /> Console & Logs
                            </button>

                            <button
                                onClick={() => setActiveViewTab('guide')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeViewTab === 'guide'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Lightbulb size={14} /> Formules & Astuces
                            </button>
                        </div>

                        {/* Recherche rapide dans la grille */}
                        {activeViewTab === 'grid' && gridData.length > 0 && (
                            <div className="relative">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Filtrer cellules..."
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    className="bg-black/30 border border-white/10 rounded-lg pl-7 pr-2 py-1 text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-28 sm:w-36"
                                />
                            </div>
                        )}
                    </div>

                    {/* VUE 1 : GRILLE TABLEUR INTERACTIVE EXCEL */}
                    {activeViewTab === 'grid' && (
                        <div className={`flex-1 flex flex-col bg-[#05070e] overflow-hidden ${isFullscreen ? 'min-h-0' : 'min-h-[380px]'}`}>
                            {gridData.length > 0 ? (
                                <>
                                    {/* Barre d'info cellule active */}
                                    <div className="px-4 py-2 bg-[#0c1424] border-b border-white/5 flex items-center justify-between text-xs text-gray-300">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                                {selectedCellInfo ? selectedCellInfo.ref : 'A1'}
                                            </span>
                                            <div className="text-gray-400 font-mono text-[11px] truncate max-w-[280px]">
                                                {selectedCellInfo ? (
                                                    selectedCellInfo.formula ? (
                                                        <span className="text-blue-300">Formule : {selectedCellInfo.formula}</span>
                                                    ) : (
                                                        <span>Valeur : {selectedCellInfo.formatted}</span>
                                                    )
                                                ) : (
                                                    'Cliquez sur une cellule pour voir ses détails & formule'
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-gray-500 font-mono">
                                            {gridData.length} lignes × {colCount} colonnes
                                        </span>
                                    </div>

                                    {/* Grille Excel stylisée */}
                                    <div className="flex-1 overflow-auto p-3 scrollbar-thin">
                                        <div className="inline-block min-w-full align-middle border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                                            <table className="min-w-full text-xs font-mono border-collapse bg-[#0c111d]">
                                                {/* En-tête des colonnes (A, B, C, D...) */}
                                                <thead>
                                                    <tr className="bg-[#172033] border-b border-gray-700 text-gray-300">
                                                        <th className="w-10 px-2 py-2 text-center text-[10px] text-gray-500 font-bold bg-[#131b2e] border-r border-gray-700 select-none">
                                                            #
                                                        </th>
                                                        {colLetters.map((colLet) => (
                                                            <th
                                                                key={colLet}
                                                                className="px-3 py-2 text-center font-bold text-gray-300 border-r border-gray-700 select-none"
                                                            >
                                                                {colLet}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredGridData.map((row, rIdx) => {
                                                        const rowNumber = row[0]?.row || rIdx + 1;
                                                        const isHeaderRow = rowNumber === 1 || rowNumber === 4 || rowNumber === 9;
                                                        return (
                                                            <tr 
                                                                key={rowNumber}
                                                                className={`border-b border-gray-800/80 hover:bg-emerald-500/5 transition-colors ${
                                                                    isHeaderRow ? 'bg-[#11192a]' : ''
                                                                }`}
                                                            >
                                                                {/* Numéro de ligne Excel (1, 2, 3...) */}
                                                                <td className="px-2 py-1.5 text-center text-[10px] font-bold text-gray-500 bg-[#101726] border-r border-gray-700 select-none">
                                                                    {rowNumber}
                                                                </td>
                                                                {/* Cellules */}
                                                                {row.map((cell) => {
                                                                    const isSelected = selectedCellInfo?.ref === cell.ref;
                                                                    const hasFormula = Boolean(cell.formula);
                                                                    const isNumeric = typeof cell.value === 'number' || (!isNaN(cell.value) && cell.value !== '');
                                                                    
                                                                    return (
                                                                        <td
                                                                            key={cell.ref}
                                                                            onClick={() => setSelectedCellInfo(cell)}
                                                                            className={`px-3 py-1.5 border-r border-gray-800/60 cursor-pointer transition-all ${
                                                                                isSelected
                                                                                    ? 'bg-emerald-500/20 ring-2 ring-emerald-400 font-bold text-white'
                                                                                    : hasFormula
                                                                                    ? 'text-emerald-300 font-semibold'
                                                                                    : 'text-gray-200'
                                                                            } ${isNumeric ? 'text-right' : 'text-left'}`}
                                                                            title={`${cell.ref}: ${cell.formatted}${cell.formula ? ` (Formule: =${cell.formula})` : ''}`}
                                                                        >
                                                                            <span className="truncate block max-w-[200px]">
                                                                                {cell.formatted || cell.value || '\u00A0'}
                                                                            </span>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Onglets Feuilles Excel en bas (Sheet1, Sheet2...) */}
                                    {parsedWorkbook && parsedWorkbook.SheetNames.length > 1 && (
                                        <div className="px-3 py-2 bg-[#0d1424] border-t border-white/10 flex items-center gap-1 overflow-x-auto">
                                            <span className="text-[11px] text-gray-500 font-bold mr-2 flex items-center gap-1">
                                                <Layers size={12} /> Feuilles :
                                            </span>
                                            {parsedWorkbook.SheetNames.map((sName) => (
                                                <button
                                                    key={sName}
                                                    onClick={() => {
                                                        setActiveSheetName(sName);
                                                        loadSheetData(parsedWorkbook, sName);
                                                    }}
                                                    className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                                        activeSheetName === sName
                                                            ? 'bg-emerald-600 text-white shadow-sm'
                                                            : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                                                    }`}
                                                >
                                                    <FileSpreadsheet size={12} />
                                                    {sName}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                                        <FileSpreadsheet size={32} />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-300 mb-1">
                                        Aucun aperçu de classeur pour le moment
                                    </h4>
                                    <p className="text-xs text-gray-400 max-w-sm mb-4">
                                        Cliquez sur le bouton vert <strong>« Exécuter & Générer l'Excel »</strong> à gauche pour voir le fichier généré s'afficher ici sous forme de tableur interactif.
                                    </p>
                                    <button
                                        onClick={runCode}
                                        disabled={!ready || running}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                                    >
                                        <Play size={13} /> Lancer la génération
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VUE 2 : CONSOLE & SORTIE PYTHON */}
                    {activeViewTab === 'console' && (
                        <div className="flex-1 min-h-[380px] bg-[#060911] p-4 overflow-auto font-mono text-xs flex flex-col">
                            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5 text-[11px] text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <Terminal size={13} /> Sortie standard (stdout / stderr)
                                </span>
                                <span>Pyodide v0.26.2</span>
                            </div>

                            {error ? (
                                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 whitespace-pre-wrap flex items-start gap-2.5">
                                    <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-red-200 mb-1">Erreur d'exécution Python :</p>
                                        <p className="text-xs font-mono">{error}</p>
                                    </div>
                                </div>
                            ) : output ? (
                                <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed flex-1">
                                    {output}
                                </pre>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 italic">
                                    <Cpu size={28} className="mb-2 text-gray-700" />
                                    <p>La sortie d'exécution et les messages s'afficheront ici.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VUE 3 : GUIDE & FORMULES AVANCÉES OPENPYXL */}
                    {activeViewTab === 'guide' && (
                        <div className="flex-1 min-h-[380px] bg-[#070b14] p-5 overflow-auto text-xs text-gray-300 leading-relaxed space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                                    <Lightbulb size={16} className="text-amber-400" />
                                    Boîte à Outils : Formules Excel Pro en Python
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                                    openpyxl 100% Natif
                                </span>
                            </div>

                            {/* Recettes de formules prêtes à copier */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    {
                                        titre: '🔍 RECHERCHEX / XLOOKUP',
                                        excel: '=XLOOKUP(A2, Catalogue!A:A, Catalogue!B:B, "Inconnu", 0)',
                                        py: `ws['D2'] = f'=XLOOKUP(A{row}, Catalogue!A:A, Catalogue!B:B, "Inconnu", 0)'`,
                                        note: 'Remplace RECHERCHEV et cherche vers la gauche sans risque d\'erreur.'
                                    },
                                    {
                                        titre: '📊 SOMME.SI.ENS / SUMIFS',
                                        excel: '=SUMIFS(E:E, B:B, "Alger", F:F, "Validé")',
                                        py: `ws['H5'] = '=SUMIFS(E:E, B:B, "Alger", F:F, "Validé")'`,
                                        note: 'Additionne la colonne E selon 2 ou plusieurs critères simultanés.'
                                    },
                                    {
                                        titre: '⚡ NB.SI.ENS / COUNTIFS',
                                        excel: '=COUNTIFS(B:B, "Alger", F:F, "Validé")',
                                        py: `ws['H6'] = '=COUNTIFS(B:B, "Alger", F:F, "Validé")'`,
                                        note: 'Compte le nombre de lignes répondant à des critères stricts.'
                                    },
                                    {
                                        titre: '🛡️ SIERREUR / IFERROR',
                                        excel: '=IFERROR(C2/D2, 0)',
                                        py: `ws['E2'] = f'=IFERROR(C{row}/D{row}, 0)'`,
                                        note: 'Neutralise les erreurs de division par zéro (#DIV/0!) et #N/A.'
                                    }
                                ].map((recette, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-white text-xs">{recette.titre}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(recette.py);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10"
                                            >
                                                <Copy size={10} /> Copier Python
                                            </button>
                                        </div>
                                        <code className="block p-1.5 rounded bg-black/50 text-blue-300 font-mono text-[10px] truncate">
                                            {recette.excel}
                                        </code>
                                        <code className="block p-1.5 rounded bg-black/50 text-yellow-300 font-mono text-[10px] truncate">
                                            {recette.py}
                                        </code>
                                        <p className="text-[10px] text-gray-400 leading-tight">
                                            {recette.note}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                                <h5 className="font-bold text-emerald-300 text-xs mb-1">💡 Règle d'or absolue avec openpyxl :</h5>
                                <p className="text-gray-300 text-[11px] leading-relaxed">
                                    Toujours rédiger les noms de formules avec la <strong>terminologie anglaise</strong> (<code className="text-emerald-300 font-bold">SUM</code>, <code className="text-emerald-300 font-bold">AVERAGE</code>, <code className="text-emerald-300 font-bold">IF</code>, <code className="text-emerald-300 font-bold">XLOOKUP</code>, <code className="text-emerald-300 font-bold">INDEX</code>, <code className="text-emerald-300 font-bold">MATCH</code>). Lorsque votre collègue ouvrira le fichier sous un Excel français, le logiciel traduira la formule en <code className="text-blue-300">SOMME</code> ou <code className="text-blue-300">RECHERCHEX</code> de manière 100% transparente !
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Zone de Téléchargement Direct */}
                    <div className="p-3.5 bg-[#0f172a] border-t border-white/10 flex items-center justify-between gap-3">
                        {downloadUrl ? (
                            <a
                                href={downloadUrl.url}
                                download={downloadUrl.name}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 animate-pulse"
                            >
                                <Download size={16} />
                                <span>Télécharger le fichier réel : <strong>{downloadUrl.name}</strong> ({downloadUrl.size} KB)</span>
                            </a>
                        ) : (
                            <div className="flex-1 text-center text-xs text-gray-500 flex items-center justify-center gap-2 py-2">
                                <FileSpreadsheet size={15} className="text-gray-600" />
                                <span>Le fichier Excel .xlsx téléchargeable sera généré à l'exécution</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Footer d'information */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-[#090d16] border-t border-emerald-500/15 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Exécution 100% locale sécurisée dans le navigateur (WebAssembly Pyodide + OpenPyXL).</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="text-emerald-400">● .xlsx natif Microsoft Excel</span>
                    <span className="text-blue-400">● Compatible LibreOffice & Google Sheets</span>
                </div>
            </div>
        </div>
        </>
    );
}
