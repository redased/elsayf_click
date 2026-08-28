import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import nodemailer from 'nodemailer';

export async function GET() {
    const session = await auth();
    if (!session || session.user?.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    const campaigns = await prisma.emailCampaign.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ campaigns });
}

export async function POST(req) {
    const session = await auth();
    if (!session || session.user?.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const { subject, content, targetGroup = 'all', sendNow = false } = await req.json();
    if (!subject || !content) return NextResponse.json({ error: 'subject et content requis' }, { status: 400 });

    const campaign = await prisma.emailCampaign.create({
        data: { subject, content, targetGroup, status: sendNow ? 'sending' : 'draft', createdBy: session.user.id }
    });

    if (!sendNow) return NextResponse.json({ campaign });

    const settings = await prisma.settings.findFirst();
    if (!settings?.smtpHost) {
        await prisma.emailCampaign.update({ where: { id: campaign.id }, data: { status: 'failed' } });
        return NextResponse.json({ error: 'SMTP non configuré dans les paramètres' }, { status: 500 });
    }

    let subscribers = [];
    if (targetGroup === 'enrolled') {
        const users = await prisma.user.findMany({
            where: { enrollments: { some: {} } },
            select: { email: true, name: true }
        });
        subscribers = users.filter(u => u.email);
    } else {
        subscribers = await prisma.newsletterSubscriber.findMany({
            where: { active: true }, select: { email: true, name: true }
        });
    }

    const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: parseInt(settings.smtpPort || '587'),
        auth: { user: settings.smtpUser, pass: settings.smtpPass }
    });

    const unsubUrl = (email) => {
        const token = Buffer.from(email).toString('base64');
        return `https://elsayf.statlabo.com/api/newsletter/unsubscribe?token=${token}`;
    };

    let sent = 0;
    for (const sub of subscribers) {
        try {
            await transporter.sendMail({
                from: settings.emailFrom || settings.smtpUser,
                to: sub.email,
                subject,
                html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0e17;">
                    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;border-radius:12px 12px 0 0;">
                        <h1 style="color:white;margin:0;font-size:20px;font-weight:800;">${subject}</h1>
                        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Elsayf by StatLabo</p>
                    </div>
                    <div style="padding:28px 32px;background:#0d1117;border:1px solid #1f2937;border-top:none;border-radius:0 0 12px 12px;">
                        <div style="color:#d1d5db;font-size:14px;line-height:1.7;">
                            ${content.replace(/\n/g, '<br>')}
                        </div>
                        <hr style="margin:24px 0;border-color:#1f2937;">
                        <div style="text-align:center;">
                            <a href="https://elsayf.statlabo.com" style="color:#a78bfa;font-size:12px;text-decoration:none;">elsayf.statlabo.com</a>
                            <span style="color:#374151;font-size:12px;"> · </span>
                            <a href="${unsubUrl(sub.email)}" style="color:#4b5563;font-size:11px;text-decoration:underline;">Se désabonner</a>
                        </div>
                    </div>
                </div>`
            });
            sent++;
        } catch {}
    }

    await prisma.emailCampaign.update({ where: { id: campaign.id }, data: { status: 'sent', sentCount: sent, sentAt: new Date() } });
    return NextResponse.json({ campaign, sentCount: sent });
}
