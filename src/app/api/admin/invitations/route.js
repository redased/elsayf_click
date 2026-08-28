
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request) {
    try {
        const session = await auth();
        // Simple Admin Check (Role based)
        if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
            // For now assume ADMIN role exists or check email. 
            // Ideally we check database user role.
            const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        const invitations = await prisma.courseInvitation.findMany({
            include: {
                course: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                requestedAt: 'desc'
            }
        });

        return NextResponse.json({ invitations });

    } catch (error) {
        console.error('Fetch Invitations Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await auth();
        // Re-verify Admin
        const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { invitationId, status } = body; // status: APPROVED, REJECTED

        if (!invitationId || !['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const invitation = await prisma.courseInvitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
        }

        // Logic for APPROVAL
        if (status === 'APPROVED') {
            // Check if user exists to grant immediate access
            const targetUser = await prisma.user.findUnique({ where: { email: invitation.email } });

            if (targetUser) {
                // Grant Access (Enrollment)
                await prisma.courseEnrollment.upsert({
                    where: {
                        userId_courseId: {
                            userId: targetUser.id,
                            courseId: invitation.courseId
                        }
                    },
                    update: {
                        enrollmentType: 'INVITATION'
                    },
                    create: {
                        userId: targetUser.id,
                        courseId: invitation.courseId,
                        enrollmentType: 'INVITATION'
                    }
                });
            } else {
                // User doesn't exist yet. access will be granted when they sign up? 
                // For now, we just mark as APPROVED. 
                // Ideally, a hook on User Creation would check pending approved invitations.
                // Or we trust the admin manually adds them later or validation lets them in.
                // Current flow: We can't enroll a non-existent user.
                // Maybe we should send an email. (Out of scope for this step).
            }
        }

        await prisma.courseInvitation.update({
            where: { id: invitationId },
            data: {
                status,
                processedAt: new Date()
            }
        });

        return NextResponse.json({ message: `Invitation ${status.toLowerCase()}` });

    } catch (error) {
        console.error('Update Invitation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
