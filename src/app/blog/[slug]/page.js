import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost } from '@/lib/blogPosts';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Article non trouvé' };

  return {
    title: `${post.title} | Blog Elsayf`,
    description: post.excerpt,
    keywords: `${post.category}, guide tech algérie, elsayf formations, reconversion tech`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

// Lightweight Markdown to HTML-like parser for clean rendering
function renderFormattedContent(text) {
  const lines = text.trim().split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-4 space-y-2 list-disc list-inside text-slate-300">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    // Code block toggle
    if (line.startsWith('```')) {
      flushList();
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-5 rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
            <pre>{codeBuffer.join('\n')}</pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Headers
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${index}`} className="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-slate-800">
          {line.replace('## ', '')}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg font-semibold text-purple-300 mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`quote-${index}`} className="my-4 pl-4 border-l-4 border-purple-500 bg-purple-500/5 py-2 px-3 rounded-r text-slate-300 italic text-sm">
          {line.replace('> ', '')}
        </blockquote>
      );
      return;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      listBuffer.push(line.replace(/^[-*]\s+/, ''));
      return;
    }

    // Regular paragraphs
    if (line.trim().length > 0) {
      flushList();
      // Simple bold formatting
      const parts = line.split(/(\*\*.*?\*\*)/g);
      elements.push(
        <p key={`p-${index}`} className="my-3 text-slate-300 leading-relaxed text-base">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Schema.org structured data for SEO & Google Ads approval
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Elsayf Platform',
      url: 'https://elsayf.click',
    },
    datePublished: post.date,
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 selection:bg-purple-500 selection:text-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-purple-600/15 via-blue-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            &larr; Retour à la liste des articles
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 pb-8 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">⏱️ {post.readTime} de lecture</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Publié le {post.date}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-purple-500 pl-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs text-white">
              ES
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{post.author}</div>
              <div className="text-xs text-slate-400">Équipe Pédagogique Elsayf</div>
            </div>
          </div>
        </header>

        {/* Main Article Content */}
        <div className="prose prose-invert max-w-none text-slate-300">
          {renderFormattedContent(post.content)}
        </div>

        {/* Course Recommendation Box */}
        {post.relatedCourse && (
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-blue-950/40 border border-purple-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                  Formation recommandée associée
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {post.relatedCourse.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {post.relatedCourse.desc}
                </p>
              </div>
              <Link
                href={`/courses/${post.relatedCourse.slug}`}
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/20 whitespace-nowrap transition"
              >
                Découvrir la formation &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Synergie MyCV Section */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💼</span>
            <div>
              <div className="font-semibold text-white text-sm">
                Envie de valoriser ces compétences sur votre CV ?
              </div>
              <div className="text-xs text-slate-400">
                Créez un profil ATS professionnel optimisé pour les recruteurs avec MyCV.click.
              </div>
            </div>
          </div>
          <Link
            href="/cv/job-scanner"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 transition whitespace-nowrap"
          >
            Scanner mon offre d'emploi &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
