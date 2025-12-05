import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DashboardCards from '@/components/DashboardCards';

export default function Home() {
  return (
    <div className="bg-dark text-slate-200 font-sans selection:bg-accent/30 h-[calc(100vh-5rem)] flex flex-col">
      
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-dark flex-[2] flex items-center border-b border-primary/20">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl md:max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-full px-3 py-1 mb-6 shadow-lg shadow-primary/5">
              <span className="neon-dot animate-pulse"></span>
              <span className="text-accent text-xs font-medium tracking-wide uppercase">2025 Bahar Dönemi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent">Dijital Tasarıma</span> Giriş
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              <span className="font-black text-slate-200">git.119</span>{' '}
              dersi kapsamında <span className="font-bold text-slate-200">Adobe Photoshop</span>, <span className="font-bold text-slate-200">Illustrator</span> ve <span className="font-bold text-slate-200">Üretken Yapay Zeka</span> araçlarını kullanarak yaratıcılığınızı dijital dünyaya taşıyın.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/Mufredat/Syllabus" className="px-6 py-3 bg-primary/90 backdrop-blur-md hover:bg-primary text-white font-semibold rounded-lg transition-all duration-200 flex items-center group border border-white/10 transform-gpu neon-glow-button">
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
      <main className="bg-[#0D0620] flex-1 flex items-center relative z-20">
        <div className="container mx-auto px-4">
          <DashboardCards />
        </div>
      </main>
    </div>
  );
}
