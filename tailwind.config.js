/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-tc': ['"Noto Serif TC"', 'serif'],
        'cinzel': ['Cinzel', 'serif'],
      },
      colors: {
        'temple-gold': '#ffd700',
        'temple-red': '#8B0000',
        'temple-brown': '#8B4513',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'smoke-move': 'smokeMove 20s ease-in-out infinite',
        'lantern-glow': 'lanternGlow 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8)' },
        },
        smokeMove: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        lanternGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(255, 50, 0, 0.6)' },
          '50%': { boxShadow: '0 0 50px rgba(255, 100, 0, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
