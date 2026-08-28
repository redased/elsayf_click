import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { Providers } from '../components/Providers';
import CookieBanner from '../components/CookieBanner';
import AffiliateTracker from '../components/AffiliateTracker';
import UserActivityTracker from '../components/UserActivityTracker';
import AdminDebugWrapper from '../components/admin/AdminDebugWrapper';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import PWAUpdateBanner from '../components/PWAUpdateBanner';
import PushNotificationPrompt from '../components/PushNotificationPrompt';
import ChunkErrorAutoReloader from '../components/ChunkErrorAutoReloader';
import ElectronWrapper from '../components/ElectronWrapper';
import ChatWidget from '../components/ChatWidget';
import LiveNotificationReceiver from '../components/LiveNotificationReceiver';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Elsayf | Formations Python, R Statistiques & IA en ligne',
  description: 'Plateforme e-learning pour apprendre Python, R Statistiques, Django et l\'IA. Éditeur de code intégré, mentoring live et IA intégrée. Rejoignez gratuitement.',
  keywords: 'formation python, r statistiques, django, e-learning algérie, intelligence artificielle, data science, formation en ligne',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Elsayf',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Elsayf | Formations Python, R Statistiques & IA',
    description: 'Apprenez Python, R Statistiques et Django avec IA intégrée. Codez directement dans le navigateur.',
    url: 'https://elsayf.click',
    siteName: 'Elsayf',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://elsayf.click/logo.png',
        width: 512,
        height: 512,
        alt: 'Elsayf E-Learning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elsayf | Formations Python, R & IA',
    description: 'Plateforme e-learning avec IA intégrée. Python, R Statistiques, Django.',
    images: ['https://elsayf.click/logo.png'],
  },
  alternates: {
    canonical: 'https://elsayf.click',
  },
};

export const viewport = {
  themeColor: '#6366f1',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* PWA Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Elsayf" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-adsense-account" content="ca-pub-1168470266191675" />
      </head>
      <body className={inter.className}>

        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JSQC2HPEG2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JSQC2HPEG2');
          `}
        </Script>
        <Providers>
          <ElectronWrapper>
            <PWAUpdateBanner />
            <ChunkErrorAutoReloader />
            <PushNotificationPrompt />
            <LiveNotificationReceiver />
            <AffiliateTracker />
            <UserActivityTracker />
            <AdminDebugWrapper />
            <Navbar />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <footer className="py-8 bg-[#050a14] border-t border-[rgba(255,255,255,0.05)] text-center text-gray-500">
              <p>© 2024 E-Learning AI. Tous droits réservés.</p>
            </footer>
            <CookieBanner />
            <PWAInstallPrompt />
            <ChatWidget />
          </ElectronWrapper>
        </Providers>

        {/* Service Worker Registration pour PWA - la détection de MAJ est gérée par PWAUpdateBanner */}
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                  .then(function(registration) {
                    console.log('[SW] Enregistré:', registration.scope);
                  })
                  .catch(function(error) {
                    console.log('[SW] Erreur:', error);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
