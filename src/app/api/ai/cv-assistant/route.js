import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const body = await request.json();
        const { question, history, currentCvData } = body;

        if (!question?.trim()) {
            return NextResponse.json({ error: 'Question vide' }, { status: 400 });
        }

        const systemPrompt = `Tu es un Expert Recruteur & Rédacteur de CV professionnel d'élite sur MyCV.click et la plateforme Elsayf.
Ta mission est d'aider les candidats à créer des CV percutants, 100% compatibles avec les filtres ATS (Applicant Tracking Systems) et appréciés des recruteurs.

RÈGLES D'OR DE RÉPONSE :
1. Réponds en français de façon chaleureuse, professionnelle et structurée.
2. Si l'utilisateur te partage son parcours (texte brut, notes d'expérience, bio, profil LinkedIn, etc.) OU te demande de remplir / améliorer son CV :
   - Présente une synthèse claire de son profil avec ses points forts.
   - Donne 2 ou 3 conseils ATS concrets.
   - Termine OBLIGATOIREMENT ta réponse en insérant le tag spécial suivant sur UNE SEULE LIGNE :
     [AUTO_FILL_CV: {"personal":{"firstName":"","lastName":"","title":"","email":"","phone":"","city":"","mobility":"","website":"","linkedin":"","github":"","summary":""},"skills":[{"name":"","level":85,"category":"hard"}],"softSkills":[],"tools":[],"languages":[{"name":"","level":""}],"experiences":[{"id":"exp-1","position":"","company":"","city":"","startDate":"YYYY-MM","endDate":"","current":false,"description":"• Réalisation chiffrée avec verbe d'action"}],"education":[{"id":"edu-1","degree":"","school":"","city":"","year":"YYYY","description":""}],"projects":[]}]

3. FORMAT DU TAG [AUTO_FILL_CV: ...] :
   - Le contenu à l'intérieur de [AUTO_FILL_CV: ...] DOIT être un JSON valide (guillemets doubles stricts, pas de retours à la ligne à l'intérieur du JSON).
   - Conserve les données déjà existantes de l'utilisateur si elles sont pertinentes, et enrichis-les.
   - Rédige pour les expériences des descriptions professionnelles à puces débutant par des verbes d'action avec des réalisations mesurables (%, volume, délai, budget).
   - Rédige un résumé professionnel captivant (3-4 lignes) mettant en valeur ses compétences clés.

4. Si l'utilisateur pose une simple question de conseil (ex: "Quelle couleur choisir ?", "Faut-il une photo ?"), réponds précisément comme un coach carrière sans générer le tag [AUTO_FILL_CV: ...] à moins qu'une mise à jour de son CV ne soit nécessaire.

Données actuelles du CV du candidat (si disponibles) :
${currentCvData ? JSON.stringify(currentCvData).substring(0, 3000) : 'Aucune donnée préalable'}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []),
            { role: 'user', content: question }
        ];

        let answer = '';

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
                    max_tokens: 2048,
                    temperature: 0.6,
                });
                answer = res.choices[0]?.message?.content || '';
                if (answer) return NextResponse.json({ answer });
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur OpenRouter fallback:', err.message);
            }
        }

        // 2. OpenAI direct (fallback)
        if (process.env.OPENAI_API_KEY) {
            try {
                const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const res = await client.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages,
                    max_tokens: 2048,
                    temperature: 0.6,
                });
                answer = res.choices[0]?.message?.content || '';
                if (answer) return NextResponse.json({ answer });
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur OpenAI fallback:', err.message);
            }
        }

        // 3. NVIDIA GLM-5 (fallback)
        if (process.env.NVIDIA_API_KEY) {
            try {
                const client = new OpenAI({
                    baseURL: 'https://integrate.api.nvidia.com/v1',
                    apiKey: process.env.NVIDIA_API_KEY,
                });
                const res = await client.chat.completions.create({
                    model: 'z-ai/glm5',
                    messages,
                    max_tokens: 2048,
                    temperature: 0.6,
                });
                answer = res.choices[0]?.message?.content || '';
                if (answer) return NextResponse.json({ answer });
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur NVIDIA fallback:', err.message);
            }
        }

        // 4. Gemini (fallback)
        if (process.env.GEMINI_API_KEY) {
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
                    answer = data.candidates[0].content.parts[0].text;
                    return NextResponse.json({ answer });
                }
            } catch (err) {
                console.warn('[ai/cv-assistant] Erreur Gemini fallback:', err.message);
            }
        }

        return NextResponse.json({ 
            error: 'Aucun service IA disponible actuellement.' 
        }, { status: 503 });

    } catch (error) {
        console.error('[ai/cv-assistant]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
