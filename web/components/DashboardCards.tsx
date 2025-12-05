'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, Layers } from 'lucide-react';
import { useMemo } from 'react';

const iconColors = [
  '#5C03BC', // mor
  '#E536AB', // pembe
  '#39FF14', // neon yeşil
  '#FC3903', // turuncu
  '#0091FF', // okyanus
  '#28D77D', // zümrüt
  '#95609F', // lavanta
];

function getRandomColors() {
  const shuffled = [...iconColors].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1], shuffled[2]];
}

export default function DashboardCards() {
  const colors = useMemo(() => getRandomColors(), []);

  const cards = [
    {
      href: '/haftalar',
      icon: Calendar,
      title: 'Haftalık Akış',
      description: 'Her haftanın ders planına, ödevlerine ve materyallerine buradan ulaşabilirsiniz.',
      linkText: 'Programa Bak',
      color: colors[0],
    },
    {
      href: '/Mufredat/Syllabus',
      icon: BookOpen,
      title: 'Müfredat',
      description: 'Dersin amaçları, hedefleri, değerlendirme kriterleri ve haftalık konular.',
      linkText: "Syllabus'ı İncele",
      color: colors[1],
    },
    {
      href: '/Kaynaklar/Kaynakca',
      icon: Layers,
      title: 'Kaynaklar',
      description: 'Ders için önerilen kitaplar, video eğitimler ve faydalı web siteleri.',
      linkText: 'Kütüphaneye Git',
      color: colors[2],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="relative overflow-hidden bg-dark/70 backdrop-blur-md border border-primary/20 hover:border-transparent p-6 rounded-xl transition-all duration-300 group shadow-lg shadow-black/10 hover:shadow-xl flex flex-col cursor-pointer dashboard-card"
            style={{
              '--card-color': card.color,
            } as React.CSSProperties}
          >
            {/* Animated wave gradient background on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 wave-gradient"
              style={{
                background: `linear-gradient(135deg, ${card.color}20 0%, transparent 25%, ${card.color}15 50%, transparent 75%, ${card.color}10 100%)`,
                backgroundSize: '200% 200%',
              }}
            />
            
            {/* Border glow effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 20px ${card.color}20, 0 0 30px ${card.color}30`,
              }}
            />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: `${card.color}20`,
                }}
              >
                <Icon
                  className="transition-all duration-300 group-hover:brightness-125 group-hover:drop-shadow-lg"
                  style={{ 
                    color: card.color,
                    filter: 'drop-shadow(0 0 0px transparent)',
                  }}
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">{card.title}</h3>
            </div>
            <p className="text-slate-400 text-sm flex-1 relative z-10 group-hover:text-slate-300 transition-colors">{card.description}</p>
            <span
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:brightness-125 relative z-10"
              style={{ color: card.color }}
            >
              {card.linkText}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
