import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
        }

        // Récupérer l'utilisateur réel depuis la DB par email
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });
        if (!dbUser) {
            return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
        }
        const userId = dbUser.id;

        // 1. Fetch Course details
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // 2. Check existing enrollment
        const existingEnrollment = await prisma.courseEnrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (existingEnrollment) {
            return NextResponse.json({ message: 'Already enrolled' });
        }

        // 3. Handle Enrollment based on type
        if (course.isFree) {
            // Free Enrollment
            await prisma.courseEnrollment.create({
                data: {
                    userId,
                    courseId,
                    enrollmentType: 'FREE'
                }
            });
            // Also initialize progress? Not strictly necessary as tracking API does upsert.

            return NextResponse.json({ message: 'Enrolled successfully', type: 'FREE' });
        } else {
            // Paid Enrollment - Should not happen here normally, but just in case
            return NextResponse.json({ error: 'Payment required for this course' }, { status: 402 });
        }

    } catch (error) {
        console.error('Error enrolling:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
