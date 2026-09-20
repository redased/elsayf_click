import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blogPosts';

export const metadata = {
  title: 'Blog & Guides Métiers Tech & IA | Elsayf Platform',
  description: 'Articles techniques approfondis, guides carrières en Algérie et en France, tutoriels Power BI, Cybersécurité, Pentest et Automatisation IA.',
  keywords: 'blog tech algérie, salaire data analyst algérie, guide reconversion pentest, tutoriel power bi dax, prompt engineering chatgpt',
};

export default function BlogIndexPage() {
  const posts = BLOG_POSTS;

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 selection:bg-purple-500 selection:text-white pb-24">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-purple-600/15 via-blue-600/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Guides Métiers & Insights Techniques
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Le Blog des Compétences du Futur
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Analyses de marché, salaires réels (Algérie & International), tutoriels avancés et feuilles de route pour propulser votre carrière dans la Tech, la Data et la Cybersécurité.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {BLOG_CATEGORIES.map((cat) => (
            <span
              key={cat.id}
              className="px-4 py-2 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-purple-500/40 hover:text-white transition cursor-default"
            >
              {cat.label}
            </span>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 backdrop-blur-sm"
            >
              {/* Card top bar badge */}
              <div className="p-6 pb-0 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {post.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  ⏱️ {post.readTime}
                </span>
              </div>

              {/* Title & Excerpt */}
              <div className="p-6 flex-1 flex flex-col">
                <Link href={`/blog/${post.slug}`} className="block group-hover:text-purple-300 transition">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author & CTA */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-[10px] text-white">
                      ES
                    </div>
                    <span>{post.author}</span>
                    <span className="text-slate-600">•</span>
                    <span>{post.date}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition"
                  >
                    Lire le guide &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA for Career Paths & CV */}
        <div className="bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-blue-950/40 rounded-2xl p-8 border border-purple-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Prêt à passer de la théorie à la pratique ?
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Découvrez nos parcours métiers complets et exportez directement vos réalisations de projet vers votre profil sur MyCV.click.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/parcours"
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/20 transition"
            >
              Explorer les Parcours Métiers
            </Link>
            <Link
              href="/ressources"
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Fiches Mémo & Cheatsheets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
