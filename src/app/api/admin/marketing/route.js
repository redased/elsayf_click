import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const session = await auth();

        // Security check
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        // Allow ADMIN and MARKETING_RECOVERY roles
        if (user.role !== 'ADMIN' && user.role !== 'MARKETING_RECOVERY') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 1. Calculate Total Revenue
        const paidEnrollments = await prisma.courseEnrollment.findMany({
            where: { enrollmentType: 'PAID' },
            include: {
                payment: true,
                course: true
            }
        });

        const totalRevenue = paidEnrollments.reduce((acc, enrollment) => {
            return acc + (enrollment.payment?.amount || 0); // Amount is in cents/smallest unit if Chargily uses it, or DZD. Chargily Amount is usually DZD * 10 or whatever. Wait, locally we store what? 
            // In the plan I said "Amount in DZD cents". If 500.00 DZD -> 50000? Let's check schema comment: `amount Float // Amount in DZD cents`
        }, 0);

        // 2. Enrollment Stats
        const totalEnrollments = await prisma.courseEnrollment.count();
        const freeEnrollmentsCount = await prisma.courseEnrollment.count({
            where: { enrollmentType: 'FREE' }
        });
        const paidEnrollmentsCount = await prisma.courseEnrollment.count({
            where: { enrollmentType: 'PAID' }
        });

        // 3. Course Performance
        const courses = await prisma.course.findMany({
            include: {
                _count: {
                    select: { enrollments: true }
                },
                enrollments: {
                    where: { enrollmentType: 'PAID' },
                    include: {
                        payment: true
                    }
                }
            }
        });

        const courseStats = courses.map(course => {
            const coursePaidEnrollments = course.enrollments.filter(e => e.enrollmentType === 'PAID');
            const revenue = coursePaidEnrollments.reduce((acc, e) => acc + (e.payment?.amount || 0), 0);

            return {
                id: course.id,
                title: course.title,
                isFree: course.isFree,
                price: course.price,
                totalEnrollments: course._count.enrollments,
                revenue: revenue
            };
        });

        // 4. Recent Payments
        const recentPayments = await prisma.payment.findMany({
            where: { status: 'paid' },
            take: 10,
            orderBy: { paidAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                course: {
                    select: { title: true }
                }
            }
        });

        return NextResponse.json({
            totalRevenue,
            totalEnrollments,
            freeEnrollmentsCount,
            paidEnrollmentsCount,
            courseStats,
            recentPayments
        });

    } catch (error) {
        console.error("Marketing API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
