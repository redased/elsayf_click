import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

async function getUser(session) {
    return prisma.user.findUnique({ where: { email: session.user.email } });
}

// GET /api/user/files?language=python&project=monprojet
export async function GET(req) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const language = req.nextUrl.searchParams.get('language') || 'python';
    const project = req.nextUrl.searchParams.get('project');
    const dbUser = await getUser(session);
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const where = { userId: dbUser.id, language };
    if (project) where.project = project;

    const files = await prisma.userFile.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, name: true, project: true, updatedAt: true }
    });

    // Retourner aussi la liste des projets distincts
    const allProjects = await prisma.userFile.findMany({
        where: { userId: dbUser.id },
        select: { project: true },
        distinct: ['project'],
        orderBy: { project: 'asc' }
    });

    const projects = allProjects.map(p => p.project);

    return NextResponse.json({ files, projects });
}

// POST /api/user/files  { name, content, language, project }
export async function POST(req) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, content, language = 'python', project = 'default' } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 });

    const dbUser = await getUser(session);
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const file = await prisma.userFile.upsert({
        where: { userId_name_language_project: { userId: dbUser.id, name: name.trim(), language, project } },
        update: { content: content ?? '' },
        create: { userId: dbUser.id, name: name.trim(), content: content ?? '', language, project }
    });

    return NextResponse.json({ file });
}

// DELETE /api/user/files?id=xxx  ou  ?project=xxx (supprime tout le projet)
export async function DELETE(req) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = req.nextUrl.searchParams.get('id');
    const project = req.nextUrl.searchParams.get('project');

    const dbUser = await getUser(session);
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (id) {
        await prisma.userFile.deleteMany({ where: { id, userId: dbUser.id } });
    } else if (project) {
        await prisma.userFile.deleteMany({ where: { project, userId: dbUser.id } });
    }

    return NextResponse.json({ success: true });
}

// PATCH /api/user/files  { id }  — charger contenu complet
export async function PATCH(req) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const dbUser = await getUser(session);
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const file = await prisma.userFile.findFirst({ where: { id, userId: dbUser.id } });
    if (!file) return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });

    return NextResponse.json({ file });
}
