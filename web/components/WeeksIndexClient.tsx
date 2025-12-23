'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { WeekMeta } from '@/lib/markdown';
import { getWeekTheme, generateRotations } from '@/lib/themeUtils';

interface WeeksIndexClientProps {
  weeksData: WeekMeta[];
}

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
    <div className="container mx-auto px-6 pb-8 pt-24 max-w-4xl">
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
                        ? `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, ${weekTheme.gradientColor} 0.4) 0%, transparent 40%)`
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
  );
}