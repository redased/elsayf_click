import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { jobOfferText = '', candidateCv = '' } = body;

    if (!jobOfferText || jobOfferText.trim().length < 20) {
      return NextResponse.json({ error: 'Texte d\'offre d\'emploi trop court ou manquant.' }, { status: 400 });
    }

    const offerLower = jobOfferText.toLowerCase();

    // Catalogue des cours Elsayf pour matching intelligent
    const catalog = [
      {
        slug: 'power-bi-business-intelligence-data-analytics',
        title: 'Power BI & Business Intelligence (DAX & Dashboards)',
        keywords: ['power bi', 'dax', 'dashboard', 'bi', 'business intelligence', 'power query', 'tableau de bord', 'kpi', 'reporting', 'data analyst'],
        category: 'Data & BI',
      },
      {
        slug: 'analyse-donnees-quali-quanti',
        title: 'Analyse de Données Quali & Quanti (Excel & Python)',
        keywords: ['pandas', 'statistiques', 'analyse de donnees', 'statistique', 'quantitative', 'qualitative', 'excel avance', 'data analysis', 'numpy'],
        category: 'Data & BI',
      },
      {
        slug: 'cybersecurite-protection-systemes-defensive',
        title: 'Cybersécurité & Protection des Systèmes (SOC)',
        keywords: ['soc', 'securite', 'cybersecurite', 'siem', 'logs', 'detection', 'firewall', 'incident', 'defense', 'iso 27001', 'systeme'],
        category: 'Cybersécurité',
      },
      {
        slug: 'ethical-hacking-securite-web-pentest',
        title: 'Ethical Hacking & Pentest Web (OWASP Top 10)',
        keywords: ['pentest', 'hacking', 'owasp', 'injection sql', 'xss', 'burp suite', 'nmap', 'vulnerabilite', 'securite web', 'audit securite'],
        category: 'Cybersécurité',
      },
      {
        slug: 'automatisation-excel-comptabilite-detaillee',
        title: 'Automatisation Excel & Comptabilité Détaillée avec Python',
        keywords: ['comptabilite', 'facturation', 'excel', 'automatisation', 'finance', 'tresorerie', 'bilan', 'balance', 'openpyxl'],
        category: 'Automatisation & IA',
      },
      {
        slug: 'google-antigravity-mastery',
        title: 'Google Antigravity : Maîtrise de l\'IA & du Code',
        keywords: ['ia', 'prompt', 'intelligence artificielle', 'llm', 'chatgpt', 'gemini', 'antigravity', 'agent', 'automation'],
        category: 'Automatisation & IA',
      },
    ];

    // Détection des compétences et cours manquants
    const matchedCourses = [];
    const detectedKeywords = [];

    catalog.forEach(item => {
      const hits = item.keywords.filter(kw => offerLower.includes(kw));
      if (hits.length > 0) {
        matchedCourses.push({
          slug: item.slug,
          title: item.title,
          category: item.category,
          matchingSkills: hits,
          relevance: hits.length,
        });
        detectedKeywords.push(...hits);
      }
    });

    matchedCourses.sort((a, b) => b.relevance - a.relevance);

    // Estimation du score ATS et analyse des lacunes
    const uniqueSkills = Array.from(new Set(detectedKeywords));
    const matchPercentage = Math.min(95, Math.max(45, 50 + uniqueSkills.length * 7));

    const recommendations = [
      `Intégrez les mots-clés clés détectés dans l'offre : ${uniqueSkills.slice(0, 5).join(', ') || 'Compétences techniques'}.`,
      'Structurez vos réalisations avec des chiffres mesurables (% de gains de temps, volume de données traitées).',
      'Exportez votre CV au format PDF A4 vectoriel sans filigrane sur MyCV.click pour garantir un passage à 100% des robots ATS.',
    ];

    return NextResponse.json({
      success: true,
      analysis: {
        matchPercentage,
        detectedSkillsCount: uniqueSkills.length,
        detectedSkills: uniqueSkills,
        recommendedCourses: matchedCourses.slice(0, 3),
        recommendations,
      },
    });
  } catch (error) {
    console.error('Erreur job scanner API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
