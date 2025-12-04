import Link from 'next/link';
import { getAllMarkdownSlugs } from '@/lib/markdown';
import { Calendar, ArrowRight } from 'lucide-react';

// Week titles mapping
const weekTitles: { [key: string]: string } = {
  '01': 'Derse Giriş, Vektör ve Piksel Kavramları',
  '02': 'Adobe Illustrator Arayüzü ve Temel Araçlar',
  '03': 'Pen Tool Atölyesi ve Karakter Tasarımı',
  '04': 'İleri Vektörel Teknikler ve Tipografiye Giriş',
  '05': 'Adobe Photoshop\'a Giriş: Katmanlar ve Maskeler',
  '06': 'Fotoğraf Manipülasyonu: Renk, Işık ve Kompozisyon',
  '07': 'Kavramsal Sanat / Poster Tasarımı',
  '08': 'Ürün Fotoğrafı ve Sosyal Medya Görseli',
  '09': 'Yapay Zeka ile Fikir Geliştirme: Prompt Sanatı',
  '10': 'Yapay Zeka Görsellerini Profesyonel Tasarıma Dönüştürme',
  '11': 'Final Projesi Başlangıcı ve Konsept Geliştirme',
  '12': 'İleri Tasarım İpuçları ve Portfolyo Hazırlığı',
};

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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Haftalık Ders Akışı</h1>
        <p className="text-slate-400 text-lg mb-12">
          Dönem boyunca işleyeceğimiz konular, ödevler ve materyaller.
        </p>

        <div className="flex flex-col gap-4">
          {weekSlugs.map((slug) => {
            const weekNum = slug.match(/Hafta_(\d+)/)?.[1] || '01';
            const href = `/${slug}`;
            const title = weekTitles[weekNum] || 'Ders Planı';

            return (
              <Link key={slug} href={href} className="group block">
                <div className="relative bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-purple-500/50 p-5 rounded-xl transition-all duration-300 overflow-hidden
                  blur-[0.5px] hover:blur-0">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-lg flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                        <span className="text-xl font-bold text-purple-400">{parseInt(weekNum)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Hafta {parseInt(weekNum)}</span>
                        <h2 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {title}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
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
