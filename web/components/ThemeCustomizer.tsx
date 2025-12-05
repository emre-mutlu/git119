'use client';

import { usePathname } from 'next/navigation';
import { Palette, X } from 'lucide-react';
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
  { name: 'Zümrüt', hex: '#28D77D' },
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

export default function ThemeCustomizer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
        // fall through to computed styles
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

  const panel = (
    <div className="w-80 rounded-2xl border border-white/10 bg-dark/90 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Renk Paleti</p>
          <p className="text-xs text-slate-400">Var olan renklerle temayı anında güncelleyin.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <button
            type="button"
            className="px-2.5 py-1 rounded-full border border-white/10 text-slate-200 hover:text-white hover:border-white/30 transition"
            onClick={handleRandomize}
          >
            <span className="inline-flex gap-0.5">
              {randomLabelText.split('').map((ch, idx) => (
                <span key={`${ch}-${idx}`} style={{ color: randomLabelColors[idx] ?? 'inherit' }}>
                  {ch}
                </span>
              ))}
            </span>
          </button>
          <button
            type="button"
            className="text-neon hover:text-white transition"
            onClick={handleReset}
          >
            Sıfırla
          </button>
          <button
            type="button"
            className="text-slate-500 hover:text-white transition"
            onClick={() => setIsOpen(false)}
            aria-label="Paneli kapat"
          >
            <X size={14} />
          </button>
        </div>
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
  );

  if (isHome) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-dark/80 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10 shadow-lg backdrop-blur-md hover:bg-dark/90 transition neon-glow-button"
        >
          <Palette size={16} />
          Tema Aracı
          {isOpen && <X size={14} className="ml-1" />}
        </button>
        {isOpen && <div className="mt-3">{panel}</div>}
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50 flex flex-row-reverse items-center gap-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`rounded-l-2xl border border-white/10 bg-dark/80 px-3 py-5 text-slate-100 shadow-lg backdrop-blur-md flex flex-col items-center gap-2 transition-all neon-glow-button ${
          isOpen ? '' : 'translate-x-2'
        }`}
        aria-label="Tema aracını aç"
      >
        <Palette size={16} />
        <span
          className="text-[10px] tracking-[0.4em] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          Tema
        </span>
      </button>
      <div
        className={`transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-6 pointer-events-none'
        }`}
      >
        {panel}
      </div>
    </div>
  );
}
