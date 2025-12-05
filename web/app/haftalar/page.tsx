'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';

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

const weeks = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

// Color groups for every 4 weeks
const colorGroups = {
  // Week 1-4: Red (Illustrator)
  group1: {
    border: 'border-red-500/30',
    hoverBorder: 'hover:border-red-400/60',
    gradient: 'from-red-500/20 to-red-600/10',
    numberBg: 'bg-red-500/20',
    numberBorder: 'border-red-500/40 group-hover:border-red-400/60',
    numberColor: 'text-red-400',
    shadow: '0_0_30px_rgba(255,0,0,0.3),0_0_60px_rgba(255,51,51,0.2)',
    label: 'Adobe Illustrator',
  },
  // Week 5-8: Blue (Photoshop)
  group2: {
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-400/60',
    gradient: 'from-blue-500/20 to-blue-600/10',
    numberBg: 'bg-blue-500/20',
    numberBorder: 'border-blue-500/40 group-hover:border-blue-400/60',
    numberColor: 'text-blue-400',
    shadow: '0_0_30px_rgba(0,0,255,0.3),0_0_60px_rgba(51,51,255,0.2)',
    label: 'Adobe Photoshop',
  },
  // Week 9-12: Lime (AI & Final)
  group3: {
    border: 'border-lime-500/30',
    hoverBorder: 'hover:border-lime-400/60',
    gradient: 'from-lime-500/20 to-lime-600/10',
    numberBg: 'bg-lime-500/20',
    numberBorder: 'border-lime-500/40 group-hover:border-lime-400/60',
    numberColor: 'text-lime-400',
    shadow: '0_0_30px_rgba(0,255,0,0.3),0_0_60px_rgba(51,255,51,0.2)',
    label: 'AI & Final',
  },
};

const getColorGroup = (weekNum: string) => {
  const num = parseInt(weekNum);
  if (num <= 4) return colorGroups.group1;
  if (num <= 8) return colorGroups.group2;
  return colorGroups.group3;
};

// Generate random but consistent rotations for each week
const generateRotations = () => {
  const rotations: { [key: string]: { rotateX: number; rotateY: number; translateY: number } } = {};
  weeks.forEach((week, index) => {
    // Use index to create pseudo-random but consistent values
    const seed = (index * 7 + 3) % 12;
    rotations[week] = {
      rotateX: (seed % 5 - 2) * 4.5, // -9 to 9 degrees (3x)
      rotateY: ((seed + 5) % 7 - 3) * 4.5, // -13.5 to 13.5 degrees (3x)
      translateY: ((seed + 2) % 5 - 2) * 3, // -6 to 6 pixels
    };
  });
  return rotations;
};

export default function WeeksIndexPage() {
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Memoize rotations so they stay consistent
  const rotations = useMemo(() => generateRotations(), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMouseY(e.clientY - rect.top);
      }
    };

    const handleMouseLeave = () => {
      setMouseY(null);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const getBlurAndBrightness = (weekNum: string) => {
    if (mouseY === null || !containerRef.current) {
      return { blur: 1, brightness: 0.9, scale: 1 };
    }

    const cardElement = cardRefs.current[weekNum];
    if (!cardElement) {
      return { blur: 1, brightness: 0.9, scale: 1 };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();
    const cardCenterY = cardRect.top - containerRect.top + cardRect.height / 2;
    
    // Calculate distance from mouse to card center
    const distance = Math.abs(mouseY - cardCenterY);
    const maxDistance = 700; // Max distance for full blur (increased by 200px)
    
    // Calculate blur based on distance (0 at mouse position, max at maxDistance)
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    const blur = normalizedDistance * 1.5; // Max blur of 1.5px
    const brightness = 1 - (normalizedDistance * 0.2); // 0.8 to 1.0 brightness
    
    // Scale up slightly when very close to mouse
    const scale = distance < 100 ? 1.02 : 1;

    return { blur, brightness, scale };
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Haftalık Ders Akışı</h1>
        <p className="text-slate-400 text-lg mb-12">
          Dönem boyunca işleyeceğimiz konular, ödevler ve materyaller.
        </p>

        <div ref={containerRef} className="flex flex-col gap-4" style={{ perspective: '1000px' }}>
          {weeks.map((weekNum) => {
            const href = `/Haftalar/Hafta_${weekNum}/Ders_Plani`;
            const title = weekTitles[weekNum] || 'Ders Planı';
            const { blur, brightness, scale } = getBlurAndBrightness(weekNum);
            const rotation = rotations[weekNum];
            const isHovered = hoveredWeek === weekNum;
            const colors = getColorGroup(weekNum);

            return (
              <Link key={weekNum} href={href} className="group block">
                <div 
                  ref={(el) => { cardRefs.current[weekNum] = el; }}
                  onMouseEnter={() => setHoveredWeek(weekNum)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className={`relative bg-neutral-800/80 backdrop-blur-sm border ${colors.border} ${colors.hoverBorder} p-5 rounded-xl transition-all duration-300 overflow-hidden`}
                  style={{
                    filter: `blur(${blur}px) brightness(${brightness})`,
                    transform: isHovered 
                      ? `scale(${scale}) rotateX(0deg) rotateY(0deg) translateY(0px)` 
                      : `scale(${scale}) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg) translateY(${rotation.translateY}px)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: isHovered ? colors.shadow.split(',').map(s => s.trim()).join(', ') : 'none',
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 ${colors.numberBg} rounded-lg flex items-center justify-center border ${colors.numberBorder} transition-colors`}>
                        <span className={`text-xl font-bold ${colors.numberColor}`}>{parseInt(weekNum)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Hafta {parseInt(weekNum)}</span>
                        <h2 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {title}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight size={20} className={`text-slate-600 group-hover:${colors.numberColor} group-hover:translate-x-1 transition-all flex-shrink-0`} />
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
