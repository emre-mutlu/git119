import { getMarkdownContent, getAllMarkdownSlugs } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import path from 'path';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// Generate static params for all markdown files to be statically exported
export async function generateStaticParams() {
  const slugs = getAllMarkdownSlugs();
  return slugs.map((slug) => ({
    slug: slug.split(path.sep),
  }));
}

export default async function MarkdownPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const markdownData = getMarkdownContent(slugPath + '.md');
  const isSyllabus = slugPath.toLowerCase() === 'mufredat/syllabus';
  const isKaynaklar = slugPath.toLowerCase().startsWith('kaynaklar/');
  const isWeekPage = slugPath.toLowerCase().startsWith('haftalar/hafta_');

  if (!markdownData) {
    notFound();
  }

  const { content, data } = markdownData;
  const proseBase = `prose prose-invert prose-lg mx-auto
    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
    prose-h1:text-3xl prose-h1:md:text-4xl
    prose-h2:text-2xl
    prose-h3:text-xl
    prose-h4:text-lg
    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-base
    prose-a:text-accent prose-a:no-underline prose-a:border-b prose-a:border-accent/30 hover:prose-a:border-accent hover:prose-a:text-white
    prose-strong:text-white prose-strong:font-semibold
    prose-code:text-accent prose-code:bg-primary/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:text-sm
    prose-pre:bg-dark prose-pre:border prose-pre:border-primary/30
    prose-li:text-slate-300 prose-li:leading-relaxed
    prose-ul:space-y-2
    prose-ol:space-y-2
    prose-table:border-primary/30
    prose-th:text-white prose-th:bg-primary/20 prose-th:p-4
    prose-td:text-slate-400 prose-td:p-4`;
  
  const simpleProse = 'prose prose-invert mx-auto mb-8';
  
    let articleClassName;
  
    if (isKaynaklar || isSyllabus) { // isSyllabus de aynı sade stile sahip olacak
        articleClassName = `${simpleProse} ${isKaynaklar ? 'kaynaklar-prose' : ''} ${isSyllabus ? 'syllabus-prose' : ''}`;
    } else {
        articleClassName = `${proseBase}`; // isSyllabus kaldırıldı
    }
  const title = typeof data.title === 'string' ? data.title : undefined;
  const description = typeof data.description === 'string' ? data.description : undefined;

  return (
    <div className="container mx-auto px-4 pb-8 pt-24 max-w-4xl">
      {/* Back to weeks button for week pages */}
      {isWeekPage && (
        <Link 
          href="/haftalar" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Haftalara Dön</span>
        </Link>
      )}
      
      <article className={articleClassName}>
        {/* If there's a title in frontmatter, display it differently or let markdown h1 handle it */}
        {title && (
           <>
             <h1>{title}</h1>
             {description && <p>{description}</p>}
           </>
        )}
        
        <MarkdownRenderer content={content} hideHr={isKaynaklar} />
      </article>
    </div>
  );
}
