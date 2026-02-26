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
      animation: {
        'float-slow': 'floatSlow 20s ease-in-out infinite',
        'float-slower': 'floatSlower 25s ease-in-out infinite',
        'blob-float': 'blobFloat 12s ease-in-out infinite',
        'blob-float-reverse': 'blobFloatReverse 14s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(15px, -20px)' },
          '50%': { transform: 'translate(-10px, 15px)' },
          '75%': { transform: 'translate(20px, 10px)' },
        },
        floatSlower: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(-20px, 15px)' },
          '66%': { transform: 'translate(15px, -10px)' },
        },
        blobFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '75%': { transform: 'translate(40px, 30px) scale(1.15)' },
        },
        blobFloatReverse: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-25px, 35px) scale(1.12)' },
          '50%': { transform: 'translate(30px, -15px) scale(0.88)' },
          '75%': { transform: 'translate(-35px, -25px) scale(1.08)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
