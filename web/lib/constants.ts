import { BookOpen, Calendar, Layers, Home, GraduationCap } from 'lucide-react';
import { iconColorMap } from '@/lib/iconColors';

export const GLITCH_PALETTES = [
  {
    gradientStart: '#ff0000',
    gradientEnd: '#0091ff',
    before: 'rgba(0, 0, 255, 0.95)',
    after: 'rgba(0, 145, 255, 0.95)',
  },
  {
    gradientStart: '#00ff00',
    gradientEnd: '#5C03BC',
    before: 'rgba(0, 255, 0, 0.9)',
    after: 'rgba(92, 3, 188, 0.75)',
  },
  {
    gradientStart: '#E536AB',
    gradientEnd: '#0000ff',
    before: 'rgba(0, 0, 255, 0.85)',
    after: 'rgba(229, 54, 171, 0.8)',
  },
  {
    gradientStart: '#0091ff',
    gradientEnd: '#ff0000',
    before: 'rgba(255, 0, 0, 0.9)',
    after: 'rgba(0, 145, 255, 0.85)',
  },
];

export const NAVIGATION_ITEMS = [
  { name: 'Ana Sayfa', href: '/', icon: Home, colorKey: 'home' as keyof typeof iconColorMap },
  { name: 'Müfredat', href: '/Mufredat/Syllabus', icon: BookOpen, colorKey: 'syllabus' as keyof typeof iconColorMap },
  { name: 'Haftalık Akış', href: '/haftalar', icon: Calendar, colorKey: 'haftalar' as keyof typeof iconColorMap },
  { name: 'Kaynaklar', href: '/Kaynaklar/Kaynakca', icon: Layers, colorKey: 'kaynaklar' as keyof typeof iconColorMap },
  { name: 'AcademiaOS', href: '/portal', icon: GraduationCap, colorKey: 'portal' as keyof typeof iconColorMap },
];
