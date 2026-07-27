/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#0A0E0F',
          surface: '#12181A',
          border: '#1E2A2D',
        },
        ink: {
          DEFAULT: '#E4EDEB',
          muted: '#6B8078',
        },
        signal: {
          DEFAULT: '#00E28A',
          dim: '#0A5C3E',
        },
        breach: {
          DEFAULT: '#FF9F1C',
          dim: '#7A4E0F',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
