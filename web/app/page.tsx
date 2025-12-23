'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DashboardCards from '@/components/DashboardCards';
import { useState, useEffect } from 'react';

// Core 6 Colors for animated blobs
const blobColors = [
  { color: 'rgba(255,0,0,', name: 'red' },         // #ff0000
  { color: 'rgba(0,255,0,', name: 'lime' },        // #00ff00
  { color: 'rgba(0,0,255,', name: 'blue' },        // #0000ff
  { color: 'rgba(0,145,255,', name: 'ocean' },     // #0091ff
  { color: 'rgba(92,3,188,', name: 'purple' },     // #5C03BC
  { color: 'rgba(229,54,171,', name: 'pink' },     // #E536AB
];

interface Blob {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const generateBlobs = (): Blob[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 20,
    y: Math.random() * 100 - 20,
    size: 300 + Math.random() * 300,
    color: blobColors[Math.floor(Math.random() * blobColors.length)].color,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * 5,
  }));
};

export default function Home() {
  const [blobs, setBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    setBlobs(generateBlobs());
    
    // Change blob colors periodically
    const interval = setInterval(() => {
      setBlobs(prev => prev.map(blob => ({
        ...blob,
        color: blobColors[Math.floor(Math.random() * blobColors.length)].color,
      })));
    }, 8000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-dark text-slate-200 font-sans selection:bg-accent/30 h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      
      {/* Hero Section - %70 */}
      <header className="relative overflow-hidden flex-shrink-0 flex flex-col justify-center border-b border-primary/20 flex-[7]">
        
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {blobs.map((blob) => (
            <div
              key={blob.id}
              className="absolute rounded-full animate-blob-float"
              style={{
                left: `${blob.x}%`,
                top: `${blob.y}%`,
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                backgroundColor: `${blob.color}0.15)`,
                filter: 'blur(80px)',
                WebkitFilter: 'blur(80px)', // Safari specific
                transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
                willChange: 'transform',
                animationDuration: `${blob.duration}s`,
                animationDelay: `${blob.delay}s`,
                transition: 'background-color 3s ease-in-out',
              }}
            />
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
    </div>
  );
}
