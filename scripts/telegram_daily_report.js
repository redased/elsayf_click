/**
 * Script autonome d'envoi du rapport quotidien Telegram
 * Exécution : node scripts/telegram_daily_report.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('❌ TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant dans le fichier .env');
    process.exit(1);
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  console.log(`📊 Calcul des statistiques du jour (${now.toISOString()})...`);

  const [
    totalUsers,
    newUsersToday,
    totalEnrollments,
    newEnrollmentsToday,
    totalCvEvents,
    cvEventsToday,
    totalPdfDownloads,
    pdfDownloadsToday,
    totalProfiles,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.courseEnrollment.count(),
    prisma.courseEnrollment.count({ where: { enrolledAt: { gte: startOfDay } } }),
    prisma.cvEvent.count(),
    prisma.cvEvent.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.cvEvent.count({ where: { eventType: 'DOWNLOAD_PDF' } }),
    prisma.cvEvent.count({ where: { eventType: 'DOWNLOAD_PDF', createdAt: { gte: startOfDay } } }),
    prisma.cvProfile.count(),
  ]);

  const recentCvEventsToday = await prisma.cvEvent.findMany({
    where: { createdAt: { gte: startOfDay } },
    select: { template: true, deviceType: true },
  });

  const templateCounts = {};
  let mobileCount = 0;
  let desktopCount = 0;

  recentCvEventsToday.forEach((ev) => {
    const t = ev.template || 'developer';
    templateCounts[t] = (templateCounts[t] || 0) + 1;
    if (ev.deviceType === 'mobile') mobileCount++;
    else desktopCount++;
  });

  const templateLeaderboard = Object.entries(templateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tpl, count]) => `   • <i>${tpl}</i>: <b>${count}</b>`)
    .join('\n') || '   • <i>Aucun pour le moment</i>';

  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const message = `
📊 <b>RAPPORT QUOTIDIEN ELSAYF & MYCV</b>
📅 <i>${dateStr} à ${timeStr}</i>

🎓 <b>ÉTUDIANTS & FORMATIONS</b>
├ 👤 Nouveaux inscrits aujourd'hui : <b>+${newUsersToday}</b>
├ 👥 Total étudiants inscrits : <b>${totalUsers}</b>
├ 📚 Inscriptions cours aujourd'hui : <b>+${newEnrollmentsToday}</b>
└ 📈 Total inscriptions cumulées : <b>${totalEnrollments}</b>

📄 <b>CRÉATEUR DE CV (MyCV.click)</b>
├ 📥 Téléchargements PDF aujourd'hui : <b>+${pdfDownloadsToday}</b>
├ 📦 Total téléchargements PDF : <b>${totalPdfDownloads}</b>
├ ⚡ Événements d'édition aujourd'hui : <b>${cvEventsToday}</b>
├ 💾 Profils sauvegardés en base : <b>${totalProfiles}</b>
└ 📱 Appareils : <b>${mobileCount} mobiles</b> / <b>${desktopCount} ordinateurs</b>

🎨 <b>Modèles les plus créés aujourd'hui :</b>
${templateLeaderboard}

🔗 <a href="https://elsayf.click/admin">Accéder au Panneau d'Administration</a>
  `.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await res.json();
    if (result.ok) {
      console.log('✅ Rapport Telegram envoyé avec succès ! ID:', result.result.message_id);
    } else {
      console.error('❌ Erreur Telegram:', result.description);
    }
  } catch (err) {
    console.error('❌ Erreur réseau:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
