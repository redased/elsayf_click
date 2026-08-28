require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findFirst({ where: { slug: 'antigravity-business-excel' } });
    if (!course) { console.log('Course not found'); return; }
    console.log('Course trouvé:', course.title);

    const newLessons = [
        {
            title: 'Lecon 7 - Formules Excel Avancées : VLOOKUP, SUMIFS, INDEX/MATCH',
            title_en: 'Lesson 7 - Advanced Excel Formulas: VLOOKUP, SUMIFS, INDEX/MATCH',
            title_ar: 'الدرس 7 - معادلات إكسل المتقدمة: VLOOKUP و SUMIFS و INDEX/MATCH',
            order: 7,
            description: 'Maîtrisez les formules Excel les plus puissantes et apprenez à les insérer automatiquement avec Python.',
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: '💡 **Objectif** : Maîtriser VLOOKUP, SUMIFS, INDEX/MATCH et les insérer automatiquement avec Python openpyxl.'
                },
                {
                    contentType: 'TEXT', title: 'vlookup-explication', order: 2,
                    content: `## VLOOKUP — Chercher une valeur dans un tableau

**VLOOKUP** (ou RECHERCHEV en français) permet de chercher une valeur dans la première colonne d'un tableau et retourner une valeur de la même ligne.

### Syntaxe :
\`\`\`
=VLOOKUP(valeur_cherchée, plage_tableau, numéro_colonne, [correspondance_exacte])
\`\`\`

### Exemple concret : Trouver le prix d'un produit
\`\`\`excel
=VLOOKUP(A2, Produits!A:C, 2, FALSE)
\`\`\`
👆 Cherche la valeur de A2 dans le tableau Produits, colonne A, et retourne la valeur de la colonne 2 (prix).

### Avec Python openpyxl :
\`\`\`python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active

# Données produits
ws['A1'] = 'Produit'
ws['B1'] = 'Prix'
produits = [('Ordinateur', 1200), ('Souris', 25), ('Clavier', 45)]
for i, (nom, prix) in enumerate(produits, 2):
    ws[f'A{i}'] = nom
    ws[f'B{i}'] = prix

# Feuille commandes avec VLOOKUP automatique
ws2 = wb.create_sheet('Commandes')
ws2['A1'] = 'Produit commandé'
ws2['B1'] = 'Prix unitaire'
ws2['A2'] = 'Souris'
# Insérer la formule VLOOKUP
ws2['B2'] = '=VLOOKUP(A2,Sheet!A:B,2,FALSE)'

wb.save('catalogue.xlsx')
print("Fichier créé avec VLOOKUP !")
\`\`\``
                },
                {
                    contentType: 'TEXT', title: 'sumifs-explication', order: 3,
                    content: `## SUMIFS — Somme avec plusieurs conditions

**SUMIFS** additionne les valeurs d'une plage qui correspondent à plusieurs critères simultanément.

### Syntaxe :
\`\`\`
=SUMIFS(plage_somme, plage_critère1, critère1, plage_critère2, critère2, ...)
\`\`\`

### Exemple : Total des ventes par région et par mois
\`\`\`excel
=SUMIFS(C:C, A:A, "Paris", B:B, "Janvier")
\`\`\`

### Avec Python — insérer SUMIFS dynamiquement :
\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Ventes"

# En-têtes
headers = ['Région', 'Mois', 'Produit', 'Montant']
for col, h in enumerate(headers, 1):
    cell = ws.cell(1, col, h)
    cell.font = Font(bold=True, color='FFFFFF')
    cell.fill = PatternFill('solid', fgColor='2E75B6')
    cell.alignment = Alignment(horizontal='center')

# Données
data = [
    ('Paris', 'Janvier', 'Laptop', 5000),
    ('Lyon', 'Janvier', 'Souris', 200),
    ('Paris', 'Février', 'Laptop', 7000),
    ('Lyon', 'Février', 'Laptop', 3000),
    ('Paris', 'Janvier', 'Souris', 150),
]
for row, vals in enumerate(data, 2):
    for col, val in enumerate(vals, 1):
        ws.cell(row, col, val)

# Feuille résumé avec SUMIFS
ws2 = wb.create_sheet('Résumé')
ws2['A1'] = 'Total Paris Janvier'
ws2['B1'] = "=SUMIFS(Ventes!D:D,Ventes!A:A,\"Paris\",Ventes!B:B,\"Janvier\")"
ws2['A2'] = 'Total Lyon'
ws2['B2'] = '=SUMIFS(Ventes!D:D,Ventes!A:A,"Lyon")'

wb.save('ventes_analyse.xlsx')
print("Analyse créée !")
\`\`\``
                },
                {
                    contentType: 'TEXT', title: 'index-match', order: 4,
                    content: `## INDEX/MATCH — Plus puissant que VLOOKUP

**INDEX/MATCH** est la combinaison préférée des experts Excel. Contrairement à VLOOKUP, elle peut chercher vers la gauche et est plus rapide sur les grands tableaux.

### Syntaxe :
\`\`\`
=INDEX(colonne_résultat, MATCH(valeur_cherchée, colonne_recherche, 0))
\`\`\`

### Exemple : Trouver le salaire d'un employé par son ID
\`\`\`excel
=INDEX(C:C, MATCH(F2, A:A, 0))
\`\`\`

### Avec Python — générer automatiquement :
\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import Font, Border, Side, PatternFill

wb = Workbook()
ws = wb.active

# Table employés
employes = [
    ('EMP001', 'Alice Martin', 'IT', 52000),
    ('EMP002', 'Bob Dupont', 'Finance', 48000),
    ('EMP003', 'Claire Simon', 'RH', 45000),
    ('EMP004', 'David Morin', 'IT', 61000),
]

ws['A1'], ws['B1'], ws['C1'], ws['D1'] = 'ID', 'Nom', 'Département', 'Salaire'
for i, emp in enumerate(employes, 2):
    ws[f'A{i}'], ws[f'B{i}'], ws[f'C{i}'], ws[f'D{i}'] = emp

# Zone de recherche avec INDEX/MATCH
ws['F1'] = 'Recherche ID'
ws['G1'] = 'Nom trouvé'
ws['H1'] = 'Salaire'
ws['F2'] = 'EMP003'
ws['G2'] = '=INDEX(B:B,MATCH(F2,A:A,0))'
ws['H2'] = '=INDEX(D:D,MATCH(F2,A:A,0))'

wb.save('recherche_employes.xlsx')
print("INDEX/MATCH inséré avec succès !")
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'prompt-ia', order: 5,
                    content: `🤖 **Prompt IA à utiliser avec Antigravity :**

"Crée un fichier Excel Python avec openpyxl qui contient :
- Une feuille 'Données' avec 20 lignes de ventes (Date, Région, Produit, Quantité, Prix)
- Une feuille 'Analyse' avec des formules SUMIFS pour calculer le total par région
- Une formule INDEX/MATCH pour retrouver le meilleur vendeur
- Des styles professionnels (en-têtes colorés en bleu, alternance de couleurs sur les lignes)"

👆 Copiez ce prompt dans Antigravity pour générer le script complet automatiquement !`
                }
            ]
        },
        {
            title: 'Lecon 8 - Graphiques Professionnels avec Python & Excel',
            title_en: 'Lesson 8 - Professional Charts with Python & Excel',
            title_ar: 'الدرس 8 - الرسوم البيانية الاحترافية مع بايثون وإكسل',
            order: 8,
            description: 'Créez des graphiques époustouflants directement dans Excel avec openpyxl et matplotlib.',
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: '📊 **Objectif** : Générer des graphiques professionnels (barres, courbes, secteurs, combinés) directement intégrés dans vos fichiers Excel.'
                },
                {
                    contentType: 'TEXT', title: 'graphique-barres', order: 2,
                    content: `## Graphique en Barres avec openpyxl

openpyxl intègre nativement la création de graphiques Excel sans avoir besoin de matplotlib.

\`\`\`python
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.chart.series import SeriesLabel
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
ws = wb.active
ws.title = "Ventes 2025"

# Données
mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun']
ventes_paris = [45000, 52000, 38000, 61000, 55000, 70000]
ventes_lyon = [32000, 28000, 41000, 35000, 47000, 39000]

ws['A1'] = 'Mois'
ws['B1'] = 'Paris'
ws['C1'] = 'Lyon'
for i, (m, p, l) in enumerate(zip(mois, ventes_paris, ventes_lyon), 2):
    ws[f'A{i}'] = m
    ws[f'B{i}'] = p
    ws[f'C{i}'] = l

# Créer le graphique barres
chart = BarChart()
chart.type = "col"
chart.title = "Ventes par Ville 2025"
chart.style = 10
chart.y_axis.title = "Montant (€)"
chart.x_axis.title = "Mois"
chart.width = 20
chart.height = 12

data = Reference(ws, min_col=2, max_col=3, min_row=1, max_row=7)
cats = Reference(ws, min_col=1, min_row=2, max_row=7)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
chart.shape = 4

ws.add_chart(chart, "E2")
wb.save("graphique_ventes.xlsx")
print("Graphique créé dans Excel !")
\`\`\``
                },
                {
                    contentType: 'TEXT', title: 'graphique-matplotlib', order: 3,
                    content: `## Graphiques Matplotlib exportés vers Excel

Pour des graphiques encore plus beaux, utilisez matplotlib + openpyxl ensemble :

\`\`\`python
import matplotlib
matplotlib.use('Agg')  # Mode sans interface graphique
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from openpyxl import Workbook
from openpyxl.drawing.image import Image
import io

wb = Workbook()
ws = wb.active

# === Graphique 1 : Secteurs (Pie Chart) ===
fig1, ax1 = plt.subplots(figsize=(7, 5))
categories = ['Marketing', 'IT', 'RH', 'Finance', 'Opérations']
valeurs = [23, 31, 15, 18, 13]
couleurs = ['#2E75B6', '#ED7D31', '#A9D18E', '#FF0000', '#7030A0']
explode = (0.05, 0.05, 0.05, 0.05, 0.05)

wedges, texts, autotexts = ax1.pie(
    valeurs, explode=explode, colors=couleurs,
    autopct='%1.1f%%', startangle=90,
    pctdistance=0.85
)
for text in autotexts:
    text.set_fontsize(9)
    text.set_fontweight('bold')

ax1.set_title('Répartition Budget par Département', fontsize=14, fontweight='bold', pad=20)
ax1.legend(categories, loc='lower right', fontsize=8)

buf1 = io.BytesIO()
fig1.savefig(buf1, format='png', dpi=150, bbox_inches='tight')
buf1.seek(0)
plt.close(fig1)

# === Graphique 2 : Courbe Evolution ===
fig2, ax2 = plt.subplots(figsize=(10, 5))
mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
ca_2024 = [120, 135, 98, 165, 180, 210, 195, 175, 220, 240, 260, 310]
ca_2025 = [145, 158, 132, 189, 215, 245, 230, 210, 265, 280, 295, 360]
x = np.arange(len(mois))

ax2.plot(x, ca_2024, 'o-', color='#2E75B6', linewidth=2.5, markersize=6, label='CA 2024')
ax2.plot(x, ca_2025, 's-', color='#ED7D31', linewidth=2.5, markersize=6, label='CA 2025')
ax2.fill_between(x, ca_2024, ca_2025, alpha=0.1, color='green')
ax2.set_xticks(x)
ax2.set_xticklabels(mois)
ax2.set_ylabel("Chiffre d'Affaires (k€)")
ax2.set_title("Évolution du CA 2024 vs 2025", fontsize=14, fontweight='bold')
ax2.legend()
ax2.grid(True, alpha=0.3)
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)

buf2 = io.BytesIO()
fig2.savefig(buf2, format='png', dpi=150, bbox_inches='tight')
buf2.seek(0)
plt.close(fig2)

# === Insérer dans Excel ===
img1 = Image(buf1)
img1.width, img1.height = 420, 300
ws.add_image(img1, 'A2')

img2 = Image(buf2)
img2.width, img2.height = 600, 300
ws.add_image(img2, 'A22')

ws['A1'] = '📊 Tableaux de bord graphiques générés automatiquement'

wb.save('dashboard_graphiques.xlsx')
print("Dashboard avec graphiques matplotlib créé !")
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'prompt-graphique', order: 4,
                    content: `🤖 **Prompt IA pour graphiques personnalisés :**

"Génère un script Python avec matplotlib et openpyxl qui crée un fichier Excel avec :
- Un graphique en barres groupées comparant les ventes de 3 produits sur 12 mois
- Un graphique en courbes avec aire ombrée montrant l'évolution du CA
- Un camembert de la répartition des dépenses
- Tous insérés dans une feuille Excel 'Dashboard' avec des titres stylisés
- Utilise des couleurs professionnelles bleues et orangées"

👉 Ce prompt dans Antigravity génère le code complet en 30 secondes !`
                }
            ]
        },
        {
            title: 'Lecon 9 - Prompts IA & Génération d\'Images : Midjourney, DALL-E, Stable Diffusion',
            title_en: 'Lesson 9 - AI Prompts & Image Generation: Midjourney, DALL-E, Stable Diffusion',
            title_ar: 'الدرس 9 - مطالبات الذكاء الاصطناعي وتوليد الصور',
            order: 9,
            description: 'Apprenez à rédiger des prompts efficaces pour générer des images professionnelles avec les meilleurs outils IA.',
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: '🎨 **Objectif** : Maîtriser l\'art du "prompt engineering" pour générer des images professionnelles (logos, rapports, visualisations) avec l\'IA.'
                },
                {
                    contentType: 'TEXT', title: 'anatomie-prompt', order: 2,
                    content: `## L'Anatomie d'un Prompt Image Efficace

Un bon prompt image se compose de **5 éléments clés** :

### Structure de base :
\`\`\`
[SUJET] + [STYLE] + [ÉCLAIRAGE] + [COMPOSITION] + [QUALITÉ]
\`\`\`

### Exemple — Mauvais prompt ❌ :
\`\`\`
"Un graphique d'affaires"
\`\`\`

### Exemple — Bon prompt ✅ :
\`\`\`
"Professional business dashboard visualization, clean data charts showing quarterly revenue growth,
blue and white corporate color scheme, minimalist design, high contrast, sharp lines,
suitable for executive presentation, 4K quality, photorealistic"
\`\`\`

---

## Les Modificateurs les Plus Puissants

### Style visuel :
- \`photorealistic\` → Aspect photographique réel
- \`flat design\` → Design 2D épuré (parfait pour infographies)
- \`isometric\` → Vue isométrique professionnelle
- \`watercolor\` → Style aquarelle artistique
- \`corporate\` → Style entreprise professionnel

### Qualité :
- \`8K ultra HD\`
- \`highly detailed\`
- \`award-winning photography\`
- \`masterpiece\`

### Éclairage :
- \`studio lighting\` → Éclairage studio parfait
- \`golden hour\` → Lumière dorée
- \`dramatic lighting\` → Éclairage dramatique
- \`soft diffused light\` → Lumière douce`
                },
                {
                    contentType: 'TEXT', title: 'prompts-metiers', order: 3,
                    content: `## Prompts Métier Prêts à l'Emploi

### 📊 Pour les Rapports d'Entreprise :
\`\`\`
"Clean infographic showing annual business report, bar charts and pie charts,
professional blue and gray color palette, white background, modern typography,
data visualization dashboard, corporate style, high resolution vector"
\`\`\`

### 🏢 Pour les Présentations :
\`\`\`
"Modern PowerPoint slide background, abstract geometric shapes, gradient blue to purple,
professional corporate design, minimalist, space for text, 16:9 ratio, 4K quality"
\`\`\`

### 📈 Pour les Graphiques Excel :
\`\`\`
"3D bar chart showing monthly sales growth, vibrant colors blue orange green,
dark background, glowing data bars, professional financial visualization,
ultra detailed, cinematic lighting"
\`\`\`

### 🤝 Pour les Ressources Humaines :
\`\`\`
"Diverse team of professionals collaborating in modern office,
overhead view, flat design illustration, blue and orange tones,
clean geometric style, suitable for HR presentation"
\`\`\`

### 🛒 Pour le E-commerce :
\`\`\`
"Product on white background, studio photography, soft shadows,
professional product shot, marketing ready, high resolution, clean and minimal"
\`\`\`

---

## Les Meilleurs Outils de Génération

| Outil | Force | Accès |
|-------|--------|-------|
| **Midjourney** | Artistique, qualité exceptionnelle | Discord (payant) |
| **DALL-E 3** | Intégré à ChatGPT, suit bien les instructions | ChatGPT Plus |
| **Stable Diffusion** | Gratuit, local, très personnalisable | Téléchargeable |
| **Adobe Firefly** | Commercial, sans droits d'auteur | Adobe CC |
| **Bing Image Creator** | Gratuit, basé sur DALL-E | Bing.com |`
                },
                {
                    contentType: 'TEXT', title: 'ia-avec-python', order: 4,
                    content: `## Générer des Images avec Python + API OpenAI

Vous pouvez automatiser la génération d'images directement depuis Python :

\`\`\`python
import openai
import requests
import os
from openpyxl import Workbook
from openpyxl.drawing.image import Image as XLImage
import io

# Configurer l'API
client = openai.OpenAI(api_key="votre-cle-api")

def generer_image_rapport(titre_rapport, donnees_cles):
    """Génère une image de couverture pour un rapport Excel"""

    prompt = f"""
    Professional business report cover page visualization for '{titre_rapport}'.
    Key metrics displayed: {donnees_cles}.
    Corporate blue and white color scheme, clean minimalist design,
    modern typography, data visualization elements,
    suitable for executive presentation, high quality.
    """

    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1792x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    img_data = requests.get(image_url).content
    return img_data

# Utilisation
img_data = generer_image_rapport(
    "Rapport Annuel 2025",
    "CA: 2.4M€, Croissance: +23%, Clients: 847"
)

# Insérer dans Excel
wb = Workbook()
ws = wb.active
ws.title = "Rapport"

img = XLImage(io.BytesIO(img_data))
img.width = 800
img.height = 450
ws.add_image(img, "A1")

ws['A32'] = "Rapport généré automatiquement avec IA"
wb.save("rapport_avec_ia.xlsx")
print("Rapport avec image IA créé !")
\`\`\`

> 💡 **Note** : Sans clé OpenAI, vous pouvez utiliser l'API Bing Image Creator (gratuite) ou générer les images manuellement et les insérer avec openpyxl.`
                },
                {
                    contentType: 'CALLOUT', title: 'negative-prompts', order: 5,
                    content: `⚡ **Technique Pro : Les Negative Prompts**

Dans Stable Diffusion et Midjourney (avec \`--no\`), vous pouvez dire à l'IA ce que vous **ne voulez PAS** :

**Negative prompt pour images professionnelles :**
\`\`\`
"blurry, low quality, pixelated, cartoon, childish, watermark, text errors,
distorted faces, ugly, bad composition, amateur"
\`\`\`

**Midjourney :**
\`\`\`
/imagine professional dashboard --no cartoon blurry watermark --style raw --ar 16:9 --q 2
\`\`\``
                }
            ]
        },
        {
            title: 'Lecon 10 - Projet Final : Automatisation Complète Excel + Python + IA',
            title_en: 'Lesson 10 - Final Project: Full Automation Excel + Python + AI',
            title_ar: 'الدرس 10 - المشروع النهائي: الأتمتة الكاملة إكسل + بايثون + الذكاء الاصطناعي',
            order: 10,
            description: 'Créez un système complet qui combine Python, formules Excel, graphiques et génération IA en un seul pipeline.',
            contents: [
                {
                    contentType: 'CALLOUT', title: 'intro', order: 1,
                    content: '🚀 **Projet Final** : Combinez tout ce que vous avez appris pour créer un système d\'automatisation complet — de la donnée brute au rapport Excel professionnel avec graphiques et images IA.'
                },
                {
                    contentType: 'TEXT', title: 'architecture-projet', order: 2,
                    content: `## Architecture du Projet Final

### Pipeline complet :
\`\`\`
Données CSV → Python → Nettoyage → Analyse → Formules Excel → Graphiques → Rapport PDF
                                                      ↓
                                              IA génère images de couverture
\`\`\`

### Script complet — Rapport de Ventes Automatique :

\`\`\`python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment, numbers
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.utils import get_column_letter
from openpyxl.drawing.image import Image as XLImage
from datetime import datetime
import io

# === DONNÉES ===
ventes = {
    'Paris':   [45000, 52000, 38000, 61000, 55000, 70000, 65000, 72000, 68000, 80000, 85000, 95000],
    'Lyon':    [32000, 28000, 41000, 35000, 47000, 39000, 44000, 50000, 42000, 55000, 60000, 65000],
    'Marseille':[28000, 31000, 25000, 38000, 33000, 42000, 39000, 45000, 41000, 48000, 52000, 58000],
}
mois = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

wb = Workbook()

# === FEUILLE 1 : DONNÉES ===
ws_data = wb.active
ws_data.title = "Données Brutes"

# Style en-têtes
header_font = Font(bold=True, color='FFFFFF', size=11)
header_fill = PatternFill('solid', fgColor='1F4E79')
header_align = Alignment(horizontal='center', vertical='center')
border = Border(
    left=Side(style='thin', color='BFBFBF'),
    right=Side(style='thin', color='BFBFBF'),
    top=Side(style='thin', color='BFBFBF'),
    bottom=Side(style='thin', color='BFBFBF')
)

ws_data['A1'] = 'Mois'
for i, ville in enumerate(ventes.keys(), 2):
    cell = ws_data.cell(1, i, ville)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = header_align

ws_data['A1'].font = header_font
ws_data['A1'].fill = header_fill
ws_data['A1'].alignment = header_align

# Remplir les données avec alternance de couleurs
fill_pair = [PatternFill('solid', fgColor='DEEAF1'), PatternFill('solid', fgColor='FFFFFF')]
for row, (m, *vals) in enumerate(zip(mois, *ventes.values()), 2):
    ws_data.cell(row, 1, m).font = Font(bold=True)
    for col, val in enumerate(ventes.values(), 2):
        cell = ws_data.cell(row, col, list(ventes.values())[col-2][row-2])
        cell.number_format = '#,##0 "€"'
        cell.fill = fill_pair[row % 2]
        cell.border = border

# Ligne totaux avec SUMIFS
total_row = 14
ws_data.cell(total_row, 1, 'TOTAL').font = Font(bold=True, color='FFFFFF')
ws_data.cell(total_row, 1).fill = PatternFill('solid', fgColor='2E75B6')
for col in range(2, 5):
    col_letter = get_column_letter(col)
    cell = ws_data.cell(total_row, col, f'=SUM({col_letter}2:{col_letter}13)')
    cell.font = Font(bold=True, color='FFFFFF')
    cell.fill = PatternFill('solid', fgColor='2E75B6')
    cell.number_format = '#,##0 "€"'

# Ajuster largeurs
ws_data.column_dimensions['A'].width = 10
for col in range(2, 5):
    ws_data.column_dimensions[get_column_letter(col)].width = 18

# === FEUILLE 2 : ANALYSE ===
ws_analyse = wb.create_sheet("Analyse")
ws_analyse['A1'] = '📊 Analyse des Performances'
ws_analyse['A1'].font = Font(bold=True, size=16, color='1F4E79')

metrics = [
    ('Meilleure ville', "=INDEX(Données Brutes!B1:D1,MATCH(MAX(Données Brutes!B14:D14),Données Brutes!B14:D14,0))"),
    ('CA Total annuel', "=SUM('Données Brutes'!B14:D14)"),
    ('Moyenne mensuelle', "=AVERAGE('Données Brutes'!B2:D13)"),
    ('Croissance H2 vs H1', "=(SUM('Données Brutes'!B8:D13)-SUM('Données Brutes'!B2:D7))/SUM('Données Brutes'!B2:D7)"),
]
for i, (label, formula) in enumerate(metrics, 3):
    ws_analyse.cell(i, 1, label).font = Font(bold=True)
    cell = ws_analyse.cell(i, 2, formula)
    if 'Croissance' in label:
        cell.number_format = '0.0%'
    elif 'Total' in label or 'Moyenne' in label:
        cell.number_format = '#,##0 "€"'

# === GRAPHIQUE MATPLOTLIB ===
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#F8F9FA')

# Graphique barres groupées
x = np.arange(len(mois))
width = 0.28
colors = ['#2E75B6', '#ED7D31', '#A9D18E']
for i, (ville, data) in enumerate(ventes.items()):
    axes[0].bar(x + i*width - width, data, width, label=ville, color=colors[i], alpha=0.85)
axes[0].set_xticks(x)
axes[0].set_xticklabels(mois, rotation=45)
axes[0].set_ylabel('CA (€)')
axes[0].set_title('CA Mensuel par Ville 2025', fontweight='bold', fontsize=13)
axes[0].legend()
axes[0].grid(axis='y', alpha=0.3)
axes[0].spines['top'].set_visible(False)
axes[0].spines['right'].set_visible(False)

# Graphique camembert
totaux = [sum(v) for v in ventes.values()]
axes[1].pie(totaux, labels=ventes.keys(), colors=colors, autopct='%1.1f%%',
            startangle=90, explode=[0.05]*3)
axes[1].set_title('Répartition du CA par Ville', fontweight='bold', fontsize=13)

plt.tight_layout()
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#F8F9FA')
buf.seek(0)
plt.close()

# Insérer graphique dans Excel
img = XLImage(buf)
img.width, img.height = 750, 270
ws_analyse.add_image(img, 'A8')

wb.save('rapport_final_complet.xlsx')
print("✅ Rapport final créé : rapport_final_complet.xlsx")
print(f"   → {len(mois)} mois de données")
print(f"   → {len(ventes)} villes analysées")
print(f"   → Formules Excel automatiques insérées")
print(f"   → 2 graphiques professionnels générés")
\`\`\``
                },
                {
                    contentType: 'CALLOUT', title: 'felicitations', order: 3,
                    content: `🎉 **Félicitations — Vous avez terminé la formation !**

Vous savez maintenant :
✅ Automatiser Excel avec Python (openpyxl, pandas)
✅ Insérer des formules complexes (VLOOKUP, SUMIFS, INDEX/MATCH) par programmation
✅ Créer des graphiques professionnels (barres, courbes, camemberts)
✅ Rédiger des prompts IA efficaces pour générer des images
✅ Combiner tout en un pipeline automatisé complet

**Prochain niveau** → Explorez la formation *Antigravity Excel Avancé* pour les Tableaux Croisés Dynamiques, la mise en forme conditionnelle et la consolidation de classeurs !`
                }
            ]
        }
    ];

    // Insérer les nouvelles leçons
    for (const lessonData of newLessons) {
        const { contents, ...lessonFields } = lessonData;

        // Vérifier si la leçon existe déjà
        const existing = await prisma.lesson.findFirst({
            where: { courseId: course.id, order: lessonFields.order }
        });

        let lesson;
        if (existing) {
            lesson = await prisma.lesson.update({
                where: { id: existing.id },
                data: { ...lessonFields }
            });
            console.log(`Leçon ${lessonFields.order} mise à jour`);
        } else {
            lesson = await prisma.lesson.create({
                data: {
                    title: lessonFields.title,
                    title_en: lessonFields.title_en,
                    title_ar: lessonFields.title_ar,
                    order: lessonFields.order,
                    duration: 30,
                    courseId: course.id,
                }
            });
            console.log(`Leçon ${lessonFields.order} créée`);
        }

        // Supprimer les anciens contenus si mise à jour
        if (existing) {
            await prisma.courseContent.deleteMany({ where: { lessonId: lesson.id } });
        }

        // Créer les contenus
        for (const content of contents) {
            await prisma.courseContent.create({
                data: { ...content, lessonId: lesson.id }
            });
        }
        console.log(`  → ${contents.length} contenus créés`);
    }

    // Mettre à jour le nombre de leçons dans la description du cours
    await prisma.course.update({
        where: { id: course.id },
        data: { updatedAt: new Date() }
    });

    console.log('\n✅ Formation mise à jour avec 4 nouvelles leçons !');
    console.log('   → Leçon 7: Formules Excel Avancées (VLOOKUP, SUMIFS, INDEX/MATCH)');
    console.log('   → Leçon 8: Graphiques Professionnels Python & Excel');
    console.log('   → Leçon 9: Prompts IA & Génération d\'Images');
    console.log('   → Leçon 10: Projet Final Automatisation Complète');
}

main().catch(console.error).finally(() => prisma.$disconnect());
