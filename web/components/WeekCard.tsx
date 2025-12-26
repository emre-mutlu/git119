'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, MouseEvent } from 'react';
import { WeekMeta } from '@/lib/markdown';
import { getWeekTheme } from '@/lib/themeUtils';

interface WeekCardProps {
  week: WeekMeta;
  rotation: { rotateX: number; rotateY: number; translateY: number };
  onClick: () => void;
}

export default function WeekCard({ week, rotation, onClick }: WeekCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const weekNum = week.weekNum;
  const title = week.title;
  const weekTheme = getWeekTheme(weekNum);
  const number = weekTheme.number;
  const contentFilter = { filter: 'none', textRendering: 'optimizeLegibility' as const };
  const scaleValue = isHovered ? 1.02 : 1;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGradientPos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      });
    }
  };

  return (
    <Link
      href={week.slug}
      className="group block week-card-link"
      onClick={onClick}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
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
}
