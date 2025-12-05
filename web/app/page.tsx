'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DashboardCards from '@/components/DashboardCards';
import { useState, useEffect } from 'react';

// Color palette for animated blobs
const blobColors = [
  { color: 'rgba(92,3,188,', name: 'primary' },      // #5C03BC
  { color: 'rgba(229,54,171,', name: 'accent' },     // #E536AB
  { color: 'rgba(57,255,20,', name: 'neon' },        // #39FF14
  { color: 'rgba(252,57,3,', name: 'blazingflame' }, // #FC3903
  { color: 'rgba(0,145,255,', name: 'ocean' },       // #0091FF
  { color: 'rgba(40,215,125,', name: 'emeraldgreen' },// #28D77D
  { color: 'rgba(149,96,159,', name: 'lavender' },   // #95609F
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
              <Link href="/Mufredat/Syllabus" className="relative overflow-hidden px-6 py-3 bg-primary/90 backdrop-blur-md hover:bg-primary text-white font-semibold rounded-lg flex items-center group border border-white/10 transform-gpu neon-glow-button wave-button hover:-translate-y-1" style={{ transition: 'all 0.3s cubic-bezier(0.37, 0, 0.63, 1)' }}>
                <span className="relative z-10 flex items-center">
                  Syllabus'ı İncele
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/haftalar" className="relative overflow-hidden px-6 py-3 bg-dark/50 backdrop-blur-md hover:bg-primary/20 text-slate-200 font-medium rounded-lg border border-primary/30 hover:border-accent/50 shadow-lg shadow-black/10 transform-gpu wave-button-secondary hover:-translate-y-1" style={{ transition: 'all 0.3s cubic-bezier(0.37, 0, 0.63, 1)' }}>
                <span className="relative z-10">Haftalık Programa Git</span>
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
                animationDuration: `${blob.duration}s`,
                animationDelay: `${blob.delay}s`,
                transition: 'background-color 3s ease-in-out',
              }}
            />
          ))}
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
