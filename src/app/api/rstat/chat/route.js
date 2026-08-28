export const maxDuration = 120;

import { auth } from '@/auth';
import OpenAI from 'openai';

const enc = new TextEncoder();
const sse = (obj) => enc.encode(`data: ${JSON.stringify(obj)}\n\n`);

function makeSystemPrompt(codeContext) {
    return `Tu es un expert R, statistiques et data science, assistant sur la plateforme Elsayf.

CODE R DANS L'ÉDITEUR:
\`\`\`r
${codeContext || '# Aucun code'}
\`\`\`

Instructions: réponds en français, spécialise-toi en tidyverse/ggplot2/dplyr/finance quantitative. Propose du code R corrigé si pertinent. Sois clair et concis.`;
}

function makeClient() {
    // 1. OpenRouter (prioritaire)
    if (process.env.OPENROUTER_API_KEY) {
        return {
            client: new OpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
                defaultHeaders: {
                    'HTTP-Referer': 'https://elsayf.statlabo.com',
                    'X-Title': 'Elsayf Platform',
                },
            }),
            model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
            thinking: false,
        };
    }
    // 2. NVIDIA GLM-5 (fallback)
    if (process.env.NVIDIA_API_KEY) {
        return {
            client: new OpenAI({
                baseURL: 'https://integrate.api.nvidia.com/v1',
                apiKey: process.env.NVIDIA_API_KEY,
            }),
            model: 'z-ai/glm5',
            thinking: true,
        };
    }
    // 3. Z-AI (fallback)
    if (process.env.Z_AI_API_KEY) {
        return {
            client: new OpenAI({
                baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
                apiKey: process.env.Z_AI_API_KEY,
            }),
            model: 'glm-4-flash',
            thinking: false,
        };
    }
    return null;
}

export async function POST(request) {
    const session = await auth();
    if (!session) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });

    const role = session.user.role;
    const hasAccess = role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'R_STAT_ADMIN' || session.user.rStatAdminAccess === true;
    if (!hasAccess) return new Response(JSON.stringify({ error: 'Accès refusé' }), { status: 403 });

    const { messages, codeContext } = await request.json();
    const systemPrompt = makeSystemPrompt(codeContext);
    const provider = makeClient();

    const stream = new ReadableStream({
        async start(controller) {
            if (!provider) {
                controller.enqueue(sse({ t: 'error', v: 'Aucun provider AI configuré. Ajoutez OPENROUTER_API_KEY dans le .env' }));
                controller.close();
                return;
            }
            try {
                const params = {
                    model: provider.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...(messages || []).map(m => ({ role: m.role, content: m.content })),
                    ],
                    temperature: 0.7,
                    max_tokens: 4096,
                    stream: true,
                };
                if (provider.thinking) {
                    params.extra_body = { chat_template_kwargs: { enable_thinking: true, clear_thinking: false } };
                }

                const aiStream = await provider.client.chat.completions.create(params);

                for await (const chunk of aiStream) {
                    const delta = chunk.choices?.[0]?.delta;
                    if (!delta) continue;
                    if (delta.reasoning_content) controller.enqueue(sse({ t: 'r', v: delta.reasoning_content }));
                    if (delta.content) controller.enqueue(sse({ t: 'c', v: delta.content }));
                }

                controller.enqueue(sse({ t: 'done' }));
                controller.close();
            } catch (err) {
                console.error('[rstat/chat]', err.message);
                controller.enqueue(sse({ t: 'error', v: err.message }));
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
