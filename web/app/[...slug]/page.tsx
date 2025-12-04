import { getMarkdownContent, getAllMarkdownSlugs } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import path from 'path';

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

  if (!markdownData) {
    notFound();
  }

  const { content, data } = markdownData;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="prose prose-invert prose-lg prose-indigo mx-auto
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-100
        prose-h1:text-4xl prose-h1:mb-8 prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-indigo-400 prose-h1:to-cyan-400
        prose-p:text-slate-300 prose-p:leading-relaxed
        prose-a:text-indigo-400 prose-a:no-underline prose-a:border-b prose-a:border-indigo-500/30 hover:prose-a:border-indigo-400 hover:prose-a:text-indigo-300
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-indigo-300 prose-code:bg-indigo-950/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
        prose-li:text-slate-300
        prose-table:border-slate-800
        prose-th:text-slate-200 prose-th:bg-slate-900/50 prose-th:p-4
        prose-td:text-slate-400 prose-td:p-4
      ">
        {/* If there's a title in frontmatter, display it differently or let markdown h1 handle it */}
        {data.title && (
           <div className="mb-8 border-b border-slate-800 pb-8">
             <h1 className="!mb-4">{data.title}</h1>
             {data.description && <p className="text-xl text-slate-400">{data.description}</p>}
           </div>
        )}
        
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
