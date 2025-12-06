'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeVariable = '--color-primary' | '--color-accent' | '--color-neon';

const STORAGE_KEY = 'git119-theme-preferences';

const controls: { label: string; description: string; variable: ThemeVariable }[] = [
  { label: 'Primary', description: 'Ana gradient ve kart tonları', variable: '--color-primary' },
  { label: 'Accent', description: 'Vurgular ve ikon renkleri', variable: '--color-accent' },
  { label: 'Highlight', description: 'Pulse ve ikon parlaklıkları', variable: '--color-neon' },
];

const colorOptions = [
  { name: 'Mor', hex: '#5C03BC' },
  { name: 'Pembe', hex: '#E536AB' },
  { name: 'Neon Yeşil', hex: '#39FF14' },
  { name: 'Altın Sarısı', hex: '#F3C969' },
  { name: 'Turuncu', hex: '#FC3903' },
  { name: 'Okyanus', hex: '#0091FF' },
];

const defaultHexMap: Record<ThemeVariable, string> = {
  '--color-primary': '#5C03BC',
  '--color-accent': '#28D77D',
  '--color-neon': '#39FF14',
};

const randomizeLabelColors = (label: string) =>
  label.split('').map((char) => (char.trim().length === 0 ? 'inherit' : colorOptions[Math.floor(Math.random() * colorOptions.length)].hex));

const activeButtonClass = 'ring-2 ring-offset-2 ring-offset-dark ring-white/80 scale-105';

const hexToRgbTriplet = (hex: string) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
};

const rgbTripletToHex = (triplet: string) => {
  const [r, g, b] = triplet
    .split(' ')
    .map((num) => Number(num))
    .filter((n) => !Number.isNaN(n));
  if ([r, g, b].some((n) => typeof n === 'undefined')) {
    return '#000000';
  }
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const persistSelections = (values: Record<ThemeVariable, string>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
};

const applyVariablesToDocument = (values: Partial<Record<ThemeVariable, string>>) => {
  if (typeof window === 'undefined') return;
  (Object.entries(values) as [ThemeVariable, string | undefined][]).forEach(([variable, hex]) => {
    if (!hex) return;
    document.documentElement.style.setProperty(variable, hexToRgbTriplet(hex));
  });
};

const randomLabelText = 'Rastgele';

export default function ThemeCustomizer({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [selections, setSelections] = useState<Record<ThemeVariable, string>>(() => ({ ...defaultHexMap }));
  const [randomLabelColors, setRandomLabelColors] = useState<string[]>(() => randomizeLabelColors('Rastgele'));

  const commitSelections = (builder: (prev: Record<ThemeVariable, string>) => Record<ThemeVariable, string>) => {
    setSelections((prev: Record<ThemeVariable, string>) => {
      const next = builder(prev);
      applyVariablesToDocument(next);
      persistSelections(next);
      return next;
    });
  };

  // Initial load from local storage or computed styles
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Record<ThemeVariable, string>>;
        const hydrated: Record<ThemeVariable, string> = { ...defaultHexMap };
        (Object.entries(parsed) as [ThemeVariable, string][]).forEach(([variable, value]) => {
          if (value) hydrated[variable] = value;
        });
        setSelections(hydrated);
        applyVariablesToDocument(hydrated);
        return;
      } catch {
        // fall through
      }
    }

    const root = document.documentElement;
    const current: Record<ThemeVariable, string> = { ...defaultHexMap };
    controls.forEach((ctrl) => {
      const value = getComputedStyle(root).getPropertyValue(ctrl.variable).trim();
      if (value) {
        current[ctrl.variable] = rgbTripletToHex(value);
      }
    });
    setSelections(current);
    setRandomLabelColors(randomizeLabelColors(randomLabelText));
  }, []);

  const applyColor = (variable: ThemeVariable, hex: string) => {
    commitSelections((prev) => ({ ...prev, [variable]: hex }));
  };

  const handleReset = () => {
    commitSelections(() => ({ ...defaultHexMap }));
  };

  const handleRandomize = () => {
    commitSelections((prev) => {
      const randomSelections = { ...prev } as Record<ThemeVariable, string>;
      controls.forEach((ctrl) => {
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)].hex;
        randomSelections[ctrl.variable] = randomColor;
      });
      return randomSelections;
    });
    setRandomLabelColors(randomizeLabelColors(randomLabelText));
  };

  // Close on Escape key
  useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
          if (isOpen && e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);


  return (
    <>
      {/* Backdrop for mobile or clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={onClose}
        />
      )}
      
      {/* Panel - positioned directly to the right of palette icon */}
      <div
        className={`fixed z-50 top-5 right-10 w-56 rounded-xl border border-white/20 bg-dark/98 backdrop-blur-xl p-4 shadow-2xl transition-all duration-200 ease-out origin-top-right ${
          isOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Renk Paleti</p>
          <button
            type="button"
            className="text-slate-400 hover:text-white transition"
            onClick={onClose}
            aria-label="Paneli kapat"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {controls.map((ctrl) => (
            <div key={ctrl.variable} className="space-y-1.5">
              <div className="text-xs font-medium text-slate-300">{ctrl.label}</div>
              <div className="grid grid-cols-6 gap-1.5">
                {colorOptions.map((option) => (
                  <button
                    key={`${ctrl.variable}-${option.hex}`}
                    type="button"
                    onClick={() => applyColor(ctrl.variable, option.hex)}
                    className={`aspect-square rounded-md border border-white/10 transition-all duration-150 focus:outline-none ${
                      selections[ctrl.variable] === option.hex ? activeButtonClass : 'hover:border-white/40 hover:scale-110'
                    }`}
                    style={{ backgroundColor: option.hex }}
                    aria-label={`${ctrl.label} ${option.name}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex-1 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-white/30 hover:bg-white/10 transition text-xs font-medium"
            onClick={handleRandomize}
          >
            Rastgele
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-md text-neon hover:text-white hover:bg-white/5 transition text-xs font-medium"
            onClick={handleReset}
          >
            Sıfırla
          </button>
        </div>
      </div>
    </>
  );
}
