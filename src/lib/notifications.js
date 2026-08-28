// Système de Notifications Push pour Elsayf

/**
 * Envoyer une notification locale à l'utilisateur
 * @param {string} title - Titre de la notification
 * @param {string} body - Corps de la notification
 * @param {Object} options - Options supplémentaires
 */
export function sendNotification(title, body, options = {}) {
  if (!('Notification' in window)) {
    console.log('Notifications non supportées');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: options.tag || 'elsayf-notification',
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
      data: options.data || {},
      ...options
    });

    // Gérer le clic sur la notification
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();

      // Naviguer vers une page spécifique si fournie
      if (options.onClickUrl) {
        window.location.href = options.onClickUrl;
      }
    };

    return notification;
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        sendNotification(title, body, options);
      }
    });
  }
}

/**
 * Envoyer une notification pour un nouveau cours
 * @param {Object} course - Objet cours
 */
export function notifyNewCourse(course) {
  sendNotification(
    '🎓 Nouveau cours disponible !',
    `"${course.title}" est maintenant accessible sur Elsayf`,
    {
      tag: `new-course-${course.id}`,
      onClickUrl: `/courses/${course.slug}`,
      requireInteraction: true
    }
  );
}

/**
 * Envoyer une notification de rappel d'apprentissage
 */
export function notifyLearningReminder() {
  sendNotification(
    '📚 Continuez votre apprentissage !',
    'Vous avez des cours en cours, reprenez là où vous étiez',
    {
      tag: 'learning-reminder',
      onClickUrl: '/dashboard/courses',
      requireInteraction: true
    }
  );
}

/**
 * Envoyer une notification de progression
 * @param {string} courseTitle - Titre du cours
 * @param {number} progress - Pourcentage de progression
 */
export function notifyProgress(courseTitle, progress) {
  sendNotification(
    '🏆 Progression mise à jour !',
    `Vous avez complété ${progress}% de "${courseTitle}"`,
    {
      tag: `progress-${courseTitle}`,
      onClickUrl: '/dashboard/courses'
    }
  );
}

/**
 * Envoyer une notification de certificat
 * @param {string} courseTitle - Titre du cours complété
 */
export function notifyCertificate(courseTitle) {
  sendNotification(
    '🎉 Félicitations ! Certificat obtenu !',
    `Vous avez complété le cours "${courseTitle}"`,
    {
      tag: `certificate-${courseTitle}`,
      onClickUrl: '/dashboard/certificates',
      requireInteraction: true
    }
  );
}

/**
 * Envoyer une notification de promotion
 * @param {string} message - Message de promotion
 */
export function notifyPromotion(message) {
  sendNotification(
    '🔥 Offre spéciale !',
    message,
    {
      tag: 'promotion',
      onClickUrl: '/courses',
      requireInteraction: true
    }
  );
}

/**
 * Planifier une notification différée
 * @param {string} title - Titre
 * @param {string} body - Corps
 * @param {number} delay - Délai en millisecondes
 * @param {Object} options - Options supplémentaires
 */
export function scheduleNotification(title, body, delay, options = {}) {
  setTimeout(() => {
    sendNotification(title, body, options);
  }, delay);
}

/**
 * Exemples d'utilisation:
 *
 * // Nouveau cours
 * notifyNewCourse({ id: 1, title: 'Python Avancé', slug: 'python-avance' });
 *
 * // Rappel après 1 heure
 * scheduleNotification(
 *   '📚 N\'oubliez pas d\'apprendre !',
 *   'Continuez votre progression sur Elsayf',
 *   60 * 60 * 1000 // 1 heure
 * );
 *
 * // Certificat
 * notifyCertificate('Introduction à Python');
 */
