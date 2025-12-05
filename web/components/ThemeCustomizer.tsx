'use client';

import { Palette, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeVariable = '--color-primary' | '--color-accent' | '--color-neon';

const controls: { label: string; description: string; variable: ThemeVariable }[] = [
  { label: 'Primary', description: 'Ana gradient ve kart tonları', variable: '--color-primary' },
  { label: 'Accent', description: 'Vurgular ve ikon renkleri', variable: '--color-accent' },
  { label: 'Highlight', description: 'Pulse ve ikon parlaklıkları', variable: '--color-neon' },
];

const colorOptions = [
  { name: 'Mor', hex: '#5C03BC' },
  { name: 'Pembe', hex: '#E536AB' },
  { name: 'Neon Yeşil', hex: '#39FF14' },
  { name: 'Güneş Sarısı', hex: '#FFFF00' },
  { name: 'Turuncu', hex: '#FC3903' },
  { name: 'Okyanus', hex: '#0091FF' },
  { name: 'Zümrüt', hex: '#28D77D' },
  { name: 'Lavanta', hex: '#95609F' },
];

const defaultHexMap: Record<ThemeVariable, string> = {
  '--color-primary': '#5C03BC',
  '--color-accent': '#E536AB',
  '--color-neon': '#39FF14',
};

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

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState<Record<ThemeVariable, string>>(() => ({ ...defaultHexMap }));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const current: Record<ThemeVariable, string> = { ...defaultHexMap };
    controls.forEach((ctrl) => {
      const value = getComputedStyle(root).getPropertyValue(ctrl.variable).trim();
      if (value) {
        current[ctrl.variable] = rgbTripletToHex(value);
      }
    });
    setSelections(current);
  }, []);

  const applyColor = (variable: ThemeVariable, hex: string) => {
    setSelections((prev) => ({ ...prev, [variable]: hex }));
    if (typeof window === 'undefined') return;
    document.documentElement.style.setProperty(variable, hexToRgbTriplet(hex));
  };

  const handleReset = () => {
    (Object.entries(defaultHexMap) as [ThemeVariable, string][]).forEach(([variable, hex]) => {
      applyColor(variable, hex);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-dark/80 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10 shadow-lg backdrop-blur-md hover:bg-dark/90 transition"
      >
        <Palette size={16} />
        Tema Aracı
        {isOpen && <X size={14} className="ml-1" />}
      </button>

      {isOpen && (
        <div className="mt-3 w-80 rounded-2xl border border-white/10 bg-dark/90 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Renk Paleti</p>
              <p className="text-xs text-slate-400">Var olan renklerle temayı anında güncelleyin.</p>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-neon hover:text-white transition"
              onClick={handleReset}
            >
              Sıfırla
            </button>
          </div>

          <div className="space-y-4">
            {controls.map((ctrl) => (
              <div key={ctrl.variable} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-white">{ctrl.label}</span>
                  <span>{ctrl.description}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={`${ctrl.variable}-${option.hex}`}
                      type="button"
                      onClick={() => applyColor(ctrl.variable, option.hex)}
                      className={`h-10 rounded-lg border border-white/10 transition-transform focus:outline-none ${
                        selections[ctrl.variable] === option.hex ? activeButtonClass : 'hover:border-white/40'
                      }`}
                      style={{ backgroundColor: option.hex }}
                      aria-label={`${ctrl.label} ${option.name}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
