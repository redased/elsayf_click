export const maxDuration = 120;

import { auth } from '@/auth';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

const enc = new TextEncoder();
const sse = (obj) => enc.encode(`data: ${JSON.stringify(obj)}\n\n`);

const TOOLS = [
    {
        type: 'function',
        function: {
            name: 'list_files',
            description: 'Liste tous les fichiers Python de l\'utilisateur, groupés par projet',
            parameters: { type: 'object', properties: {}, required: [] }
        }
    },
    {
        type: 'function',
        function: {
            name: 'read_file',
            description: 'Lit le contenu d\'un fichier Python',
            parameters: {
                type: 'object',
                properties: {
                    project: { type: 'string', description: 'Nom du projet' },
                    name: { type: 'string', description: 'Nom du fichier (ex: main.py)' }
                },
                required: ['project', 'name']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'write_file',
            description: 'Crée ou met à jour un fichier Python avec le contenu fourni. Utilise cette fonction pour ajouter directement du code dans un fichier.',
            parameters: {
                type: 'object',
                properties: {
                    project: { type: 'string', description: 'Nom du projet (utilise "default" si pas précisé)' },
                    name: { type: 'string', description: 'Nom du fichier avec extension .py' },
                    content: { type: 'string', description: 'Contenu Python complet du fichier' }
                },
                required: ['project', 'name', 'content']
            }
        }
    }
];

async function executeTool(toolName, args, userId) {
    if (toolName === 'list_files') {
        const files = await prisma.userFile.findMany({
            where: { userId, language: 'python' },
            select: { name: true, project: true, updatedAt: true },
            orderBy: { project: 'asc' }
        });
        const grouped = {};
        for (const f of files) {
            if (!grouped[f.project]) grouped[f.project] = [];
            grouped[f.project].push(f.name);
        }
        return JSON.stringify(grouped);
    }

    if (toolName === 'read_file') {
        const file = await prisma.userFile.findFirst({
            where: { userId, name: args.name, project: args.project || 'default', language: 'python' }
        });
        if (!file) return `Fichier "${args.name}" introuvable dans le projet "${args.project}".`;
        return file.content;
    }

    if (toolName === 'write_file') {
        const project = args.project || 'default';
        let name = args.name;
        if (!name.endsWith('.py')) name += '.py';
        await prisma.userFile.upsert({
            where: { userId_name_language_project: { userId, name, language: 'python', project } },
            update: { content: args.content },
            create: { userId, name, content: args.content, language: 'python', project }
        });
        return `✅ Fichier "${name}" sauvegardé dans le projet "${project}".`;
    }

    return 'Outil inconnu.';
}

function makeSystemPrompt(codeContext) {
    return `Tu es un assistant expert Python sur la plateforme Elsayf. Tu peux manipuler directement les fichiers de l'utilisateur.

CODE ACTUELLEMENT OUVERT DANS L'ÉDITEUR:
\`\`\`python
${codeContext || '# Aucun fichier ouvert'}
\`\`\`

Instructions:
- Réponds en français, sois concis et précis.
- Quand l'utilisateur veut créer, modifier ou ajouter du code dans un fichier, utilise DIRECTEMENT l'outil write_file sans demander confirmation.
- Quand tu proposes du code inline (pas dans un fichier), mets-le dans un bloc \`\`\`python ... \`\`\`.
- Après avoir utilisé write_file, annonce ce que tu as fait.`;
}

function makeClient() {
    if (process.env.OPENROUTER_API_KEY) {
        return {
            client: new OpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
                defaultHeaders: { 'HTTP-Referer': 'https://elsayf.click', 'X-Title': 'Elsayf Platform' },
            }),
            model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
        };
    }
    if (process.env.NVIDIA_API_KEY) {
        return {
            client: new OpenAI({
                baseURL: 'https://integrate.api.nvidia.com/v1',
                apiKey: process.env.NVIDIA_API_KEY,
            }),
            model: 'z-ai/glm5',
        };
    }
    if (process.env.Z_AI_API_KEY) {
        return {
            client: new OpenAI({
                baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
                apiKey: process.env.Z_AI_API_KEY,
            }),
            model: 'glm-4-flash',
        };
    }
    return null;
}

export async function POST(request) {
    const session = await auth();
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

    const { messages, codeContext } = await request.json();
    const provider = makeClient();

    const stream = new ReadableStream({
        async start(controller) {
            if (!provider) {
                controller.enqueue(sse({ t: 'error', v: 'Aucun provider AI configuré.' }));
                controller.close();
                return;
            }

            try {
                const apiMessages = [
                    { role: 'system', content: makeSystemPrompt(codeContext) },
                    ...(messages || []).map(m => ({ role: m.role, content: m.content }))
                ];

                // Agentic loop — max 5 tool call rounds
                let filesChanged = false;
                for (let round = 0; round < 5; round++) {
                    const response = await provider.client.chat.completions.create({
                        model: provider.model,
                        messages: apiMessages,
                        tools: TOOLS,
                        tool_choice: 'auto',
                        temperature: 0.7,
                        max_tokens: 4096,
                    });

                    const msg = response.choices[0]?.message;
                    if (!msg) break;

                    // If no tool calls → stream final text response
                    if (!msg.tool_calls || msg.tool_calls.length === 0) {
                        const content = msg.content || '';
                        // Stream word by word for natural feel
                        const words = content.split(/(?<=\s)/);
                        for (const word of words) {
                            controller.enqueue(sse({ t: 'c', v: word }));
                        }
                        if (filesChanged) controller.enqueue(sse({ t: 'files_changed' }));
                        controller.enqueue(sse({ t: 'done' }));
                        controller.close();
                        return;
                    }

                    // Execute tool calls
                    apiMessages.push({ role: 'assistant', content: msg.content || '', tool_calls: msg.tool_calls });

                    for (const toolCall of msg.tool_calls) {
                        const toolName = toolCall.function.name;
                        let args = {};
                        try { args = JSON.parse(toolCall.function.arguments); } catch {}

                        // Notify frontend about tool call
                        controller.enqueue(sse({ t: 'tool_call', name: toolName, args }));

                        const result = await executeTool(toolName, args, dbUser.id);

                        if (toolName === 'write_file') filesChanged = true;

                        controller.enqueue(sse({ t: 'tool_result', name: toolName, result }));

                        apiMessages.push({
                            role: 'tool',
                            tool_call_id: toolCall.id,
                            content: result
                        });
                    }
                }

                controller.enqueue(sse({ t: 'done' }));
                controller.close();
            } catch (err) {
                console.error('[code/chat]', err.message);
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
