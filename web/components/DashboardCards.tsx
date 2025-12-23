'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, Layers } from 'lucide-react';
import { iconColorMap } from '@/lib/iconColors';

export default function DashboardCards() {
  const cards = [
    {
      href: '/haftalar',
      icon: Calendar,
      title: 'Haftalık Akış',
      description: 'Her haftanın ders planına, ödevlerine ve materyallerine buradan ulaşabilirsiniz.',
      linkText: 'Programa Bak',
      color: iconColorMap.haftalar,
    },
    {
      href: '/Mufredat/Syllabus',
      icon: BookOpen,
      title: 'Müfredat',
      description: 'Dersin amaçları, hedefleri, değerlendirme kriterleri ve haftalık konular.',
      linkText: "Syllabus'ı İncele",
      color: iconColorMap.syllabus,
    },
    {
      href: '/Kaynaklar/Kaynakca',
      icon: Layers,
      title: 'Kaynaklar',
      description: 'Ders için önerilen kitaplar, video eğitimler ve faydalı web siteleri.',
      linkText: 'Kütüphaneye Git',
      color: iconColorMap.kaynaklar,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-7xl mx-auto">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="bg-dark/70 backdrop-blur-md border border-primary/20 p-7 rounded-xl group shadow-xl shadow-black/30 flex cursor-pointer transition-all duration-150 ease-out hover:scale-[1.01] gap-4"
            style={{ 
              ['--card-color' as string]: card.color,
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.color;
              e.currentTarget.style.boxShadow = `0 0 20px ${card.color}30, 0 15px 50px ${card.color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 mt-1"
              style={{ backgroundColor: `${card.color}20` }}
            >
              <Icon
                style={{ color: card.color }}
                size={22}
              />
            </div>

            <div className="flex flex-col flex-1">
              <h3 className="text-xl font-bold text-white leading-tight mb-3">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{card.description}</p>
              <span
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: card.color }}
              >
                {card.linkText}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
