'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Palette } from 'lucide-react';
import { iconColorMap } from '@/lib/iconColors';
import ThemeCustomizer from './ThemeCustomizer';
import { GLITCH_PALETTES, NAVIGATION_ITEMS } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [proximity, setProximity] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glitchColors, setGlitchColors] = useState(GLITCH_PALETTES[0]);
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
      const delay = 2000 + Math.random() * 13000; // 2-15 seconds
      triggerTimeoutRef.current = setTimeout(() => {
        triggerGlitchRef.current?.();
      }, delay);
    };

    const triggerGlitch = () => {
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
      const palette = GLITCH_PALETTES[Math.floor(Math.random() * GLITCH_PALETTES.length)];
      setGlitchColors(palette);
      setIsGlitchActive(true);
      // Random duration between 0ms and 1500ms
      const duration = Math.random() * 1500;
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
      const radius = 180; // increased radius for smoother approach
      const raw = Math.max(0, Math.min(1, 1 - dist / radius));
      const eased = Math.pow(raw, 3); // cubic curve: stays low for longer, spikes near center
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
    backgroundImage: 'linear-gradient(135deg, rgb(var(--color-accent)) 0%, rgb(var(--color-accent)) 70%, rgb(var(--color-primary)) 100%)', // Updated gradient per request
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  };

  // Show intense glitch ONLY on direct hover or very close proximity.
  // Random triggers (isGlitchActive) are separate.
  const showGlitch = isHovering || proximity > 0.85; 
  const proximityClass = proximity > 0.1 ? 'logo-glitch-proximity' : ''; // Subtle hint starts earlier

  const logoClassName = [
    'font-rokkitt text-4xl tracking-tight font-[550] text-transparent bg-clip-text logo-glitch',
    (showGlitch || isGlitchActive) ? 'logo-glitch-active' : '', // Active state for hover OR random
    proximityClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
    <nav ref={navRef} className="bg-dark/60 backdrop-blur-lg backdrop-saturate-200 backdrop-brightness-125 text-slate-200 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-primary/50">
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
                <span style={{ color: 'rgb(var(--color-neon))' }}>119</span>
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => {
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
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.setProperty('--hover-icon-color', iconColor);
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.removeProperty('--hover-icon-color');
                                  }}
                                >
                                  <Icon 
                                    size={16} 
                                    style={{
                                      color: isActive ? iconColor : undefined, 
                                      filter: isActive ? `drop-shadow(0 0 4px ${iconColor}60)` : undefined 
                                    }} 
                                    className={`transition-colors ${isActive ? '' : 'text-slate-500 group-hover:text-[var(--hover-icon-color)]'}`} 
                                  />
                                  <span>{item.name}</span>
                                </Link>              );
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
                {NAVIGATION_ITEMS.map((item) => {
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
    </>
  );
}
