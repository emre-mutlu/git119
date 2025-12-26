'use client';

import { useEffect, useMemo } from 'react';
import { WeekMeta } from '@/lib/markdown';
import { generateRotations } from '@/lib/themeUtils';
import WeekCard from '@/components/WeekCard';

interface WeeksIndexClientProps {
  weeksData: WeekMeta[];
}

export default function WeeksIndexClient({ weeksData }: WeeksIndexClientProps) {
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

  return (
    <div className="container mx-auto px-6 pb-8 pt-24 max-w-4xl">
      <article className="prose prose-invert mx-auto mb-8 kaynaklar-prose">
        <h1>GİT 119 - Haftalık Ders Akışı</h1>
        <p>Bu belge, &quot;Dijital Tasarıma Giriş&quot; dersi boyunca işleyeceğimiz konuları, ödevleri ve materyalleri bir arada toplar.</p>
      </article>

      <div className="flex flex-col gap-4" style={{ perspective: '1000px' }}>
          {weeksData.map((week) => (
            <WeekCard
              key={week.weekNum}
              week={week}
              rotation={rotations[week.weekNum]}
              onClick={handleWeekClick}
            />
          ))}
      </div>
    </div>
  );
}
