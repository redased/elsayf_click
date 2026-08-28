
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const SITE_KEY   = '6Lciz3IsAAAAAF4micPtkOKBsDaOdaasL0CvPlDv';
const API_KEY    = process.env.RECAPTCHA_API_KEY;
const PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID;
const MIN_SCORE  = 0.5;

const requestSchema = z.object({
    email: z.string().email(),
    courseId: z.string(),
    recaptchaToken: z.string().optional(),
});

export async function POST(request) {
    try {
        const body = await request.json();
        const validation = requestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const { email, courseId, recaptchaToken } = validation.data;

        // ── vérification reCAPTCHA Enterprise (si clés configurées) ──
        if (recaptchaToken && API_KEY && PROJECT_ID) {
            try {
                const rcRes = await fetch(
                    `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            event: { token: recaptchaToken, siteKey: SITE_KEY, expectedAction: 'INVITATION' },
                        }),
                    }
                );
                if (rcRes.ok) {
                    const rcData = await rcRes.json();
                    const score = rcData?.riskAnalysis?.score ?? 1;
                    const valid = rcData?.tokenProperties?.valid === true;
                    if (!valid || score < MIN_SCORE) {
                        console.warn('[reCAPTCHA] invitation rejetée score=', score, 'valid=', valid);
                        return NextResponse.json({ error: 'Vérification de sécurité échouée. Réessayez.' }, { status: 403 });
                    }
                }
            } catch (rcErr) {
                console.error('[reCAPTCHA] erreur vérification:', rcErr);
                // ne pas bloquer si l'API reCAPTCHA est indisponible
            }
        }

        // Check if course exists and is invite only
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (!course.isInviteOnly) {
            return NextResponse.json({ error: 'This course is open for direct enrollment' }, { status: 400 });
        }

        // Check if user is already enrolled
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const enrollment = await prisma.courseEnrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId
                    }
                }
            });
            if (enrollment) {
                return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
            }
        }

        // Check if invitation already exists (PENDING or APPROVED)
        const existingInvitation = await prisma.courseInvitation.findUnique({
            where: {
                email_courseId: {
                    email,
                    courseId
                }
            }
        });

        if (existingInvitation) {
            if (existingInvitation.status === 'PENDING') {
                return NextResponse.json({ message: 'Invitation request already pending' });
            }
            if (existingInvitation.status === 'APPROVED') {
                // Should theoretically be enrolled, but maybe they haven't claimed it / account issue.
                return NextResponse.json({ message: 'Invitation already approved. Please log in.' });
            }
        }

        // Create Invitation
        await prisma.courseInvitation.create({
            data: {
                email,
                courseId,
                status: 'PENDING'
            }
        });

        return NextResponse.json({ message: 'Request submitted successfully' }, { status: 201 });

    } catch (error) {
        console.error('Invitation Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
