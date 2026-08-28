import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';

export const maxDuration = 120; // Allow sufficient time for AI rewriting of multiple contents

async function enrichContent(content) {
    const systemPrompt = `Tu es un robot agent spécialisé dans l'enrichissement pédagogique interactif de cours.
Ton rôle est d'analyser le texte au format Markdown d'un cours et d'y insérer des widgets interactifs personnalisés pour aider les débutants à comprendre.

Voici les widgets interactifs supportés. Tu dois transformer les éléments statiques du cours en ces formats :

1. Bloc CodeTutor (\`\`\`codetutor ... \`\`\`) :
A utiliser pour expliquer des scripts Python/R. Tu dois remplacer le code statique ou ajouter un tuteur pour expliquer le code pas-à-pas avec l'état de la mémoire (variables).
Exemple :
\`\`\`codetutor
{
  "title": "Les variables en Python",
  "code": "age = 20\\nnom = \\"Alice\\"",
  "steps": [
    { "line": 1, "explanation": "Création de la variable 'age' valant 20.", "variables": { "age": 20 } },
    { "line": 2, "explanation": "Création de la variable 'nom' valant 'Alice'.", "variables": { "age": 20, "nom": "Alice" } }
  ]
}
\`\`\`

2. Graphique Interactif (\`\`\`chart ... \`\`\`) :
A utiliser s'il y a des données chiffrées, des tendances ou des statistiques. Type : "line", "bar", "area", "scatter".
Exemple :
\`\`\`chart
{
  "title": "Ventes annuelles",
  "type": "line",
  "keys": ["Ventes"],
  "colors": ["#3b82f6"],
  "labels": { "Ventes": "Chiffre d'affaires" },
  "data": [
    { "name": "Janvier", "Ventes": 1200 },
    { "name": "Février", "Ventes": 1500 }
  ],
  "description": "Progression constante sur le premier bimestre."
}
\`\`\`

3. Tableau Dynamique (\`\`\`tableinteractive ... \`\`\`) :
A utiliser pour les listes, les tableaux de chiffres ou les classements.
Exemple :
\`\`\`tableinteractive
{
  "title": "Notes des élèves",
  "headers": ["Nom", "Note"],
  "rows": [
    ["Alice", 18],
    ["Bob", 14]
  ]
}
\`\`\`

4. Repère 3D (\`\`\`threed ... \`\`\`) :
A utiliser s'il y a des coordonnées tridimensionnelles, des clusters ou des points dans l'espace.
Exemple :
\`\`\`threed
{
  "title": "Nuage de points 3D",
  "points": [
    { "x": 0.5, "y": 0.3, "z": -0.2, "color": "#3b82f6", "label": "Groupe Alpha" }
  ]
}
\`\`\`

CONSIGNES STRICTES :
- Conserve absolument TOUT le texte d'origine, les titres, le formatage, les paragraphes et le style. Ne supprime rien et n'ajoute pas de commentaires d'introduction.
- Remplace uniquement les blocs de code standard appropriés ou les tableaux textes bruts par les widgets interactifs correspondants.
- N'insère pas d'explications superflues en dehors du markdown réécrit complet. Retourne uniquement le markdown enrichi.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Voici le contenu markdown de la leçon à enrichir :\n\n${content}` }
    ];

    let enrichedMarkdown = '';

    // 1. Try OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
        const client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: { 'HTTP-Referer': 'https://elsayf.statlabo.com', 'X-Title': 'Elsayf Platform' }
        });
        const res = await client.chat.completions.create({
            model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
            messages: messages,
            max_tokens: 3500,
            temperature: 0.2
        });
        enrichedMarkdown = res.choices[0]?.message?.content;
    } else if (process.env.GEMINI_API_KEY) {
        // Fallback Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const prompt = messages.map(m => `${m.role === 'system' ? 'System' : 'User'}: ${m.content}`).join('\n\n');
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await res.json();
        enrichedMarkdown = data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!enrichedMarkdown) {
        throw new Error("Aucune réponse de l'AI");
    }

    // Clean code block ticks if LLM wrapped the output in ```markdown ... ```
    let clean = enrichedMarkdown.trim();
    if (clean.startsWith('```markdown')) {
        clean = clean.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } else if (clean.startsWith('```') && clean.endsWith('```')) {
        clean = clean.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return clean.trim();
}

export async function POST(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const { lessonId, forceAll } = await request.json().catch(() => ({}));

        // Fetch course details
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                    include: {
                        contents: { orderBy: { order: 'asc' } }
                    }
                }
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const logs = [];
        let updatedCount = 0;

        // Determine which contents to process
        let contentsToProcess = [];

        for (const lesson of course.lessons) {
            if (lessonId && lesson.id !== lessonId) continue;

            for (const contentBlock of lesson.contents) {
                if (contentBlock.contentType !== 'text') continue;

                // Check if it already contains interactive widgets
                const hasWidgets = contentBlock.content.includes('```codetutor') ||
                                   contentBlock.content.includes('```chart') ||
                                   contentBlock.content.includes('```tableinteractive') ||
                                   contentBlock.content.includes('```threed');

                if (!hasWidgets || forceAll) {
                    contentsToProcess.push({
                        blockId: contentBlock.id,
                        lessonTitle: lesson.title,
                        blockTitle: contentBlock.title,
                        content: contentBlock.content
                    });
                } else {
                    logs.push({
                        lesson: lesson.title,
                        block: contentBlock.title,
                        status: 'already_enriched',
                        message: 'Déjà enrichi avec des widgets interactifs.'
                    });
                }
            }
        }

        // Process blocks sequentially with AI
        for (const block of contentsToProcess) {
            try {
                const enriched = await enrichContent(block.content);
                
                await prisma.courseContent.update({
                    where: { id: block.blockId },
                    data: { content: enriched }
                });

                logs.push({
                    lesson: block.lessonTitle,
                    block: block.blockTitle,
                    status: 'success',
                    message: 'Enrichissement interactif terminé avec succès.'
                });
                updatedCount++;
            } catch (err) {
                console.error(`[Enricher] Failed to enrich block ${block.blockId}:`, err);
                logs.push({
                    lesson: block.lessonTitle,
                    block: block.blockTitle,
                    status: 'error',
                    message: `Échec de l'enrichissement : ${err.message}`
                });
            }
        }

        return NextResponse.json({
            success: true,
            updatedCount,
            logs
        });

    } catch (error) {
        console.error('[enrich-course]', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
