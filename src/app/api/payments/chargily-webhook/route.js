import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const signature = request.headers.get('signature');
        const payload = await request.text();

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Verify signature
        // The signature is HMAC-SHA256 of the payload using the secret key
        const computed = crypto
            .createHmac('sha256', process.env.CHARGILY_SECRET_KEY || '')
            .update(payload)
            .digest('hex');

        if (signature !== computed) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        const event = JSON.parse(payload);

        // Handle events
        if (event.type === 'checkout.paid') {
            const checkout = event.data;
            const checkoutId = checkout.id;

            // Find the payment
            const payment = await prisma.payment.findUnique({
                where: { chargilyCheckoutId: checkoutId },
                include: { course: true }
            });

            if (payment) {
                // Update payment status
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'paid',
                        paidAt: new Date(),
                        chargilyPaymentMethod: checkout.payment_method,
                        fees: checkout.fees,
                        metadata: JSON.stringify(checkout.metadata)
                    }
                });

                // Create enrollment
                // Check if already enrolled to avoid duplicates
                const existingEnrollment = await prisma.courseEnrollment.findUnique({
                    where: {
                        userId_courseId: {
                            userId: payment.userId,
                            courseId: payment.courseId
                        }
                    }
                });

                if (!existingEnrollment) {
                    await prisma.courseEnrollment.create({
                        data: {
                            userId: payment.userId,
                            courseId: payment.courseId,
                            enrollmentType: 'PAID',
                            paymentId: payment.id
                        }
                    });

                    // Update course enrollment count
                    await prisma.course.update({
                        where: { id: payment.courseId },
                        data: {
                            enrollmentCount: { increment: 1 }
                        }
                    });
                }
            } else {
                console.warn(`Payment not found for checkout ID: ${checkoutId}`);
            }
        }
        else if (event.type === 'checkout.failed') {
            const checkout = event.data;
            await prisma.payment.update({
                where: { chargilyCheckoutId: checkout.id },
                data: { status: 'failed' }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
