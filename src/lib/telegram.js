import prisma from '@/lib/prisma';

/**
 * Service d'automatisation des notifications et statistiques Telegram pour Elsayf & MyCV
 */

export async function sendTelegramMessage(text, parseMode = 'HTML') {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ [Telegram] TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID non configuré dans .env');
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
 * Calcul des statistiques du jour (depuis minuit) et historiques
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

  // Récupérer les templates les plus utilisés aujourd'hui
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
 * Formate et envoie le rapport récapitulatif complet
 */
export async function sendDailyTelegramReport() {
  const stats = await getAggregatedStats();

  const templateLeaderboard = Object.entries(stats.cv.templateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tpl, count]) => `   • <i>${tpl}</i>: <b>${count}</b>`)
    .join('\n') || '   • <i>Aucun pour le moment</i>';

  const message = `
📊 <b>RAPPORT D'ACTIVITÉ ELSAYF & MYCV</b>
📅 <i>${stats.date} à ${stats.time}</i>

🎓 <b>ÉTUDIANTS & FORMATIONS</b>
├ 👤 Nouveaux inscrits aujourd'hui : <b>+${stats.students.today}</b>
├ 👥 Total inscrits plateforme : <b>${stats.students.total}</b>
├ 📚 Inscriptions cours aujourd'hui : <b>+${stats.students.enrollmentsToday}</b>
└ 📈 Total inscriptions cumulées : <b>${stats.students.totalEnrollments}</b>

📄 <b>CRÉATEUR DE CV (MyCV.click)</b>
├ 📥 Téléchargements PDF aujourd'hui : <b>+${stats.cv.downloadsToday}</b>
├ 📦 Total téléchargements PDF : <b>${stats.cv.totalDownloads}</b>
├ ⚡ Actions de personnalisation : <b>${stats.cv.eventsToday}</b>
├ 💾 Profils sauvegardés en base : <b>${stats.cv.totalProfiles}</b>
└ 📱 Appareils : <b>${stats.cv.mobileCount} mobiles</b> / <b>${stats.cv.desktopCount} ordinateurs</b>

🎨 <b>Modèles les plus créés aujourd'hui :</b>
${templateLeaderboard}

🔗 <a href="https://elsayf.click/admin">Accéder au Panneau d'Administration</a>
  `.trim();

  return await sendTelegramMessage(message);
}

/**
 * Envoie une notification temps réel pour un événement critique
 */
export async function notifyTelegramInstantEvent(type, payload = {}) {
  // Option pour désactiver les alertes en direct si on ne souhaite que le résumé
  if (process.env.TELEGRAM_DISABLE_INSTANT === 'true') {
    return { skipped: true };
  }

  let text = '';
  if (type === 'NEW_STUDENT') {
    text = `
🎓 <b>Nouvel Étudiant Inscrit !</b>
👤 <b>Nom :</b> ${payload.name || 'Anonyme'}
📧 <b>Email :</b> ${payload.email || 'Non renseigné'}
🕒 <b>Heure :</b> ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
    `.trim();
  } else if (type === 'CV_DOWNLOAD') {
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
