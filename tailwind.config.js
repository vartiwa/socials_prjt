/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#d6e0fd',
          300: '#b4c7fb',
          400: '#8ca6f7',
          500: '#637ef2',
          600: '#4f62e7',
          700: '#3f4ed0',
          800: '#3440aa',
          900: '#2d3786',
          950: '#1d2254',
        },
        obsidian: {
          950: '#06080d',
          900: '#0b0f19',
          850: '#101623',
          800: '#161d2f',
          750: '#1c253b',
          700: '#232e48',
          600: '#324164',
        },
        haven: {
          cream: '#FAF7F5',
          peach: '#F5EBE4',
          blush: '#F6EDE7',
          sand: '#EAE1D9',
          terracotta: {
            light: '#C97752',
            DEFAULT: '#B25E3B',
            dark: '#8C4728',
            deep: '#6E341B',
          },
          chocolate: {
            light: '#4E2619',
            DEFAULT: '#3D1D12',
            dark: '#24140E',
            deep: '#1A0E0A',
          },
          stone: '#2A160F',
          muted: '#755547',
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'eq-1': 'eq 0.8s ease-in-out infinite alternate',
        'eq-2': 'eq 1.1s ease-in-out infinite 0.2s alternate',
        'eq-3': 'eq 0.7s ease-in-out infinite 0.4s alternate',
        'eq-4': 'eq 1.2s ease-in-out infinite 0.1s alternate',
        'eq-5': 'eq 0.9s ease-in-out infinite 0.3s alternate',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        eq: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

