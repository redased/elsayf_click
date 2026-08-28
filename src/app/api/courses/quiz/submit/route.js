import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const { quizId, answers } = await req.json(); // answers: { questionId: answerId }

        if (!quizId || !answers) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // 1. Fetch Quiz with correct answers
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    include: {
                        answers: true
                    }
                }
            }
        });

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // 2. Grader Logic
        let correctCount = 0;
        let totalQuestions = quiz.questions.length;

        quiz.questions.forEach(q => {
            const userAnswerId = answers[q.id];
            const correctOption = q.answers.find(a => a.isCorrect);

            if (correctOption && userAnswerId === correctOption.id) {
                correctCount++;
            }
        });

        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        const passed = score >= 70; // Pass threshold 70%

        // 3. Check previous results to prevent XP farming
        const previousPass = await prisma.userQuizResult.findFirst({
            where: {
                userId,
                quizId,
                passed: true
            }
        });

        // 4. Save Result
        await prisma.userQuizResult.create({
            data: {
                userId,
                quizId,
                score,
                passed
            }
        });

        // 5. Award XP if passed and first time
        const XP_REWARD = 100;
        let earnedXp = 0;

        if (passed && !previousPass) {
            earnedXp = XP_REWARD;
            await prisma.user.update({
                where: { id: userId },
                data: {
                    xp: { increment: XP_REWARD }
                }
            });
        }

        return NextResponse.json({
            passed,
            score,
            earnedXp,
            message: passed ? 'Quiz réussie !' : 'Essayez encore.'
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
