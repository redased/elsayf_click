import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Route temporaire pour mettre le cours business en gratuit
// Appel: GET /api/admin/set-business-free
export async function GET() {
    try {
        const course = await prisma.course.update({
            where: { slug: 'antigravity-business-excel' },
            data: { isFree: true, price: 0 }
        })
        return NextResponse.json({
            success: true,
            message: 'Cours mis en gratuit',
            title: course.title,
            isFree: course.isFree,
            price: course.price
        })
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}
