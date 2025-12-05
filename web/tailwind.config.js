/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Custom color palette
        dark: '#0E0725',
        primary: '#5C03BC',
        accent: '#E536AB',
        neon: '#39FF14',
        yellow: '#FFFF00',
        
        // Extended Palette
        blazingflame: {
          300: '#fd8868',
          400: '#fd6035',
          500: '#fc3903',
        },
        ocean: {
          300: '#66bdff',
          400: '#33a7ff',
          500: '#0091ff',
        },
        emeraldgreen: {
          300: '#7ee7b1',
          400: '#53df97',
          500: '#28d77d',
        },
        lavender: {
          300: '#bf9fc6',
          400: '#aa80b3',
          500: '#95609f',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        josefin: ['var(--font-josefin)', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
