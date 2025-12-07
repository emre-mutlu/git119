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
        dark: 'rgb(14 7 37)',
        
        // Core 6 Colors
        red: 'rgb(var(--color-red) / <alpha-value>)',
        lime: 'rgb(var(--color-lime) / <alpha-value>)',
        blue: 'rgb(var(--color-blue) / <alpha-value>)',
        ocean: 'rgb(var(--color-ocean) / <alpha-value>)',
        purple: 'rgb(var(--color-purple) / <alpha-value>)',
        pink: 'rgb(var(--color-pink) / <alpha-value>)',
        
        // Theme aliases (customizable)
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        neon: 'rgb(var(--color-neon) / <alpha-value>)',
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
