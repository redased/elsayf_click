import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import nodemailer from 'nodemailer';

export const maxDuration = 60;

function unsubscribeUrl(email) {
    const token = Buffer.from(email).toString('base64');
    return `https://elsayf.statlabo.com/api/newsletter/unsubscribe?token=${token}`;
}

function buildCourseEmail({ course, recipientName, recipientEmail }) {
    const price = course.isFree ? 'Gratuit' : `${course.price} DZD`;
    const courseUrl = `https://elsayf.statlabo.com/courses/${course.slug}`;
    const levelColors = {
        'Débutant': '#10b981', 'Intermédiaire': '#f59e0b', 'Avancé': '#ef4444',
        'Beginner': '#10b981', 'Intermediate': '#f59e0b', 'Advanced': '#ef4444'
    };
    const levelColor = levelColors[course.level] || '#a78bfa';

    const greeting = recipientName ? `Bonjour ${recipientName},` : 'Bonjour,';
    const outcomes = course.learningOutcomes
        ? course.learningOutcomes.split('\n').filter(l => l.trim()).slice(0, 5).map(l =>
            `<li style="margin:6px 0;padding-left:8px;border-left:3px solid #a78bfa;color:#d1d5db;">${l.replace(/^[-•*]\s*/, '')}</li>`
          ).join('')
        : '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${course.title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0e17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#0a0e17;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#a855f7 100%);padding:40px 32px;text-align:center;border-radius:0 0 0 0;">
    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:8px 20px;margin-bottom:16px;">
      <span style="color:rgba(255,255,255,0.9);font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Nouvelle Formation</span>
    </div>
    <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 8px;line-height:1.2;">${course.title}</h1>
    <p style="color:rgba(255,255,255,0.75);font-size:15px;margin:0;">Développe tes compétences avec StatLabo</p>
  </div>

  <!-- Greeting -->
  <div style="background:#0d1117;padding:32px 32px 0;">
    <p style="color:#e5e7eb;font-size:15px;margin:0 0 8px;">${greeting}</p>
    <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Nous sommes ravis de te présenter notre nouvelle formation disponible sur <strong style="color:#a78bfa;">Elsayf</strong>.
    </p>
  </div>

  <!-- Course Card -->
  <div style="background:#0d1117;padding:0 32px;">
    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">

      ${course.image ? `
      <div style="background:linear-gradient(135deg,#1e1b4b,#1e1e2e);height:200px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
        <img src="https://elsayf.statlabo.com${course.image}" alt="${course.title}" style="width:100%;height:100%;object-fit:cover;">
      </div>` : `
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);height:140px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:56px;">📚</span>
      </div>`}

      <div style="padding:24px;">
        <!-- Tags -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
          <span style="background:${levelColor}20;color:${levelColor};border:1px solid ${levelColor}40;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${course.level}</span>
          <span style="background:${course.isFree ? '#10b98120' : '#f59e0b20'};color:${course.isFree ? '#10b981' : '#f59e0b'};border:1px solid ${course.isFree ? '#10b98140' : '#f59e0b40'};font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${price}</span>
          ${course.duration ? `<span style="background:#1f2937;color:#9ca3af;font-size:11px;padding:4px 12px;border-radius:20px;">⏱ ${course.duration}</span>` : ''}
        </div>

        <!-- Description -->
        <p style="color:#d1d5db;font-size:14px;line-height:1.7;margin:0 0 20px;">${course.description}</p>

        ${outcomes ? `
        <!-- Learning outcomes -->
        <div style="margin-bottom:24px;">
          <p style="color:#ffffff;font-size:13px;font-weight:700;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">Ce que tu vas apprendre</p>
          <ul style="margin:0;padding:0;list-style:none;">${outcomes}</ul>
        </div>` : ''}

        <!-- CTA Button -->
        <div style="text-align:center;margin-top:8px;">
          <a href="${courseUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
            Découvrir la formation →
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Why Elsayf -->
  <div style="background:#0d1117;padding:32px;">
    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px;">
      <p style="color:#a78bfa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Pourquoi Elsayf ?</p>
      <div style="display:grid;gap:12px;">
        ${[
          ['🤖', 'IA intégrée dans chaque cours', 'Pose tes questions, obtiens des réponses instantanées'],
          ['💻', 'IDE en ligne inclus', 'Code directement dans ton navigateur sans installation'],
          ['🎥', 'Sessions Live', 'Rejoins les sessions en direct avec tes formateurs'],
        ].map(([icon, title, desc]) => `
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:20px;flex-shrink:0;">${icon}</span>
          <div>
            <p style="color:#e5e7eb;font-size:13px;font-weight:600;margin:0 0 2px;">${title}</p>
            <p style="color:#6b7280;font-size:12px;margin:0;">${desc}</p>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#050a14;padding:24px 32px;text-align:center;border-top:1px solid #1f2937;">
    <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">
      © ${new Date().getFullYear()} Elsayf by StatLabo ·
      <a href="https://elsayf.statlabo.com" style="color:#a78bfa;text-decoration:none;">elsayf.statlabo.com</a>
    </p>
    <p style="color:#374151;font-size:11px;margin:0 0 8px;">
      Tu reçois cet email car tu es abonné à la newsletter Elsayf.
    </p>
    ${recipientEmail ? `<p style="margin:0;">
      <a href="${unsubscribeUrl(recipientEmail)}" style="color:#4b5563;font-size:11px;text-decoration:underline;">
        Se désabonner de la newsletter
      </a>
    </p>` : ''}
  </div>

</div>
</body>
</html>`;
}

export async function POST(req) {
    const session = await auth();
    if (!session || session.user?.role !== 'SUPER_ADMIN')
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const { courseId, recipients } = await req.json();
    // recipients: 'all' | 'enrolled' | string[] (specific emails)

    if (!courseId) return NextResponse.json({ error: 'courseId requis' }, { status: 400 });

    const [course, settings] = await Promise.all([
        prisma.course.findUnique({ where: { id: courseId } }),
        prisma.settings.findFirst()
    ]);

    if (!course) return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
    if (!settings?.smtpHost) return NextResponse.json({ error: 'SMTP non configuré dans les paramètres' }, { status: 500 });

    // Build recipient list
    let targets = []; // [{ email, name }]
    if (recipients === 'all') {
        targets = await prisma.newsletterSubscriber.findMany({
            where: { active: true }, select: { email: true, name: true }
        });
    } else if (recipients === 'enrolled') {
        const users = await prisma.user.findMany({
            where: { enrollments: { some: {} } },
            select: { email: true, name: true }
        });
        targets = users.filter(u => u.email);
    } else if (Array.isArray(recipients)) {
        targets = recipients.map(e => ({ email: e, name: null }));
    } else {
        return NextResponse.json({ error: 'recipients invalide' }, { status: 400 });
    }

    if (targets.length === 0) return NextResponse.json({ error: 'Aucun destinataire trouvé' }, { status: 400 });

    const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: parseInt(settings.smtpPort || '587'),
        auth: { user: settings.smtpUser, pass: settings.smtpPass }
    });

    let sent = 0, failed = 0;
    for (const t of targets) {
        try {
            await transporter.sendMail({
                from: `"Elsayf by StatLabo" <${settings.emailFrom || settings.smtpUser}>`,
                to: t.email,
                subject: `🎓 Nouvelle formation : ${course.title}`,
                html: buildCourseEmail({ course, recipientName: t.name, recipientEmail: t.email })
            });
            sent++;
        } catch { failed++; }
    }

    return NextResponse.json({ ok: true, sent, failed, total: targets.length });
}
