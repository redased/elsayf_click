
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { addXp } from '@/lib/gamification';

export async function POST(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { lessonId, courseId } = await request.json();

        if (!lessonId || !courseId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });

        // 1. Marquer la leçon comme terminée
        const lessonProgress = await prisma.userLessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lessonId
                }
            },
            update: { completed: true, completedAt: new Date() },
            create: {
                userId: user.id,
                lessonId: lessonId,
                completed: true,
                completedAt: new Date()
            }
        });

        // 2. Calculer la progression globale du cours
        const totalLessons = await prisma.lesson.count({
            where: { courseId: courseId }
        });

        const completedLessons = await prisma.userLessonProgress.count({
            where: {
                userId: user.id,
                lesson: { courseId: courseId },
                completed: true
            }
        });

        const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        // 3. Mettre à jour la progression du cours
        const courseProgress = await prisma.courseProgress.upsert({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            },
            update: {
                progress: progressPercent,
                completed: progressPercent === 100,
                lastAccessed: new Date()
            },
            create: {
                userId: user.id,
                courseId: courseId,
                progress: progressPercent,
                completed: progressPercent === 100,
                lastAccessed: new Date()
            }
        });

        // Gamification : Si c'est la première fois qu'on finit cette leçon
        if (lessonProgress.completedAt && lessonProgress.createdAt.getTime() === lessonProgress.completedAt.getTime()) {
            // +50 XP par leçon (approximation, à affiner si déjà complété avant)
            // ici upsert renvoie l'objet à jour, difficile de savoir si c'était déjà completed avant sans faire un fetch avant.
            // Simplification : on donne de l'XP à chaque "completion" explicite via l'UI même si repetée pour l'instant, ou on verifie avant.
            // Mieux : checker si c'était déjà true.
            // Pour l'instant on ajoute 50 XP
            await addXp(user.id, 50);
        }

        if (progressPercent === 100 && courseProgress.completed) {
            // Bonus de fin de cours : +500 XP
            // A gérer pour ne donner qu'une fois
        }

        return NextResponse.json({
            lessonProgress,
            courseProgress,
            newProgress: progressPercent
        });

    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
