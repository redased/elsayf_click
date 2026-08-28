import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, type } = body;

        // Validate input
        if (!firstName || !lastName || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Check for Referral Cookie
        const refCode = cookies().get('ref_code')?.value;
        const refClickId = cookies().get('ref_click_id')?.value;

        // Create user
        const userData = {
            firstName,
            lastName,
            email,
            phone,
            type,
        };

        if (refCode) {
            // Verify link exists
            const link = await prisma.affiliateLink.findUnique({ where: { code: refCode } });
            if (link) {
                userData.referredByCode = refCode;

                // Increment registration count for the link
                await prisma.affiliateLink.update({
                    where: { code: refCode },
                    data: { registrations: { increment: 1 } }
                });

                // Mark the click as converted
                if (refClickId) {
                    await prisma.affiliateClick.updateMany({
                        where: {
                            id: refClickId,
                            linkId: link.id
                        },
                        data: {
                            converted: true,
                            convertedAt: new Date()
                        }
                    });
                }
            }
        }

        const user = await prisma.user.create({
            data: userData,
        });

        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
