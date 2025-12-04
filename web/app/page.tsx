import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, FileText, Layers, Files } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-500/30">
      
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 pt-24 pb-16 md:pt-32 md:pb-24 border-b border-slate-800/60">
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-6 backdrop-blur-sm">
              <span className="flex w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
              <span className="text-violet-300 text-xs font-medium tracking-wide uppercase">2025 Bahar Dönemi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">Dijital Tasarım</span>a Giriş
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              git119 dersi kapsamında Adobe Photoshop, Illustrator ve Üretken Yapay Zeka araçlarını kullanarak yaratıcılığınızı dijital dünyaya taşıyın.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/mufredat/syllabus" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center group">
                Syllabus'ı İncele
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/haftalar" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-200">
                Haftalık Programa Git
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
           <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-violet-700/30 rounded-full blur-3xl"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-indigo-800/20 rounded-full blur-3xl"></div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Bu Hafta */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 p-6 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
              <Calendar className="text-indigo-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Haftalık Akış</h3>
            <p className="text-slate-400 text-sm mb-4">
              Her haftanın ders planına, ödevlerine ve materyallerine buradan ulaşabilirsiniz.
            </p>
            <Link href="/haftalar" className="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center">
              Programa Bak <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          {/* Card 2: Kaynaklar */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 p-6 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
              <BookOpen className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Kaynaklar</h3>
            <p className="text-slate-400 text-sm mb-4">
              Ders için önerilen kitaplar, video eğitimler ve faydalı web siteleri.
            </p>
            <Link href="/kaynaklar/kaynakca" className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center">
              Kütüphaneye Git <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          {/* Card 3: Şablonlar */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 p-6 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <Files className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Şablonlar</h3>
            <p className="text-slate-400 text-sm mb-4">
              Ödev teslimleri ve proje briefleri için gerekli standart şablon dosyaları.
            </p>
            <Link href="/sablonlar/odev-brief" className="text-emerald-400 text-sm font-medium hover:text-emerald-300 flex items-center">
              İndir <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

           {/* Card 4: Raporlar */}
           <div className="bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 p-6 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
              <Layers className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Raporlar</h3>
            <p className="text-slate-400 text-sm mb-4">
              Ders işleyişi ve geri bildirimlere dair analizler ve raporlar.
            </p>
            <Link href="/raporlar-ve-analizler/ders-icerigi-gozden-gecirme-raporu" className="text-amber-400 text-sm font-medium hover:text-amber-300 flex items-center">
              İncele <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
