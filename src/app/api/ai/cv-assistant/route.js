import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Fonction robuste d'extraction et nettoyage du JSON CV
function extractCvDataFromAnswer(text) {
    if (!text) return { cleanText: text || '', cvData: null };

    let cvData = null;
    let cleanText = text;

    // Pattern 1: Tag spécial [AUTO_FILL_CV: { ... }]
    const tagMatch = text.match(/\[AUTO_FILL_CV:\s*({[\s\S]*?})\]/);
    if (tagMatch) {
        cleanText = text.replace(/\[AUTO_FILL_CV:\s*({[\s\S]*?})\]/, '').trim();
        const rawJson = tagMatch[1];
        try {
            cvData = JSON.parse(rawJson);
        } catch (e1) {
            try {
                // Nettoyage des retours chariot et caractères de contrôle à l'intérieur des chaînes
                const sanitized = rawJson
                    .replace(/[\u0000-\u001F]+/g, (ctrl) => (ctrl === '\n' ? '\\n' : ctrl === '\t' ? '\\t' : ' '));
                cvData = JSON.parse(sanitized);
            } catch (e2) {
                try {
                    // Fallback d'évaluation d'objet JS tolérant aux retours à la ligne
                    const evalFn = new Function(`return (${rawJson});`);
                    cvData = evalFn();
                } catch (e3) {
                    console.warn('[ai/cv-assistant] Impossible de parser le JSON CV:', e3.message);
                }
            }
        }
    }

    // Pattern 2: Bloc de code markdown ```json { ... } ```
    if (!cvData) {
        const codeMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
        if (codeMatch) {
            try {
                const parsed = JSON.parse(codeMatch[1]);
                if (parsed.personal || parsed.experiences || parsed.skills || parsed.cv) {
                    cvData = parsed.cv || parsed;
                    cleanText = text.replace(/```(?:json)?\s*({[\s\S]*?})\s*```/, '').trim();
                }
            } catch (e) {
                try {
                    const evalFn = new Function(`return (${codeMatch[1]});`);
                    const parsed = evalFn();
                    if (parsed.personal || parsed.experiences || parsed.skills || parsed.cv) {
                        cvData = parsed.cv || parsed;
                        cleanText = text.replace(/```(?:json)?\s*({[\s\S]*?})\s*```/, '').trim();
                    }
                } catch (err) {}
            }
        }
    }

    return { cleanText, cvData };
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { question, history, currentCvData } = body;

        if (!question?.trim()) {
            return NextResponse.json({ error: 'Question vide' }, { status: 400 });
        }

        const systemPrompt = `Tu es un Expert Recruteur & Rédacteur de CV professionnel d'élite sur MyCV.click et la plateforme Elsayf.
Ta mission est d'analyser le parcours du candidat, d'en faire une synthèse éclatante, et de REMPLIR AUTOMATIQUEMENT l'ensemble des champs de son CV.

RÈGLES D'OR DE RÉDACTION :
1. Adopte un ton valorisant, prestigieux, affirmé et percutant (style cabinet de recrutement exécutif).
2. INTERDICTION ABSOLUE d'écrire des phrases molles ou incertaines comme "probablement d'autres technologies", "vous maîtrisez sans doute", "etc.". Sois précis, affirmatif et valorisant.
3. Rédige une synthèse de profil captivante en Markdown :
   ### 🎯 Profil Cible : [Titre du Poste Visé]
   **Accroche Professionnelle :** [Résumé puissant en 3 lignes valorisant l'expertise, les années de pratique et la valeur ajoutée]
   
   **Piliers d'Excellence & Compétences :**
   - 💻 **Technologies & Outils :** [Liste claire des expertises]
   - 💼 **Expériences Clés :** [Poste, entreprise et réalisations probantes]
   - 🎓 **Formation :** [Diplôme et établissement]

   **Conseils Stratégiques ATS :**
   - [Conseil 1 pour maximiser le passage des filtres]
   - [Conseil 2 pour valoriser les réalisations]

4. Termine OBLIGATOIREMENT ta réponse en insérant le tag spécial suivant sur UNE SEULE LIGNE :
   [AUTO_FILL_CV: {"personal":{"firstName":"","lastName":"","title":"","email":"","phone":"","city":"","mobility":"Télétravail & Hybride","website":"","linkedin":"","github":"","summary":""},"skills":[{"name":"","level":85,"category":"hard"}],"softSkills":[],"tools":[],"languages":[{"name":"","level":""}],"experiences":[{"id":"exp-1","position":"","company":"","city":"","startDate":"YYYY-MM","endDate":"","current":false,"description":"• Réalisation chiffrée avec verbe d'action"}],"education":[{"id":"edu-1","degree":"","school":"","city":"","year":"YYYY","description":""}],"projects":[]}]

5. DÉTAIL DU JSON [AUTO_FILL_CV: ...] :
   - Extrais le prénom et le nom si mentionnés.
   - "personal.title" : Donne un intitulé de poste noble et précis (ex: "Lead Développeur Full-Stack Python & React / Cloud & SQL").
   - "personal.summary" : Rédige une biographie professionnelle de haute volée (3-4 lignes denses, engageantes, axées sur les résultats).
   - "experiences" : Transforme chaque expérience en puces percutantes commençant par des verbes d'action avec métriques (ex: "• Développement d'APIs REST sous Django et FastAPI traitant 50k requêtes/jour").
   - "skills" : Liste 4 à 8 compétences techniques majeures avec leur niveau (85 à 95).
   - "tools" : Les outils logiciels professionnels (Docker, Git, SQL, Linux, etc.).
   - "education" : Le diplôme et l'école.

Données actuelles du CV du candidat (si disponibles) :
${currentCvData ? JSON.stringify(currentCvData).substring(0, 3000) : 'Aucune donnée préalable'}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []),
            { role: 'user', content: question }
        ];

        let rawAnswer = '';

        // 1. OpenRouter (prioritaire)
        if (process.env.OPENROUTER_API_KEY) {
            try {
                const client = new OpenAI({
                    baseURL: 'https://openrouter.ai/api/v1',
                    apiKey: process.env.OPENROUTER_API_KEY,
                    defaultHeaders: {
                        'HTTP-Referer': 'https://mycv.click',
                        'X-Title': 'MyCV AI Assistant',
                    },
                });
                const res = await client.chat.completions.create({
                    model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
                    messages,
                    max_tokens: 2500,
                    temperature: 0.3,
                });
                rawAnswer = res.choices[0]?.message?.content || '';
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur OpenRouter fallback:', err.message);
            }
        }

        // 2. OpenAI direct (fallback)
        if (!rawAnswer && process.env.OPENAI_API_KEY) {
            try {
                const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const res = await client.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages,
                    max_tokens: 2500,
                    temperature: 0.3,
                });
                rawAnswer = res.choices[0]?.message?.content || '';
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur OpenAI fallback:', err.message);
            }
        }

        // 3. NVIDIA GLM-5 (fallback)
        if (!rawAnswer && process.env.NVIDIA_API_KEY) {
            try {
                const client = new OpenAI({
                    baseURL: 'https://integrate.api.nvidia.com/v1',
                    apiKey: process.env.NVIDIA_API_KEY,
                });
                const res = await client.chat.completions.create({
                    model: 'z-ai/glm5',
                    messages,
                    max_tokens: 2500,
                    temperature: 0.3,
                });
                rawAnswer = res.choices[0]?.message?.content || '';
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur NVIDIA fallback:', err.message);
            }
        }

        // 4. Gemini (fallback)
        if (!rawAnswer && process.env.GEMINI_API_KEY) {
            try {
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
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    rawAnswer = data.candidates[0].content.parts[0].text;
                }
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur Gemini fallback:', err.message);
            }
        }

        if (!rawAnswer) {
            return NextResponse.json({ 
                error: 'Aucun service IA disponible actuellement.' 
            }, { status: 503 });
        }

        // Extraction et traitement des données CV
        const { cleanText, cvData } = extractCvDataFromAnswer(rawAnswer);

        return NextResponse.json({
            success: true,
            answer: cleanText || rawAnswer,
            hasCvData: Boolean(cvData),
            cvData: cvData || null
        });

    } catch (error) {
        console.error('[ai/cv-assistant]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
