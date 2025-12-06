'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { WeekMeta } from '@/lib/markdown';

interface WeeksIndexClientProps {
  weeksData: WeekMeta[];
}

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
        bg: 'bg-gradient-to-br from-primary/30 to-primary/20',
        border: 'border-primary/30 group-hover:border-primary/50',
        text: 'text-primary',
      },
      cardBg: 'bg-gradient-to-br from-primary/10 via-transparent to-primary/5',
      cardBorder: 'border-primary/25',
      cardHoverBorder: 'hover:border-primary/50',
      overlay: 'from-primary/25 via-primary/15 to-transparent',
      arrowHover: 'group-hover:text-primary',
      hoverShadow: '0 0 20px rgba(92,3,188,0.28), 0 0 35px rgba(0,145,255,0.15)',
      gradientColor: 'rgba(92,3,188,',
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
const generateRotations = (weeks: WeekMeta[]) => {
  const rotations: { [key: string]: { rotateX: number; rotateY: number; translateY: number } } = {};
  weeks.forEach((week, index) => {
    // Use index to create pseudo-random but consistent values
    const seed = (index * 7 + 3) % 12;
    rotations[week.weekNum] = {
      rotateX: (seed % 5 - 2) * 4.5, // -9 to 9 degrees (3x)
      rotateY: ((seed + 5) % 7 - 3) * 4.5, // -13.5 to 13.5 degrees (3x)
      translateY: ((seed + 2) % 5 - 2) * 3, // -6 to 6 pixels
    };
  });
  return rotations;
};

export default function WeeksIndexClient({ weeksData }: WeeksIndexClientProps) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Memoize rotations so they stay consistent
  const rotations = useMemo(() => generateRotations(weeksData), [weeksData]);

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
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseLeave = () => {
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
    
    const { left, width, top, height } = cardElement.getBoundingClientRect();
    const x = ((mousePos.x - left) / width) * 100;
    const y = ((mousePos.y - top) / height) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };



  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-invert mx-auto mb-8 kaynaklar-prose">
        <h1>GİT 119 - Haftalık Ders Akışı</h1>
        <p>Bu belge, &quot;Dijital Tasarıma Giriş&quot; dersi boyunca işleyeceğimiz konuları, ödevleri ve materyalleri bir arada toplar.</p>
      </article>

      <div ref={containerRef} className="flex flex-col gap-4" style={{ perspective: '1000px' }}>
          {weeksData.map((week) => {
            const weekNum = week.weekNum;
            const title = week.title;
            const rotation = rotations[weekNum];
            const isHovered = hoveredWeek === weekNum;
            const weekTheme = getWeekTheme(weekNum);
            const number = weekTheme.number;
            const contentFilter = { filter: 'none', textRendering: 'optimizeLegibility' as const };
            const scaleValue = isHovered ? 1.02 : 1;
            const gradientPos = isHovered ? getGradientPosition(weekNum) : { x: 50, y: 50 };

            return (
              <Link key={weekNum} href={week.slug} className="group block week-card-link" onClick={handleWeekClick}>
                <div 
                  ref={(el) => { cardRefs.current[weekNum] = el; }}
                  onMouseEnter={() => setHoveredWeek(weekNum)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className={`week-card relative bg-dark/60 ${weekTheme.cardBg} border ${weekTheme.cardBorder} ${weekTheme.cardHoverBorder} p-5 rounded-xl overflow-hidden shadow-lg shadow-black/10`}
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
                        ? `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, ${weekTheme.gradientColor}40 0%, transparent 40%)`
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
                        {week.description && (
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2 group-hover:text-slate-300 transition-colors">
                                {week.description}
                            </p>
                        )}
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
  );
}