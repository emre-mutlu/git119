import { BookOpen, Calendar, Layers, Home } from 'lucide-react';
import { iconColorMap } from '@/lib/iconColors';

export const GLITCH_PALETTES = [
  {
    gradientStart: '#5C03BC',
    gradientEnd: '#28D77D',
    before: 'rgba(57, 255, 20, 0.95)',
    after: 'rgba(40, 215, 125, 0.95)',
  },
  {
    gradientStart: '#3B0CA3',
    gradientEnd: '#39FF14',
    before: 'rgba(57, 255, 20, 0.9)',
    after: 'rgba(40, 215, 125, 0.75)',
  },
  {
    gradientStart: '#32154D',
    gradientEnd: '#28D77D',
    before: 'rgba(57, 255, 20, 0.85)',
    after: 'rgba(92, 3, 188, 0.8)',
  },
  {
    gradientStart: '#28D77D',
    gradientEnd: '#5C03BC',
    before: 'rgba(57, 255, 20, 0.9)',
    after: 'rgba(138, 98, 255, 0.85)',
  },
];

export const NAVIGATION_ITEMS = [
  { name: 'Ana Sayfa', href: '/', icon: Home, colorKey: 'home' as keyof typeof iconColorMap },
  { name: 'Müfredat', href: '/Mufredat/Syllabus', icon: BookOpen, colorKey: 'syllabus' as keyof typeof iconColorMap },
  { name: 'Haftalık Akış', href: '/haftalar', icon: Calendar, colorKey: 'haftalar' as keyof typeof iconColorMap },
  { name: 'Kaynaklar', href: '/Kaynaklar/Kaynakca', icon: Layers, colorKey: 'kaynaklar' as keyof typeof iconColorMap },
];
