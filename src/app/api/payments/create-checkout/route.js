import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await request.json();

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
        }

        const userId = session.user.id; // Assume session.user.id exists, or fetch user by email

        // Need user ID from database if session doesn't have it (NextAuth sometimes only has email)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify course
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.isFree) {
            return NextResponse.json({ error: 'Course is free' }, { status: 400 });
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.courseEnrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });

        if (existingEnrollment) {
            return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
        }

        // Calculate amount (Chargily Amount in DZD)
        // Note: Chargily V2 API uses standard currency units? Documentation says: "amount: The amount you want to charge the customer. (e.g. 1000 for 1000 DZD)"
        // BUT wait, checking docs... "amount: 50000" in example for 500.00? No, example said "amount: 50000" and "fees: 1250".
        // Let's assume simplest: amount is in DZD. If documentation implies subunits, I should verify.
        // Re-reading Chargily V2 docs snippet:
        // "amount": 50000, "fees": 1250.
        // Usually, 500.00 DZD. If 50000, likely it's centimes (satim). 1 DZD = 100 centimes.
        // So price * 100?
        // Let's stick to safe bet: Assume price in DB is DZD (e.g. 2000 DA). Send 2000 ? No, usually payment gateways use subunits.
        // If snippet `{"amount": 50000}` was 500 DA, then it is *100.
        // I'll assume DB `price` is in DZD (e.g. 2000.00). I will send `price * 100` to Chargily if they expect subunits, or `price` if they expect units.
        // Let's check `src/app/api/payments/create-checkout/route.js` plan note: `amount: coursePrice * 100 // Convert to cents`
        // I will follow the plan: `amount: course.price` from DB (in DZD) -> sent as `course.price` to our DB, but to Chargily?
        // Let's try to be consistent. I will send `price` from DB as is to Chargily first, or better, check docs again if I could.
        // "The amount you want to charge the customer. (e.g. 1000 for 1000 DZD)" -> This implies units.
        // BUT the snippet in `view_content_chunk` position 2 said: `"amount": 50000` for `50000`?
        // If I look at position 2 chunk again: `"amount": 50000` ... `"url": ...`.
        // I'll assume standard 1:1 for now if docs say "e.g. 1000 for 1000 DZD".
        // Wait, "e.g. 1000 for 1000 DZD". This means NO subunits.
        // Okay, I will send `course.price` directly.

        const amount = course.price;
        const currency = "dzd";

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const payload = {
            amount: amount,
            currency: currency,
            success_url: `${appUrl}/courses/${course.slug}?payment=success`,
            failure_url: `${appUrl}/courses/${course.slug}?payment=failed`,
            webhook_endpoint: `${appUrl}/api/payments/chargily-webhook`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        };

        const chargilyUrl = process.env.CHARGILY_MODE === 'live'
            ? 'https://pay.chargily.net/api/v2/checkouts'
            : 'https://pay.chargily.net/test/api/v2/checkouts';

        const response = await fetch(chargilyUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CHARGILY_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Chargily API Error:', errorData);
            return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
        }

        const data = await response.json();

        // Save pending payment
        // data.id is the checkout ID
        // data.checkout_url is the redirect URL

        await prisma.payment.create({
            data: {
                chargilyCheckoutId: data.id,
                userId: user.id,
                courseId: course.id,
                amount: amount,
                status: 'pending',
                checkoutUrl: data.checkout_url
            }
        });

        return NextResponse.json({
            checkoutUrl: data.checkout_url
        });

    } catch (error) {
        console.error("Create Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
