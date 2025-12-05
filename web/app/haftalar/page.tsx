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

// Color + glow presets per week group
const getWeekTheme = (weekNum: string) => {
  const num = parseInt(weekNum);

  // Week groups with distinct palette (8/9/10 unified emerald)
  if (num === 1) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-neon/30 to-neon/20',
        border: 'border-neon/30 group-hover:border-neon/50',
        text: 'text-neon',
      },
      cardBg: 'bg-gradient-to-br from-neon/10 via-transparent to-neon/5',
      cardBorder: 'border-neon/25',
      cardHoverBorder: 'hover:border-neon/60',
      overlay: 'from-neon/25 via-neon/15 to-transparent',
      arrowHover: 'group-hover:text-neon',
      hoverShadow: '0 0 20px rgba(57,255,20,0.3), 0 0 35px rgba(57,255,20,0.15)',
      gradientColor: 'rgba(57,255,20,',
    };
  }

  if (num >= 2 && num <= 4) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-blazingflame-400/30 to-blazingflame-500/20',
        border: 'border-blazingflame-400/30 group-hover:border-blazingflame-300/50',
        text: 'text-blazingflame-300',
      },
      cardBg: 'bg-gradient-to-br from-blazingflame-500/10 via-transparent to-blazingflame-400/5',
      cardBorder: 'border-blazingflame-500/20',
      cardHoverBorder: 'hover:border-blazingflame-400/60',
      overlay: 'from-blazingflame-500/30 via-blazingflame-400/15 to-transparent',
      arrowHover: 'group-hover:text-blazingflame-300',
      hoverShadow: '0 0 20px rgba(252,57,3,0.3), 0 0 35px rgba(253,96,53,0.15)',
      gradientColor: 'rgba(252,57,3,',
    };
  }

  if (num >= 5 && num <= 7) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-ocean-400/30 to-ocean-500/20',
        border: 'border-ocean-400/30 group-hover:border-ocean-300/50',
        text: 'text-ocean-300',
      },
      cardBg: 'bg-gradient-to-br from-ocean-500/10 via-transparent to-ocean-400/5',
      cardBorder: 'border-ocean-500/20',
      cardHoverBorder: 'hover:border-ocean-400/60',
      overlay: 'from-ocean-500/30 via-ocean-400/15 to-transparent',
      arrowHover: 'group-hover:text-ocean-300',
      hoverShadow: '0 0 20px rgba(0,145,255,0.3), 0 0 35px rgba(51,167,255,0.15)',
      gradientColor: 'rgba(0,145,255,',
    };
  }

  if (num >= 8 && num <= 10) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-emeraldgreen-400/30 to-emeraldgreen-500/20',
        border: 'border-emeraldgreen-400/30 group-hover:border-emeraldgreen-300/50',
        text: 'text-emeraldgreen-300',
      },
      cardBg: 'bg-gradient-to-br from-emeraldgreen-500/10 via-transparent to-emeraldgreen-400/5',
      cardBorder: 'border-emeraldgreen-500/25',
      cardHoverBorder: 'hover:border-emeraldgreen-400/60',
      overlay: 'from-emeraldgreen-500/25 via-emeraldgreen-400/15 to-transparent',
      arrowHover: 'group-hover:text-emeraldgreen-300',
      hoverShadow: '0 0 20px rgba(40,215,125,0.28), 0 0 35px rgba(40,215,125,0.15)',
      gradientColor: 'rgba(40,215,125,',
    };
  }

  // Weeks 11-12 - Royal purple
  return {
    number: {
      bg: 'bg-gradient-to-br from-primary/30 to-accent/25',
      border: 'border-primary/30 group-hover:border-primary/50',
      text: 'text-primary',
    },
    cardBg: 'bg-gradient-to-br from-primary/15 via-transparent to-accent/10',
    cardBorder: 'border-primary/25',
    cardHoverBorder: 'hover:border-primary/50',
    overlay: 'from-primary/25 via-accent/20 to-transparent',
    arrowHover: 'group-hover:text-primary',
    hoverShadow: '0 0 20px rgba(92,3,188,0.28), 0 0 35px rgba(229,54,171,0.15)',
    gradientColor: 'rgba(92,3,188,',
  };
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
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Memoize rotations so they stay consistent
  const rotations = useMemo(() => generateRotations(), []);

  // Restore scroll position from sessionStorage on mount
  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('haftalar-scroll-pos');
    if (savedScrollPos) {
      window.scrollTo(0, parseInt(savedScrollPos, 10));
      sessionStorage.removeItem('haftalar-scroll-pos');
    }
  }, []);

  // Save scroll position before navigating to week detail
  const handleWeekClick = () => {
    sessionStorage.setItem('haftalar-scroll-pos', window.scrollY.toString());
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMouseY(e.clientY - rect.top);
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseLeave = () => {
      setMouseY(null);
      setMousePos(null);
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

  // Calculate gradient position based on mouse position relative to card
  const getGradientPosition = (weekNum: string) => {
    const cardElement = cardRefs.current[weekNum];
    if (!cardElement || !mousePos) return { x: 50, y: 50 };
    
    const rect = cardElement.getBoundingClientRect();
    const x = ((mousePos.x - rect.left) / rect.width) * 100;
    const y = ((mousePos.y - rect.top) / rect.height) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const getBlurAndBrightness = () => ({ blur: 0, brightness: 1 });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">GİT 119 - Haftalık Ders Akışı</h1>
          <p className="text-slate-400 text-lg">
            Dönem boyunca işleyeceğimiz konular, ödevler ve materyaller.
          </p>
        </div>

        <div ref={containerRef} className="flex flex-col gap-4" style={{ perspective: '1000px' }}>
          {weeks.map((weekNum) => {
            const href = `/Haftalar/Hafta_${weekNum}/Ders_Plani`;
            const title = weekTitles[weekNum] || 'Ders Planı';
            const { blur, brightness } = getBlurAndBrightness();
            const rotation = rotations[weekNum];
            const isHovered = hoveredWeek === weekNum;
            const weekTheme = getWeekTheme(weekNum);
            const number = weekTheme.number;
            const contentFilter = { filter: 'none', textRendering: 'optimizeLegibility' as const };
            const scaleValue = isHovered ? 1.02 : 1;
            const gradientPos = isHovered ? getGradientPosition(weekNum) : { x: 50, y: 50 };

            return (
              <Link key={weekNum} href={href} className="group block week-card-link" onClick={handleWeekClick}>
                <div 
                  ref={(el) => { cardRefs.current[weekNum] = el; }}
                  onMouseEnter={() => setHoveredWeek(weekNum)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className={`week-card relative bg-dark/60 ${weekTheme.cardBg} backdrop-blur-md border ${weekTheme.cardBorder} ${weekTheme.cardHoverBorder} p-5 rounded-xl overflow-hidden shadow-lg shadow-black/10`}
                  style={{
                    ['--rotate-x' as string]: `${rotation.rotateX}deg`,
                    ['--rotate-y' as string]: `${rotation.rotateY}deg`,
                    ['--translate-y' as string]: `${rotation.translateY}px`,
                    ['--scale' as string]: scaleValue,
                    boxShadow: isHovered ? weekTheme.hoverShadow : undefined,
                    outline: '1px solid transparent',
                  }}
                >
                  {/* Gradient overlay on hover - follows mouse */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: isHovered 
                        ? `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, ${weekTheme.gradientColor}40 0%, transparent 60%)`
                        : undefined,
                    }}
                  />
                  
                  <div className="relative flex items-center justify-between gap-4" style={contentFilter}>
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 ${number.bg} rounded-lg flex items-center justify-center border ${number.border} transition-colors`}>
                        <span className={`text-xl font-bold ${number.text}`}>{parseInt(weekNum)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Hafta {parseInt(weekNum)}</span>
                        <h2 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {title}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight size={20} className={`text-slate-600 ${weekTheme.arrowHover} group-hover:translate-x-1 transition-all flex-shrink-0`} />
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
