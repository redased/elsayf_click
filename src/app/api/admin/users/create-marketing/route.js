import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const session = await auth();

        // Security check: Only existing admins can create marketing users
        // Or if it's the first setup, maybe allow open? No, secure it.
        // Assuming the current user is an ADMIN.

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { email, firstName, lastName } = await request.json();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Update role if exists
            await prisma.user.update({
                where: { email },
                data: {
                    role: 'MARKETING_RECOVERY',
                    firstName: firstName || existingUser.firstName,
                    lastName: lastName || existingUser.lastName
                }
            });
            return NextResponse.json({ message: 'User updated to MARKETING_RECOVERY role' });
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                role: 'MARKETING_RECOVERY',
                name: `${firstName} ${lastName}`.trim(),
            }
        });

        return NextResponse.json(newUser);

    } catch (error) {
        console.error("Create Marketing User Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
