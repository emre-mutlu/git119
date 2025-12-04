import Link from 'next/link';
import { getAllMarkdownSlugs } from '@/lib/markdown';
import { Calendar, ArrowRight } from 'lucide-react';

export default function WeeksIndexPage() {
  // Get all slugs related to 'Haftalar'
  const allSlugs = getAllMarkdownSlugs();
  const weekSlugs = allSlugs.filter(slug => slug.startsWith('Haftalar/') && slug.includes('Ders_Plani'));
  
  // Sort weeks numerically (Week 1, Week 2...)
  weekSlugs.sort((a, b) => {
    const numA = parseInt(a.match(/Hafta_(\d+)/)?.[1] || '0');
    const numB = parseInt(b.match(/Hafta_(\d+)/)?.[1] || '0');
    return numA - numB;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Haftalık Ders Akışı</h1>
        <p className="text-slate-400 text-lg mb-12">
          Dönem boyunca işleyeceğimiz konular, ödevler ve materyaller.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weekSlugs.map((slug) => {
            const weekNum = slug.match(/Hafta_(\d+)/)?.[1];
            // Construct the URL from the file path structure
            // slug is like 'Haftalar/Hafta_01/Ders_Plani'
            // We want the link to be '/haftalar/hafta-01/ders-plani' (lowercase for URL consistency if desired, but current router uses exact path)
            const href = `/${slug}`; 

            return (
              <Link key={slug} href={href} className="group block">
                <div className="bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-xl transition-all duration-200 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-500/20">
                        {weekNum}. HAFTA
                      </span>
                      <Calendar size={18} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-200 group-hover:text-white mb-2 transition-colors">
                      Ders Planı & İçerik
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Bu haftanın konu başlıklarını, sınıf içi uygulamalarını ve ödev detaylarını inceleyin.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Detayları Gör <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
