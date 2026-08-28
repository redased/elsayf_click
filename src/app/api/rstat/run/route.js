import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function POST(request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const role = session.user.role;
    const hasAccess =
        role === 'SUPER_ADMIN' ||
        role === 'ADMIN' ||
        role === 'R_STAT_ADMIN' ||
        session.user.rStatAdminAccess === true;

    if (!hasAccess) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
        }

        const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const tempDir = os.tmpdir();
        const rFile  = path.join(tempDir, `rcode_${id}.R`);
        const pngFile = path.join(tempDir, `rplot_${id}.png`);

        // Wrap user code so any plot (base R or ggplot2) is captured to PNG
        const wrappedCode = `
# ── Auto-capture graphiques ──────────────────────────────────────────────
png("${pngFile}", width = 900, height = 580, res = 110, bg = "#1e1e1e")
tryCatch({
${code}
}, error = function(e) { message(e$message) })
invisible(dev.off())
# ─────────────────────────────────────────────────────────────────────────
`;

        await fs.writeFile(rFile, wrappedCode, 'utf8');

        return new Promise((resolve) => {
            exec(
                `Rscript --vanilla "${rFile}" 2>&1`,
                { timeout: 30000, maxBuffer: 2 * 1024 * 1024 },
                async (error, stdout) => {
                    await fs.unlink(rFile).catch(() => {});

                    const output = stdout || (error ? error.message : '(Aucune sortie)');

                    // Try to read the PNG
                    let plot = null;
                    try {
                        const pngBuf = await fs.readFile(pngFile);
                        // Only return if the file has actual content (>5 KB = real plot)
                        if (pngBuf.length > 5000) {
                            plot = `data:image/png;base64,${pngBuf.toString('base64')}`;
                        }
                        await fs.unlink(pngFile).catch(() => {});
                    } catch (_) {
                        // No plot generated, that's fine
                    }

                    resolve(NextResponse.json({ output, plot }));
                }
            );
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
