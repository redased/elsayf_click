# 📱 Système de Notifications Push - Guide Complet

## 🎯 Ce qui a été créé

Système de notifications **100% gratuit** pour informer vos utilisateurs sur Android, PC, et autres appareils !

---

## ✨ Fonctionnalités

### ✅ **Types de notifications disponibles:**

1. **🎓 Nouveau cours** - Quand un nouveau cours est publié
2. **📚 Rappel d'apprentissage** - Encourager les utilisateurs à continuer
3. **🏆 Certificat obtenu** - Quand un utilisateur termine un cours
4. **🔥 Promotion** - Offres spéciales et réductions
5. **⏰ Planifiées** - Notifications différées

---

## 🚀 Utilisation

### **Méthode 1: Depuis le code JavaScript**

```javascript
import { notifyNewCourse, notifyLearningReminder, notifyCertificate } from '@/lib/notifications';

// Nouveau cours
notifyNewCourse({
  id: 1,
  title: 'Python Machine Learning',
  slug: 'python-ml'
});

// Rappel
notifyLearningReminder();

// Certificat
notifyCertificate('Python pour Débutants');
```

### **Méthode 2: Via l'API**

```bash
curl -X POST https://elsayf.statlabo.com/api/admin/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🎓 Nouveau cours !",
    "message": "React Native est maintenant disponible",
    "type": "new_course",
    "data": {
      "courseId": "123",
      "url": "/courses/react-native"
    }
  }'
```

### **Méthode 3: Notification personnalisée**

```javascript
import { sendNotification } from '@/lib/notifications';

sendNotification(
  'Votre titre personnalisé',
  'Votre message ici',
  {
    tag: 'unique-id',
    onClickUrl: '/votre-page',
    requireInteraction: true
  }
);
```

---

## 📱 Comportement sur Android

### **Quand l'utilisateur arrive sur le site:**

1. **30 secondes après l'arrivée**, une popup apparaît:
   ```
   🔔 Restez informé !
      Recevez les nouveautés d'Elsayf
      [Activer] [Non merci]
   ```

2. **Si l'utilisateur clique "Activer":**
   - Permission accordée ✅
   - Notification de test envoyée
   - Peut recevoir les notifications futures

3. **Si "Non merci":**
   - Pas de permission ❌
   - Ne reçoit pas les notifications

### **Quand une notification est envoyée:**

```
┌─────────────────────────────┐
│ 🎓 Elsayf                   │
│ Nouveau cours disponible !  │
│ "Python ML" est accessible  │
│              [Ouvrir]       │
└─────────────────────────────┘
```

- Clic sur la notification → Ouvre l'app directement sur la page du cours
- Son de notification (selon les paramètres Android)
- Vibration (selon les paramètres Android)
- Badge d'icône si plusieurs notifications

---

## 🛠️ Intégration dans votre code

### **Exemple 1: Notifier quand un nouveau cours est créé**

```javascript
// Dans votre admin ou API création de cours
import { notifyNewCourse } from '@/lib/notifications';

async function createCourse(data) {
  const course = await prisma.course.create({ data });

  // Notifier tous les utilisateurs
  // (Dans une vraie implémentation, utiliser WebSocket/Push)
  notifyNewCourse(course);

  return course;
}
```

### **Exemple 2: Notifier quand un utilisateur achète un cours**

```javascript
// Après paiement réussi
import { sendNotification } from '@/lib/notifications';

sendNotification(
  '🎉 Cours acheté !',
  `Vous avez accès à "${course.title}"`,
  {
    tag: `purchased-${course.id}`,
    onClickUrl: `/dashboard/courses/${course.slug}`,
    requireInteraction: true
  }
);
```

### **Exemple 3: Rappel quotidien pour les utilisateurs actifs**

```javascript
// Planifier un rappel 24h après la dernière visite
import { scheduleNotification } from '@/lib/notifications';

// Dans votre page dashboard
const lastVisit = localStorage.getItem('lastVisit');
if (lastVisit) {
  const daysSinceLastVisit = (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24);

  if (daysSinceLastVisit > 1) {
    scheduleNotification(
      '📚 On vous manque !',
      'Continuez votre apprentissage sur Elsayf',
      60 * 60 * 1000 // 1 heure
    );
  }
}
```

---

## 🎨 Personnalisation

### **Modifier le prompt de permission**

