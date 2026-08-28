import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const { question, context, history } = await request.json();
        if (!question?.trim()) return NextResponse.json({ error: 'Question vide' }, { status: 400 });

        const systemPrompt = `Tu es un assistant pédagogique sur la plateforme Elsayf. Réponds en français, de façon claire et concise.
Contexte de la leçon : ${context || 'Aucun contexte fourni'}

FONCTIONNALITÉS SPÉCIALES :
1. ANALYSE DE FICHIERS JOINTS :
Si l'utilisateur te transmet un fichier joint (représenté par [FICHIER JOINT: nom.xlsx] ou [FICHIER JOINT: nom.txt] avec ses données textuelles/tabulaires), lis-le attentivement, réponds à ses questions sur les données, effectue des calculs, des tris, des filtrages ou propose des modifications.

2. SPREADSHEET STYLISÉ ET GRAPHIQUES INTERACTIFS (EXCEL) :
Si l'utilisateur demande de créer, générer, styliser ou tracer un graphique à partir de données Excel :
- Explique brièvement ce que contient le document et la structure proposée.
- Termine OBLIGATOIREMENT ta réponse en incluant le tag spécial [GENERATE_EXCEL: ...] contenant un JSON valide sur une seule ligne.
- Ce JSON peut contenir des attributs optionnels de style et de graphique :
  {
    "data": [["En-tête 1", "En-tête 2"], ["Valeur 1", 120]],
    "styles": {
      "headerBg": "#1e3a8a",       // Couleur hexadécimale du fond d'en-tête (ex: #1e3a8a, #10b981, #f59e0b, #ef4444, #8b5cf6, #3b82f6)
      "headerColor": "#ffffff",    // Couleur hexadécimale du texte d'en-tête
      "rowStriping": true,         // true/false pour l'alternance de lignes grises/blanches
      "highlightRows": [           // Mises en forme conditionnelles de lignes selon les valeurs d'une colonne
        {"column": "Satisfaction", "operator": "<", "value": 90, "bg": "#fef2f2", "color": "#991b1b"}
      ]
    },
    "chart": {
      "type": "bar",               // "bar" (histogramme), "line" (courbe), ou "pie" (secteurs)
      "xAxis": "En-tête 1",        // Colonne pour l'axe X
      "yAxis": ["En-tête 2"]       // Tableau des colonnes numériques pour l'axe Y
    }
  }

Exemple pour Excel stylisé avec graphique :
[GENERATE_EXCEL: {"data": [["Région", "Ventes", "Satisfaction"], ["Alger", 120, 94], ["Oran", 85, 88]], "styles": {"headerBg": "#10b981", "headerColor": "#ffffff", "rowStriping": true, "highlightRows": [{"column": "Satisfaction", "operator": "<", "value": 90, "bg": "#fef2f2", "color": "#991b1b"}]}, "chart": {"type": "bar", "xAxis": "Région", "yAxis": ["Ventes"]}}]

3. FORMAT WORD :
Si l'utilisateur te demande de générer un rapport Word (.doc) :
- Termine OBLIGATOIREMENT par le tag :
[GENERATE_WORD: {"title": "Titre", "notes": "Notes explicatives", "tableData": [["H1", "H2"], ["V1", "V2"]]}]

Veille à ce que le JSON soit parfaitement valide (double-quotes uniquement) et que tout le tag soit sur une seule ligne (aucun retour à la ligne à l'intérieur du tag).`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []),
            { role: 'user', content: question }
        ];

        let answer = '';

        // ── 1. OpenRouter (prioritaire) ──────────────────────────────────
        if (process.env.OPENROUTER_API_KEY) {
            const client = new OpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
                defaultHeaders: {
                    'HTTP-Referer': 'https://elsayf.statlabo.com',
                    'X-Title': 'Elsayf Platform',
                },
            });
            const res = await client.chat.completions.create({
                model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7,
            });
            answer = res.choices[0]?.message?.content || 'Pas de réponse.';
            return NextResponse.json({ answer });
        }

        // ── 2. NVIDIA GLM-5 (fallback) ───────────────────────────────────
        if (process.env.NVIDIA_API_KEY) {
            const client = new OpenAI({
                baseURL: 'https://integrate.api.nvidia.com/v1',
                apiKey: process.env.NVIDIA_API_KEY,
            });
            const res = await client.chat.completions.create({
                model: 'z-ai/glm5',
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7,
            });
            answer = res.choices[0]?.message?.content || 'Pas de réponse.';
            return NextResponse.json({ answer });
        }

        // ── 3. Gemini (fallback) ─────────────────────────────────────────
        if (process.env.GEMINI_API_KEY) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
            const prompt = messages.map(m => `${m.role === 'system' ? 'System' : m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`).join('\n\n');
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse.';
            return NextResponse.json({ answer });
        }

        return NextResponse.json({ error: 'Aucun provider AI configuré. Ajoutez OPENROUTER_API_KEY dans le .env' }, { status: 500 });

    } catch (error) {
        console.error('[ai/ask]', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
