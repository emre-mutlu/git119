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

export const PROSE_CLASSES = `prose prose-invert prose-lg mx-auto
  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
  prose-h1:text-3xl prose-h1:md:text-4xl
  prose-h2:text-2xl
  prose-h3:text-xl
  prose-h4:text-lg
  prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-base
  prose-a:text-accent prose-a:no-underline prose-a:border-b prose-a:border-accent/30 hover:prose-a:border-accent hover:prose-a:text-white
  prose-strong:text-white prose-strong:font-semibold
  prose-code:text-accent prose-code:bg-primary/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:text-sm
  prose-pre:bg-dark prose-pre:border prose-pre:border-primary/30
  prose-li:text-slate-300 prose-li:leading-relaxed
  prose-ul:space-y-2
  prose-ol:space-y-2
  prose-table:border-primary/30
  prose-th:text-white prose-th:bg-primary/20 prose-th:p-4
  prose-td:text-slate-400 prose-td:p-4`;
