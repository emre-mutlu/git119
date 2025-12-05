'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Calendar, Layers, Home } from 'lucide-react';
import { iconColorMap } from '@/lib/iconColors';

const glitchPalettes = [
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

const navigationItems = [
  { name: 'Ana Sayfa', href: '/', icon: Home, colorKey: 'home' as const },
  { name: 'Müfredat', href: '/Mufredat/Syllabus', icon: BookOpen, colorKey: 'syllabus' as const },
  { name: 'Haftalık Akış', href: '/haftalar', icon: Calendar, colorKey: 'haftalar' as const },
  { name: 'Kaynaklar', href: '/Kaynaklar/Kaynakca', icon: Layers, colorKey: 'kaynaklar' as const },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [glitchColors, setGlitchColors] = useState(glitchPalettes[0]);
  const triggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerGlitchRef = useRef<() => void>();

  useEffect(() => {
    const scheduleNext = () => {
      if (triggerTimeoutRef.current) {
        clearTimeout(triggerTimeoutRef.current);
      }
      const delay = Math.random() * 30000;
      triggerTimeoutRef.current = setTimeout(() => {
        triggerGlitchRef.current?.();
      }, delay);
    };

    const triggerGlitch = () => {
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
      const palette = glitchPalettes[Math.floor(Math.random() * glitchPalettes.length)];
      setGlitchColors(palette);
      setIsGlitchActive(true);
      const duration = 900 + Math.random() * 1200;
      activeTimeoutRef.current = setTimeout(() => {
        setIsGlitchActive(false);
        scheduleNext();
      }, duration);
    };

    triggerGlitchRef.current = triggerGlitch;
    scheduleNext();

    return () => {
      if (triggerTimeoutRef.current) {
        clearTimeout(triggerTimeoutRef.current);
      }
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
    };
  }, []);

  const handleLogoInteraction = () => {
    triggerGlitchRef.current?.();
  };

  const logoStyle: React.CSSProperties & Record<string, string> = {
    '--glitch-gradient-start': glitchColors.gradientStart,
    '--glitch-gradient-end': glitchColors.gradientEnd,
    '--glitch-before-color': glitchColors.before,
    '--glitch-after-color': glitchColors.after,
  };

  const logoClassName = `font-rokkitt text-4xl tracking-tight font-normal text-transparent bg-clip-text logo-glitch ${
    isGlitchActive ? 'logo-glitch-active' : ''
  }`;

  return (
    <>
    <nav className="bg-dark/60 backdrop-blur-lg backdrop-saturate-200 backdrop-brightness-125 text-slate-200 shadow-md sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center group select-none relative" onMouseEnter={handleLogoInteraction}>
            <span 
              data-text="git.119"
              className={logoClassName}
              style={logoStyle}
            >
              git.119
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const iconColor = iconColorMap[item.colorKey];
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out border ${
                    isActive
                      ? 'backdrop-blur-sm text-white border-white/10 shadow-inner'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-primary/10 hover:backdrop-blur-sm hover:border-white/5'
                  }`}
                  style={isActive ? { 
                    backgroundColor: `${iconColor}20`,
                    boxShadow: `inset 0 2px 4px ${iconColor}15`,
                    textShadow: `0 0 10px ${iconColor}40`
                  } : undefined}
                >
                  <Icon 
                    size={16} 
                    style={{ color: isActive ? iconColor : undefined, filter: isActive ? `drop-shadow(0 0 4px ${iconColor}60)` : undefined }} 
                    className={isActive ? '' : 'text-slate-500 group-hover:text-slate-400'} 
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button (Placeholder for now) */}
          <div className="md:hidden">
            <button className="text-slate-400 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div className="h-[1px] bg-primary sticky top-20 z-50" />
    </>
  );
}
