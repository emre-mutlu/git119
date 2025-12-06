import { WeekMeta } from '@/lib/markdown';

// Color + glow presets per week group
export const getWeekTheme = (weekNum: string) => {
  const num = parseInt(weekNum);

  // Week groups with distinct palette (8/9/10 unified emerald)
  if (num === 1) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-neon/30 to-neon/20',
        border: 'border-neon/30 group-hover:border-neon/50',
        text: 'text-neon',
      },
      cardBg: 'bg-gradient-to-br from-neon/10 via-transparent to-neon/5',
      cardBorder: 'border-neon/25',
      cardHoverBorder: 'hover:border-neon/60',
      overlay: 'from-neon/25 via-neon/15 to-transparent',
      arrowHover: 'group-hover:text-neon',
      hoverShadow: '0 0 20px rgba(57,255,20,0.3), 0 0 35px rgba(57,255,20,0.15)',
      gradientColor: 'rgba(57,255,20,',
    };
  }

  if (num >= 2 && num <= 4) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-blazingflame-400/30 to-blazingflame-500/20',
        border: 'border-blazingflame-400/30 group-hover:border-blazingflame-300/50',
        text: 'text-blazingflame-300',
      },
      cardBg: 'bg-gradient-to-br from-blazingflame-500/10 via-transparent to-blazingflame-400/5',
      cardBorder: 'border-blazingflame-500/20',
      cardHoverBorder: 'hover:border-blazingflame-400/60',
      overlay: 'from-blazingflame-500/30 via-blazingflame-400/15 to-transparent',
      arrowHover: 'group-hover:text-blazingflame-300',
      hoverShadow: '0 0 20px rgba(252,57,3,0.3), 0 0 35px rgba(253,96,53,0.15)',
      gradientColor: 'rgba(252,57,3,',
    };
  }

  if (num >= 5 && num <= 7) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-ocean-400/30 to-ocean-500/20',
        border: 'border-ocean-400/30 group-hover:border-ocean-300/50',
        text: 'text-ocean-300',
      },
      cardBg: 'bg-gradient-to-br from-ocean-500/10 via-transparent to-ocean-400/5',
      cardBorder: 'border-ocean-500/20',
      cardHoverBorder: 'hover:border-ocean-400/60',
      overlay: 'from-ocean-500/30 via-ocean-400/15 to-transparent',
      arrowHover: 'group-hover:text-ocean-300',
      hoverShadow: '0 0 20px rgba(0,145,255,0.3), 0 0 35px rgba(51,167,255,0.15)',
      gradientColor: 'rgba(0,145,255,',
    };
  }

  if (num >= 8 && num <= 10) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-primary/30 to-primary/20',
        border: 'border-primary/30 group-hover:border-primary/50',
        text: 'text-primary',
      },
      cardBg: 'bg-gradient-to-br from-primary/10 via-transparent to-primary/5',
      cardBorder: 'border-primary/25',
      cardHoverBorder: 'hover:border-primary/50',
      overlay: 'from-primary/25 via-primary/15 to-transparent',
      arrowHover: 'group-hover:text-primary',
      hoverShadow: '0 0 20px rgba(92,3,188,0.28), 0 0 35px rgba(0,145,255,0.15)',
      gradientColor: 'rgba(92,3,188,',
    };
  }

  // Weeks 11-12 - Royal purple
  return {
    number: {
      bg: 'bg-gradient-to-br from-primary/30 to-accent/25',
      border: 'border-primary/30 group-hover:border-primary/50',
      text: 'text-primary',
    },
    cardBg: 'bg-gradient-to-br from-primary/15 via-transparent to-accent/10',
    cardBorder: 'border-primary/25',
    cardHoverBorder: 'hover:border-primary/50',
    overlay: 'from-primary/25 via-accent/20 to-transparent',
    arrowHover: 'group-hover:text-primary',
    hoverShadow: '0 0 20px rgba(92,3,188,0.28), 0 0 35px rgba(229,54,171,0.15)',
    gradientColor: 'rgba(92,3,188,',
  };
};

// Generate random but consistent rotations for each week
export const generateRotations = (weeks: WeekMeta[]) => {
  const rotations: { [key: string]: { rotateX: number; rotateY: number; translateY: number } } = {};
  weeks.forEach((week, index) => {
    // Use index to create pseudo-random but consistent values
    const seed = (index * 7 + 3) % 12;
    rotations[week.weekNum] = {
      rotateX: (seed % 5 - 2) * 4.5, // -9 to 9 degrees (3x)
      rotateY: ((seed + 5) % 7 - 3) * 4.5, // -13.5 to 13.5 degrees (3x)
      translateY: ((seed + 2) % 5 - 2) * 3, // -6 to 6 pixels
    };
  });
  return rotations;
};
