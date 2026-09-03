/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          dark: '#0a1a0f',
          green: '#1a3a24',
          light: '#2d5a3a',
          gold: '#c9a84c',
          cream: '#f5e6c8',
        },
        tile: {
          brown: '#8B4513',
          lightblue: '#87CEEB',
          pink: '#FF69B4',
          orange: '#FF8C00',
          red: '#DC143C',
          yellow: '#FFD700',
          green: '#228B22',
          darkblue: '#000080',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'dice-roll': 'diceRoll 0.5s ease-in-out',
        'token-bounce': 'tokenBounce 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        diceRoll: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(90deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '75%': { transform: 'rotate(270deg)' },
        },
        tokenBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