Éditez `src/components/PushNotificationPrompt.js`:

```javascript
// Changer le délai (30 secondes par défaut)
const timer = setTimeout(() => {
  setShowPrompt(true);
}, 10000); // 10 secondes à la place
```

### **Modifier les couleurs des notifications**

Dans le même fichier:
```javascript
className="bg-gradient-to-r from-green-600 to-emerald-600"
// Changez "from-green-600 to-emerald-600"
// Par exemple: "from-purple-600 to-pink-600"
```

---

## 🧪 Tester les notifications

### **Outil de test intégré**

Un composant de test est disponible: `NotificationTester.js`

Pour l'activer (développement uniquement):

```javascript
// Dans src/app/layout.js ou une page admin
import NotificationTester from '@/components/NotificationTester';

// Ajoutez dans le render:
<NotificationTester />
```

Un bouton 🔔 apparaîtra en bas à gauche de l'écran pour tester tous les types de notifications.

### **Test manuel dans la console**

Ouvrez la console du navigateur (F12) et tapez:

```javascript
// Test basique
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('Test', { body: 'Ca marche !' });
  }
});

// Test avec la librairie
import('/_next/static/chunks/lib/notifications.js').then(m => {
  m.notifyNewCourse({ title: 'Test', slug: 'test' });
});
```

---

## 📊 Analytics et suivi

### **Savoir combien d'utilisateurs ont accepté**

```javascript
// Dans une page ou API
if ('Notification' in window) {
  const permission = Notification.permission;
  // Envoyer à votre analytics:
  // - 'granted': utilisateurs qui acceptent
  // - 'denied': utilisateurs qui refusent
  // - 'default': pas encore de décision
}
```

---

## 🚧 Prochaines étapes (Optionnel)

### **Pour un système plus avancé:**

#### **1. Web Push avec VAPID (100% gratuit)**
- Notifications push même si l'app est fermée
- Plus puissant que les notifications locales
- Nécessite de générer des clés VAPID

#### **2. Intégration OneSignal**
- Dashboard pour gérer les campagnes
- Segmentation des utilisateurs
- Analytics détaillés
- Gratuit jusqu'à 10k utilisateurs

#### **3. Firebase Cloud Messaging**
- Solution officielle Google
- Très fiable
- Plus complexe à configurer

---

## 📝 Bonnes pratiques

### ✅ **À FAIRE:**
- Demander la permission au bon moment (après 30 secondes)
- Expliquer pourquoi les notifications sont utiles
- Envoyer des notifications pertinentes et pas trop souvent
- Personnaliser le contenu
- Permettre de désactiver facilement

### ❌ **À ÉVITER:**
- Demander la permission immédiatement à l'arrivée
- Spam (trop de notifications)
- Notifications génériques
- Pas de bouton "désactiver"

---

## 🎉 Exemples concrets d'utilisation

### **Scénario 1: Nouveau cours publié**
```
1. Admin crée un nouveau cours
2. Système notifie automatiquement tous les utilisateurs
3. Utilisateurs reçoivent: "🎓 Nouveau cours: React Native"
4. Clic → Ouvre directement le cours
```

### **Scénario 2: Rappel pour utilisateur inactif**
```
1. Utilisateur n'est pas venu depuis 3 jours
2. Système envoie: "📚 On vous manque ! Revenez apprendre"
3. Clic → Ouvre le dashboard
```

### **Scénario 3: Certificat obtenu**
```
1. Utilisateur termine un cours
2. Système envoie: "🎉 Félicitations ! Certificat obtenu"
3. Clic → Ouvre la page des certificats
4. Motivation pour continuer !
```

---

## 🔧 Configuration requise

### **Rien de spécial !**

Le système utilise:
- ✅ **Web Notifications API** (Standard du web)
- ✅ **Service Worker** (Pour le cache offline)
- ✅ **Permission utilisateur** (Demande élégante)

**Aucun serveur push externe nécessaire pour les notifications locales !**

---

## 📱 Support des navigateurs

| Navigateur | Support |
|------------|---------|
| Chrome | ✅ Oui |
| Edge | ✅ Oui |
| Firefox | ✅ Oui |
| Safari | ✅ Oui (avec limitations) |
| Opera | ✅ Oui |
| Samsung Internet | ✅ Oui |

---

**🎉 Vos utilisateurs peuvent maintenant recevoir des notifications natives sur leur appareil Android !**
