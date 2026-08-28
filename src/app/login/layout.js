export const metadata = {
  title: 'Connexion | Elsayf — Plateforme E-Learning',
  description: 'Connectez-vous à votre espace Elsayf pour accéder à vos formations Python, R Statistiques et Django.',
  openGraph: {
    title: 'Connexion — Elsayf',
    description: 'Accédez à votre espace de formation Elsayf.',
    url: 'https://elsayf.click/login',
    siteName: 'Elsayf',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://elsayf.click/login',
  },
};

export default function LoginLayout({ children }) {
  return children;
}
