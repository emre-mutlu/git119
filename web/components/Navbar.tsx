'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Calendar, Layers, Home, Palette } from 'lucide-react';
import { iconColorMap } from '@/lib/iconColors';
import ThemeCustomizer from './ThemeCustomizer';

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
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [proximity, setProximity] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glitchColors, setGlitchColors] = useState(glitchPalettes[0]);
  const triggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerGlitchRef = useRef<() => void>();
  const logoRef = useRef<HTMLSpanElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

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
      // Random duration between 200ms and 1000ms (1 second max)
      const duration = 200 + Math.random() * 800;
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

  const handleLogoMouseEnter = () => {
    setIsHovering(true);
    triggerGlitchRef.current?.();
  };

  const handleLogoMouseLeave = () => {
    setIsHovering(false);
  };

  // Proximity-based gentle reveal (limited to navbar bounds)
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const handleMove = (e: MouseEvent) => {
      const el = logoRef.current;
      if (!el) return setProximity(0);
      const navRect = navEl.getBoundingClientRect();
      const insideNav =
        e.clientX >= navRect.left &&
        e.clientX <= navRect.right &&
        e.clientY >= navRect.top &&
        e.clientY <= navRect.bottom;
      if (!insideNav) {
        setProximity(0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 110; // hotspot radius within nav
      const raw = Math.max(0, Math.min(1, 1 - dist / radius));
      const eased = Math.pow(raw, 1.05); // slightly softer decay
      setProximity(eased);
    };

    const handleLeave = () => setProximity(0);

    navEl.addEventListener('mousemove', handleMove);
    navEl.addEventListener('mouseleave', handleLeave);

    return () => {
      navEl.removeEventListener('mousemove', handleMove);
      navEl.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const logoStyle: React.CSSProperties & Record<string, string> = {
    '--glitch-gradient-start': glitchColors.gradientStart,
    '--glitch-gradient-end': glitchColors.gradientEnd,
    '--glitch-before-color': glitchColors.before,
    '--glitch-after-color': glitchColors.after,
    '--glitch-proximity': proximity.toFixed(3),
    '--glitch-speed-scale': (0.5 + 0.35 * proximity).toFixed(3),
    backgroundImage: 'linear-gradient(135deg, #28D77D 0%, #28D77D 70%, #5C03BC 100%)', // Updated gradient per request
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  };

  // Show glitch if: random trigger OR hover OR proximity fade-in
  const showGlitch = isGlitchActive || isHovering || proximity > 0.05;
  const proximityClass = proximity > 0.02 ? 'logo-glitch-proximity' : '';

  const logoClassName = [
    'font-rokkitt text-4xl tracking-tight font-[550] text-transparent bg-clip-text logo-glitch',
    showGlitch ? 'logo-glitch-active' : '',
    proximityClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
    <nav ref={navRef} className="bg-dark/60 backdrop-blur-lg backdrop-saturate-200 backdrop-brightness-125 text-slate-200 shadow-md sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center group select-none relative" onMouseEnter={handleLogoMouseEnter} onMouseLeave={handleLogoMouseLeave}>
            <span 
              ref={logoRef}
              data-text="git119"
              className={logoClassName}
              style={{
                ...logoStyle,
                backgroundImage: 'none',
                backgroundClip: 'unset',
                WebkitBackgroundClip: 'unset',
                color: 'transparent' // Main text transparent to show children? No, we want children to have colors.
              }}
            >
              {/* Main visible logo with flat colors */}
              <span className="relative z-10">
                <span style={{ color: '#FFFFFF' }}>git</span>
                <span style={{ color: '#39FF14' }}>119</span>
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
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

            {/* Divider */}
            <div className="h-6 w-px bg-white/10 mx-2" />

            {/* Theme Toggle (Desktop) */}
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className={`p-2 rounded-md transition-all duration-200 border ${
                isThemeOpen 
                  ? 'text-white bg-white/10 border-white/20 shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
              }`}
              aria-label="Temayı Özelleştir"
            >
              <Palette size={18} />
            </button>
          </div>

          {/* Mobile: Theme + Menu buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              className={`p-2 rounded-lg border transition ${
                isThemeOpen 
                ? 'text-white bg-white/10 border-white/20' 
                : 'text-slate-200 border-white/10 hover:text-white hover:border-white/20'
              }`}
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              aria-label="Tema aracını aç"
            >
              <Palette size={20} />
            </button>
            
            <button
              className="text-slate-200 hover:text-white focus:outline-none p-2 rounded-lg border border-white/10 hover:border-white/20 transition"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Menüyü aç"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-200 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="pb-2">
            <div className="mt-2 rounded-xl border border-white/10 bg-dark/85 backdrop-blur-xl shadow-lg">
              <div className="flex flex-col divide-y divide-white/5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const iconColor = iconColorMap[item.colorKey];
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive ? 'text-white bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={18} style={{ color: isActive ? iconColor : undefined }} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme Customizer Overlay/Panel */}
      <ThemeCustomizer isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
    </nav>
    <div className="h-[1px] bg-primary sticky top-20 z-50" />
    </>
  );
}
