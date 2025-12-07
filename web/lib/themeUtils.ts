import { WeekMeta } from '@/lib/markdown';

// Color + glow presets per week group
export const getWeekTheme = (weekNum: string) => {
  const num = parseInt(weekNum);

  // Week 1: Neon Theme
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
      hoverShadow: '0 0 20px rgb(var(--color-neon) / 0.3), 0 0 35px rgb(var(--color-neon) / 0.15)',
      gradientColor: 'rgb(var(--color-neon) / ',
    };
  }

  // Weeks 2-4: Accent Theme
  if (num >= 2 && num <= 4) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-accent/30 to-accent/20',
        border: 'border-accent/30 group-hover:border-accent/50',
        text: 'text-accent',
      },
      cardBg: 'bg-gradient-to-br from-accent/10 via-transparent to-accent/5',
      cardBorder: 'border-accent/20',
      cardHoverBorder: 'hover:border-accent/60',
      overlay: 'from-accent/30 via-accent/15 to-transparent',
      arrowHover: 'group-hover:text-accent',
      hoverShadow: '0 0 20px rgb(var(--color-accent) / 0.3), 0 0 35px rgb(var(--color-accent) / 0.15)',
      gradientColor: 'rgb(var(--color-accent) / ',
    };
  }

  // Weeks 5-7: Primary Theme (formerly ocean)
  if (num >= 5 && num <= 7) {
    return {
      number: {
        bg: 'bg-gradient-to-br from-primary/30 to-primary/20',
        border: 'border-primary/30 group-hover:border-primary/50',
        text: 'text-primary',
      },
      cardBg: 'bg-gradient-to-br from-primary/10 via-transparent to-primary/5',
      cardBorder: 'border-primary/20',
      cardHoverBorder: 'hover:border-primary/60',
      overlay: 'from-primary/30 via-primary/15 to-transparent',
      arrowHover: 'group-hover:text-primary',
      hoverShadow: '0 0 20px rgb(var(--color-primary) / 0.3), 0 0 35px rgb(var(--color-primary) / 0.15)',
      gradientColor: 'rgb(var(--color-primary) / ',
    };
  }

  // Weeks 8-10: Primary Theme (Keep consistent)
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
      hoverShadow: '0 0 20px rgb(var(--color-primary) / 0.28), 0 0 35px rgb(var(--color-primary) / 0.15)',
      gradientColor: 'rgb(var(--color-primary) / ',
    };
  }

  // Weeks 11-12: Primary/Accent Mix
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
    hoverShadow: '0 0 20px rgb(var(--color-primary) / 0.28), 0 0 35px rgb(var(--color-accent) / 0.15)',
    gradientColor: 'rgb(var(--color-primary) / ',
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
