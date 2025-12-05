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

            return (
              <Link key={weekNum} href={href} className="group block">
                <div 
                  ref={(el) => { cardRefs.current[weekNum] = el; }}
                  onMouseEnter={() => setHoveredWeek(weekNum)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className="relative bg-dark backdrop-blur-sm border border-primary/20 hover:border-accent/50 p-5 rounded-xl transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_rgba(244,162,11,0.3),0_0_60px_rgba(224,60,31,0.2)]"
                  style={{
                    filter: `blur(${blur}px) brightness(${brightness})`,
                    transform: isHovered 
                      ? `scale(${scale}) rotateX(0deg) rotateY(0deg) translateY(0px)` 
                      : `scale(${scale}) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg) translateY(${rotation.translateY}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/30 to-accent/20 rounded-lg flex items-center justify-center border border-primary/30 group-hover:border-accent/50 transition-colors">
                        <span className="text-xl font-bold text-accent">{parseInt(weekNum)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Hafta {parseInt(weekNum)}</span>
                        <h2 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {title}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-slate-600 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
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
