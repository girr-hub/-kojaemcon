import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        bg: '#131313',
        surface: '#393939',
        ink: '#FFFFFF',
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
        blackhan: ['"Black Han Sans"', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
