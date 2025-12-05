import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, FileText, Layers, Files } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark text-slate-200 font-sans selection:bg-accent/30">
      
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-dark pt-24 pb-16 md:pt-32 md:pb-24 border-b border-primary/20">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-full px-3 py-1 mb-6 shadow-lg shadow-primary/5">
              <span className="flex w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-accent text-xs font-medium tracking-wide uppercase">2025 Bahar Dönemi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent">Dijital Tasarıma</span> Giriş
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              git.119 dersi kapsamında Adobe Photoshop, Illustrator ve Üretken Yapay Zeka araçlarını kullanarak yaratıcılığınızı dijital dünyaya taşıyın.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/Mufredat/Syllabus" className="px-6 py-3 bg-primary/90 backdrop-blur-md hover:bg-primary text-white font-semibold rounded-lg shadow-lg shadow-primary/30 transition-all duration-200 flex items-center group border border-white/10 transform-gpu">
                Syllabus'ı İncele
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/haftalar" className="px-6 py-3 bg-dark/50 backdrop-blur-md hover:bg-primary/20 text-slate-200 font-medium rounded-lg border border-primary/30 hover:border-accent/50 transition-all duration-200 shadow-lg shadow-black/10 transform-gpu">
                Haftalık Programa Git
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
           <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-20%] left-[-15%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Haftalık Akış */}
          <div className="bg-dark/50 backdrop-blur-md border border-primary/20 hover:border-accent/40 p-6 rounded-xl transition-all duration-200 group shadow-lg shadow-black/5 hover:shadow-accent/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Calendar className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Haftalık Akış</h3>
              </div>
              <Link href="/haftalar" className="text-accent text-sm font-semibold hover:text-white flex items-center gap-1">
                Programa Bak <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-slate-400 text-sm">
              Her haftanın ders planına, ödevlerine ve materyallerine buradan ulaşabilirsiniz.
            </p>
          </div>

          {/* Card 2: Müfredat */}
          <div className="bg-dark/50 backdrop-blur-md border border-primary/20 hover:border-accent/40 p-6 rounded-xl transition-all duration-200 group shadow-lg shadow-black/5 hover:shadow-accent/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <BookOpen className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Müfredat</h3>
              </div>
              <Link href="/Mufredat/Syllabus" className="text-accent text-sm font-semibold hover:text-white flex items-center gap-1">
                Syllabus'ı İncele <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-slate-400 text-sm">
              Dersin amaçları, hedefleri, değerlendirme kriterleri ve haftalık konular.
            </p>
          </div>

          {/* Card 3: Kaynaklar */}
          <div className="bg-dark/50 backdrop-blur-md border border-primary/20 hover:border-accent/40 p-6 rounded-xl transition-all duration-200 group shadow-lg shadow-black/5 hover:shadow-accent/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Layers className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Kaynaklar</h3>
              </div>
              <Link href="/Kaynaklar/Kaynakca" className="text-accent text-sm font-semibold hover:text-white flex items-center gap-1">
                Kütüphaneye Git <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-slate-400 text-sm">
              Ders için önerilen kitaplar, video eğitimler ve faydalı web siteleri.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
