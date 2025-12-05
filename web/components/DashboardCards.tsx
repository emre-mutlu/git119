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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="bg-dark/70 backdrop-blur-md border border-primary/20 hover:border-accent/50 p-6 rounded-xl group shadow-lg shadow-black/10 hover:shadow-accent/20 flex flex-col cursor-pointer"
            style={{ transition: 'all 0.15s ease-out' }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <Icon
                  style={{ color: card.color }}
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
            </div>
            <p className="text-slate-400 text-sm flex-1">{card.description}</p>
            <span
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
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
