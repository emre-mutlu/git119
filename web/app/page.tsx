'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DashboardCards from '@/components/DashboardCards';

export default function Home() {
  // Static blobs with varied properties for CSS animation
  // Using transform-based animation classes defined in globals.css or tailwind config is more performant than updating top/left via JS
  const blobs = [
    { color: 'bg-purple-600', left: '10%', top: '20%', size: 'w-96 h-96', anim: 'animate-blob-float', delay: '0s' },
    { color: 'bg-blue-500', left: '70%', top: '50%', size: 'w-80 h-80', anim: 'animate-blob-float-reverse', delay: '2s' },
    { color: 'bg-pink-500', left: '40%', top: '30%', size: 'w-72 h-72', anim: 'animate-blob-float', delay: '4s' },
    { color: 'bg-cyan-400', left: '20%', top: '60%', size: 'w-64 h-64', anim: 'animate-blob-float-reverse', delay: '1s' },
  ];

  return (
    <div className="bg-dark text-slate-200 font-sans selection:bg-accent/30 h-screen overflow-hidden flex flex-col pt-20 relative">
      
      {/* Noise Texture for Banding Fix - Low Opacity Static Image */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none mix-blend-overlay" 
        style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat' 
        }}
      ></div>

      {/* Hero Section - %70 */}
      <header className="relative overflow-hidden flex-shrink-0 flex flex-col justify-center border-b border-primary/20 flex-[7] z-[2]">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl md:max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-full px-3 py-1 mb-4 shadow-lg shadow-primary/5">
              <span className="neon-dot animate-pulse"></span>
              <span className="text-accent text-xs font-medium tracking-wide uppercase">2025 Bahar Dönemi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-neon/50 to-accent">Dijital Tasarıma</span> Giriş
            </h1>
            <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              <span className="font-black text-slate-200">git119</span>{' '}
              dersi kapsamında <span className="font-bold text-slate-200">Adobe Photoshop</span>, <span className="font-bold text-slate-200">Illustrator</span> ve <span className="font-bold text-slate-200">Üretken Yapay Zeka</span> araçlarını kullanarak yaratıcılığınızı dijital dünyaya taşıyın.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              {/* Ana Butonlar */}
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/Mufredat/Syllabus" className="relative overflow-hidden px-6 py-3 bg-primary/90 backdrop-blur-md hover:bg-primary text-white font-semibold rounded-lg flex items-center group border border-white/10 transform-gpu neon-glow-button wave-button" style={{ transition: 'all 0.15s ease-out' }}>
                  <span className="relative z-10 flex items-center">
                    Syllabus’ı İncele
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1" style={{ transition: 'transform 0.15s ease-out' }} />
                  </span>
                </Link>
                <Link href="/haftalar" className="relative overflow-hidden px-6 py-3 bg-dark/50 backdrop-blur-md hover:bg-primary/20 text-slate-200 font-medium rounded-lg border border-primary/30 hover:border-accent/50 shadow-lg shadow-black/10 transform-gpu wave-button-secondary" style={{ transition: 'all 0.15s ease-out' }}>
                  <span className="relative z-10 flex items-center">
                    Haftalık Programa Git
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1" style={{ transition: 'transform 0.15s ease-out' }} />
                  </span>
                </Link>
              </div>

              {/* Notlar Butonu - Diğerleriyle Uyumlu */}
              <Link href="/student" className="relative overflow-hidden px-6 py-3 bg-dark/50 backdrop-blur-md hover:bg-pink/20 text-slate-200 font-medium rounded-lg border border-pink/30 hover:border-pink/50 shadow-lg shadow-black/10 transform-gpu wave-button-secondary" style={{ transition: 'all 0.15s ease-out' }}>
                <span className="relative z-10 flex items-center">
                  Notları Gör
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1" style={{ transition: 'transform 0.15s ease-out' }} />
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {blobs.map((blob, i) => (
            <div
              key={i}
              className={`absolute rounded-full mix-blend-screen filter blur-[80px] opacity-40 ${blob.color} ${blob.anim} will-change-transform`}
              style={{
                left: blob.left,
                top: blob.top,
                width: blob.size.split(' ')[0].replace('w-', '') === '96' ? '24rem' : '20rem',
                height: blob.size.split(' ')[1].replace('h-', '') === '96' ? '24rem' : '20rem',
                animationDuration: '10s',
                animationDelay: blob.delay,
              }}
            ></div>
          ))}
        </div>
      </header>

      {/* Dashboard Grid - %30 */}
      <main className="bg-[#0D0620] flex-shrink-0 relative z-20 flex items-center overflow-hidden flex-[3]">
        <div className="container mx-auto px-4 py-2">
          <DashboardCards />
        </div>
      </main>
    </div>
  );
}
