import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), '.telegram_settings.json');

export const DEFAULT_TELEGRAM_SETTINGS = {
  enabled: true,
  botToken: process.env.TELEGRAM_BOT_TOKEN || '8904370377:AAFuCI2vGUFNJ-Nq2XkuTpBAAcIWEXv7o04',
  chatId: process.env.TELEGRAM_CHAT_ID || '1706545248',
  notifyOnCvDownload: true,      // Alerte en direct : Téléchargement d'un CV en PDF
  notifyOnNewStudent: true,      // Alerte en direct : Nouvel étudiant inscrit
  dailyReportEnabled: true,      // Rapport quotidien automatique
  dailyReportTime: '20:00',      // Heure d'envoi du rapport (format 24h)
  dailyReportFrequency: 'daily', // 'daily' | 'twice_daily'
  morningReportTime: '08:00',    // Heure du rapport du matin si twice_daily
  includeStudentStats: true,     // Inclure métriques étudiants & formations
  includeCvStats: true,          // Inclure métriques créateur de CV
  includeDeviceStats: true,      // Inclure mobiles vs ordinateurs
  includeTemplateRanking: true,  // Inclure classement des modèles
  lastReportSentDate: null,
};

/**
 * Récupère les paramètres de configuration Telegram
 */
export function getTelegramSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf8');
      const saved = JSON.parse(content);
      return { ...DEFAULT_TELEGRAM_SETTINGS, ...saved };
    }
  } catch (e) {
    console.error('Erreur lecture .telegram_settings.json:', e.message);
  }
  return { ...DEFAULT_TELEGRAM_SETTINGS };
}

/**
 * Sauvegarde les paramètres de configuration Telegram
 */
export function saveTelegramSettings(newSettings) {
  try {
    const current = getTelegramSettings();
    const merged = { ...current, ...newSettings };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8');
    return { success: true, settings: merged };
  } catch (e) {
    console.error('Erreur écriture .telegram_settings.json:', e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Envoie un message via l'API Telegram
 */
export async function sendTelegramMessage(text, parseMode = 'HTML', customToken = null, customChatId = null) {
  const settings = getTelegramSettings();
  const token = customToken || settings.botToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = customChatId || settings.chatId || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ [Telegram] Token ou Chat ID manquant');
    return { success: false, reason: 'NOT_CONFIGURED' };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error('❌ [Telegram API Error]:', data.description);
      return { success: false, error: data.description };
    }

    return { success: true, messageId: data.result?.message_id };
  } catch (error) {
    console.error('❌ [Telegram Network Error]:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Calcul des statistiques du jour et historiques
 */
export async function getAggregatedStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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
    select: { template: true, deviceType: true, eventType: true },
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

  return {
    date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    students: {
      total: totalUsers,
      today: newUsersToday,
      totalEnrollments,
      enrollmentsToday: newEnrollmentsToday,
    },
    cv: {
      totalEvents: totalCvEvents,
      eventsToday: cvEventsToday,
      totalDownloads: totalPdfDownloads,
      downloadsToday: pdfDownloadsToday,
      totalProfiles,
      templateCounts,
      mobileCount,
      desktopCount,
    },
  };
}

/**
 * Formate et envoie le rapport selon les filtres configurés par l'utilisateur
 */
export async function sendDailyTelegramReport(customSettings = null) {
  const settings = customSettings || getTelegramSettings();
  if (!settings.enabled) {
    return { skipped: true, reason: 'DISABLED' };
  }

  const stats = await getAggregatedStats();
  const sections = [];

  sections.push(`📊 <b>RAPPORT D'ACTIVITÉ ELSAYF & MYCV</b>\n📅 <i>${stats.date} à ${stats.time}</i>\n`);

  // Section Étudiants
  if (settings.includeStudentStats) {
    sections.push(`
🎓 <b>ÉTUDIANTS & FORMATIONS</b>
├ 👤 Nouveaux inscrits aujourd'hui : <b>+${stats.students.today}</b>
├ 👥 Total étudiants enregistrés : <b>${stats.students.total}</b>
├ 📚 Inscriptions cours aujourd'hui : <b>+${stats.students.enrollmentsToday}</b>
└ 📈 Total inscriptions cumulées : <b>${stats.students.totalEnrollments}</b>
    `.trim());
  }

  // Section Créateur de CV
  if (settings.includeCvStats) {
    let cvSection = `
📄 <b>CRÉATEUR DE CV (MyCV.click)</b>
├ 📥 Téléchargements PDF aujourd'hui : <b>+${stats.cv.downloadsToday}</b>
├ 📦 Total téléchargements PDF : <b>${stats.cv.totalDownloads}</b>
├ ⚡ Actions d'édition aujourd'hui : <b>${stats.cv.eventsToday}</b>
└ 💾 Profils sauvegardés en base : <b>${stats.cv.totalProfiles}</b>
    `.trim();

    if (settings.includeDeviceStats) {
      cvSection += `\n└ 📱 Appareils : <b>${stats.cv.mobileCount} mobiles</b> / <b>${stats.cv.desktopCount} ordinateurs</b>`;
    }

    sections.push(cvSection);
  }

  // Classement des modèles de CV
  if (settings.includeTemplateRanking) {
    const templateLeaderboard = Object.entries(stats.cv.templateCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tpl, count]) => `   • <i>${tpl}</i> : <b>${count}</b>`)
      .join('\n') || '   • <i>Aucun aujourd\'hui</i>';

    sections.push(`🎨 <b>Modèles les plus utilisés aujourd'hui :</b>\n${templateLeaderboard}`);
  }

  sections.push(`🔗 <a href="https://elsayf.click/admin/cv">Accéder au Panneau d'Administration</a>`);

  const fullMessage = sections.join('\n\n');
  const result = await sendTelegramMessage(fullMessage);

  if (result.success) {
    // Enregistrer la date du dernier rapport
    const todayStr = new Date().toISOString().slice(0, 10);
    saveTelegramSettings({ lastReportSentDate: todayStr });
  }

  return result;
}

/**
 * Envoie une notification temps réel si l'option est activée
 */
export async function notifyTelegramInstantEvent(type, payload = {}) {
  const settings = getTelegramSettings();
  if (!settings.enabled) {
    return { skipped: true, reason: 'TELEGRAM_DISABLED' };
  }

  let text = '';

  if (type === 'NEW_STUDENT') {
    if (!settings.notifyOnNewStudent) return { skipped: true };
    text = `
🎓 <b>Nouvel Étudiant Inscrit !</b>
👤 <b>Nom :</b> ${payload.name || 'Anonyme'}
📧 <b>Email :</b> ${payload.email || 'Non renseigné'}
🕒 <b>Heure :</b> ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
    `.trim();
  } else if (type === 'CV_DOWNLOAD') {
    if (!settings.notifyOnCvDownload) return { skipped: true };
    text = `
📥 <b>Nouveau CV Téléchargé (PDF A4) !</b>
👤 <b>Candidat :</b> ${payload.candidateName || 'Anonyme'}
💼 <b>Poste :</b> ${payload.candidateTitle || 'Non renseigné'}
🎨 <b>Modèle :</b> ${payload.template || 'developer'}
📱 <b>Appareil :</b> ${payload.deviceType || 'desktop'} (${payload.browser || 'inconnu'})
🕒 <b>Heure :</b> ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
    `.trim();
  } else {
    text = `🔔 <b>Événement Elsayf :</b> ${type}\n${JSON.stringify(payload, null, 2)}`;
  }

  return await sendTelegramMessage(text);
}
