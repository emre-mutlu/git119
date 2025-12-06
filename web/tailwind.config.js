/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Custom color palette (driven by CSS variables for live theming)
        dark: 'rgb(14 7 37)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
        },
        neon: {
          DEFAULT: 'rgb(var(--color-neon) / <alpha-value>)',
        },
        yellow: {
          DEFAULT: 'rgb(var(--color-yellow) / <alpha-value>)',
        },
        
        // Extended Palette
        blazingflame: {
          300: 'rgb(253 136 104)',
          400: 'rgb(253 96 53)',
          500: 'rgb(252 57 3)',
        },
        ocean: {
          300: 'rgb(102 189 255)',
          400: 'rgb(51 167 255)',
          500: 'rgb(0 145 255)',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        josefin: ['var(--font-josefin)', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
        rokkitt: ['var(--font-rokkitt)', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
