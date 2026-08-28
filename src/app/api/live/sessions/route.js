import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

const STORE = path.join(process.cwd(), '.live_sessions.json');

function readSessions() {
    try {
        if (fs.existsSync(STORE)) {
            return JSON.parse(fs.readFileSync(STORE, 'utf8'));
        }
    } catch {}
    return {};
}

function writeSessions(data) {
    fs.writeFileSync(STORE, JSON.stringify(data, null, 2), 'utf8');
}

// GET — public: returns active sessions list
export async function GET() {
    const sessions = readSessions();
    // Return array of active room IDs with metadata
    const active = Object.entries(sessions)
        .filter(([, s]) => s.active)
        .map(([id, s]) => ({
            id,
            label: s.label,
            icon: s.icon,
            color: s.color,
            startedAt: s.startedAt,
            startedBy: s.startedBy,
        }));
    return NextResponse.json({ sessions: active });
}

// POST — admin only: toggle a session on/off
export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const role = session.user?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { roomId, label, icon, color, active } = await request.json();
    if (!roomId) return NextResponse.json({ error: 'roomId requis' }, { status: 400 });

    const sessions = readSessions();

    if (active) {
        sessions[roomId] = {
            active: true,
            label: label || roomId,
            icon: icon || '🎥',
            color: color || 'from-violet-600 to-indigo-600',
            startedAt: new Date().toISOString(),
            startedBy: session.user.name || session.user.email,
        };
    } else {
        delete sessions[roomId];
    }

    writeSessions(sessions);
    return NextResponse.json({ ok: true, sessions });
}
