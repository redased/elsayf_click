export const metadata = {
  title: 'Formations en ligne | Python, R Statistiques, Django — Elsayf',
  description: 'Découvrez toutes nos formations : Python & IA, R Statistiques pour la Finance, Django & Docker. Apprenez à votre rythme avec un éditeur de code intégré.',
  keywords: 'formation python, formation r statistiques, formation django, e-learning algérie, cours python en ligne, data science',
  openGraph: {
    title: 'Formations en ligne | Python, R Statistiques, Django — Elsayf',
    description: 'Formations Python, R Statistiques et Django avec IA intégrée. Codez directement dans le navigateur.',
    url: 'https://elsayf.click/courses',
    siteName: 'Elsayf',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formations en ligne — Elsayf',
    description: 'Python, R Statistiques, Django. Apprenez avec l\'IA intégrée.',
  },
  alternates: {
    canonical: 'https://elsayf.click/courses',
  },
};

export default function CoursesLayout({ children }) {
  return children;
}
