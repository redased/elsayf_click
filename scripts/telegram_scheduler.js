/**
 * Démon d'exécution automatique pour les rapports Telegram programmés
 * Lit dynamiquement les réglages configurés par l'administrateur (.telegram_settings.json)
 * et envoie le rapport à la minute précise configurée.
 * 
 * Lancement : node scripts/telegram_scheduler.js (ou géré via PM2)
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const SETTINGS_FILE = path.join(__dirname, '..', '.telegram_settings.json');

let lastDispatchedMinute = null;

function getSettings() {
  const defaultSettings = {
    enabled: true,
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
    dailyReportEnabled: true,
    dailyReportTime: '20:00',
    dailyReportFrequency: 'daily',
    morningReportTime: '08:00',
    includeStudentStats: true,
    includeCvStats: true,
    includeDeviceStats: true,
    includeTemplateRanking: true,
  };

  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return { ...defaultSettings, ...JSON.parse(content) };
    }
  } catch (e) {
    console.error('Erreur lecture config scheduler:', e.message);
  }
  return defaultSettings;
}

async function sendScheduledReport(settings) {
  const token = settings.botToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = settings.chatId || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ [Scheduler] Bot Token ou Chat ID manquant. Rapport ignoré.');
    return;
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  console.log(`[Scheduler] 📊 Génération du rapport programmé (${now.toISOString()})...`);

  try {
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

    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const sections = [];
    sections.push(`📊 <b>RAPPORT AUTOMATIQUE ELSAYF & MYCV</b>\n📅 <i>${dateStr} à ${timeStr}</i>\n`);

    if (settings.includeStudentStats) {
      sections.push(`
🎓 <b>ÉTUDIANTS & FORMATIONS</b>
├ 👤 Nouveaux inscrits aujourd'hui : <b>+${newUsersToday}</b>
├ 👥 Total étudiants enregistrés : <b>${totalUsers}</b>
├ 📚 Inscriptions cours aujourd'hui : <b>+${newEnrollmentsToday}</b>
└ 📈 Total inscriptions cumulées : <b>${totalEnrollments}</b>
      `.trim());
    }

    if (settings.includeCvStats) {
      let cvSec = `
📄 <b>CRÉATEUR DE CV (MyCV.click)</b>
├ 📥 Téléchargements PDF aujourd'hui : <b>+${pdfDownloadsToday}</b>
├ 📦 Total téléchargements PDF : <b>${totalPdfDownloads}</b>
├ ⚡ Actions de personnalisation : <b>${cvEventsToday}</b>
└ 💾 Profils enregistrés en base : <b>${totalProfiles}</b>
      `.trim();

      if (settings.includeDeviceStats) {
        cvSec += `\n└ 📱 Appareils : <b>${mobileCount} mobiles</b> / <b>${desktopCount} ordinateurs</b>`;
      }
      sections.push(cvSec);
    }

    if (settings.includeTemplateRanking) {
      const templateLeaderboard = Object.entries(templateCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tpl, count]) => `   • <i>${tpl}</i> : <b>${count}</b>`)
        .join('\n') || '   • <i>Aucun aujourd\'hui</i>';
      sections.push(`🎨 <b>Modèles les plus créés aujourd'hui :</b>\n${templateLeaderboard}`);
    }

    sections.push(`🔗 <a href="https://elsayf.click/admin/cv">Gérer les alertes dans le Panel Admin</a>`);

    const fullMessage = sections.join('\n\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: fullMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await res.json();
    if (result.ok) {
      console.log(`[Scheduler] ✅ Rapport envoyé avec succès sur Telegram ! Message ID: ${result.result.message_id}`);
    } else {
      console.error('[Scheduler] ❌ Erreur Telegram:', result.description);
    }
  } catch (err) {
    console.error('[Scheduler] ❌ Erreur exécution rapport:', err.message);
  }
}

function checkAndTrigger() {
  const settings = getSettings();
  if (!settings.enabled || !settings.dailyReportEnabled) {
    return;
  }

  const now = new Date();
  // Heure au format "HH:mm" (2 chiffres pour l'heure et la minute)
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;
  const currentDateMinute = `${now.toISOString().slice(0, 10)}_${currentTime}`;

  // Ne pas ré-envoyer deux fois dans la même minute
  if (lastDispatchedMinute === currentDateMinute) {
    return;
  }

  const isMainTime = currentTime === settings.dailyReportTime;
  const isMorningTime = settings.dailyReportFrequency === 'twice_daily' && currentTime === settings.morningReportTime;

  if (isMainTime || isMorningTime) {
    console.log(`[Scheduler] ⏰ Déclenchement automatique à l'heure programmée : ${currentTime}`);
    lastDispatchedMinute = currentDateMinute;
    sendScheduledReport(settings);
  }
}

console.log('🚀 [Telegram Scheduler] Démarré et en écoute permanente...');
// Vérification toutes les 25 secondes
setInterval(checkAndTrigger, 25000);
checkAndTrigger();
