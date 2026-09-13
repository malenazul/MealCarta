/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060913',
          900: '#0B0F19',
          850: '#101626',
          800: '#161F36',
          700: '#1F2C4C',
        },
        encarta: {
          violet: '#8B5CF6',
          violetLight: '#A78BFA',
          violetDark: '#6D28D9',
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          cyanDark: '#0E7490',
          teal: '#14B8A6',
          burgundy: '#4C0519',
          gold: '#F59E0B',
          parchment: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.45)',
        'glow-violet': '0 0 20px -3px rgba(139, 92, 246, 0.45)',
        'glow-combined': '0 0 25px -5px rgba(6, 182, 212, 0.3), 0 0 25px -5px rgba(139, 92, 246, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
