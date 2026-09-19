// Ce fichier exporte les metadata pour le segment /cv
// Le layout lui-même est minimal pour éviter les conflits avec le root layout

export const metadata = {
  title: 'MyCV.click — Créateur de CV Gratuit & Professionnel | 6 Designs Premium',
  description: 'Créez votre CV professionnel gratuitement avec 6 designs premium compatibles ATS. Assistant IA, export PDF A4, sauvegarde automatique. Aucune inscription requise.',
  keywords: 'créateur cv en ligne, faire un cv gratuit, cv builder, template cv moderne, cv ats compatible, export pdf a4, mycv, cv tech, cv cadre, cv gratuit algerie',
  openGraph: {
    title: 'MyCV.click — Créateur de CV Professionnel Gratuit',
    description: 'Choisissez parmi 6 designs premium, laissez l\'IA vous assister et exportez votre CV en PDF A4 parfait. 100% gratuit, aucune inscription.',
    type: 'website',
    url: 'https://mycv.click',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyCV.click — CV Gratuit & Professionnel',
    description: '6 designs premium, IA intégrée, PDF A4 instantané. Créez votre CV professionnel gratuitement.',
  },
  alternates: {
    canonical: 'https://mycv.click',
  },
};

export default function CVLayout({ children }) {
  return children;
}
