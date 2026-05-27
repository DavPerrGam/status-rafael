/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#0f4e96',
          dark: '#08375d',
          light: '#3d7ab5',
          soft: '#e8f2fa',
        },
        accent: {
          DEFAULT: '#0d82a2',
          soft: '#d9eef5',
        },
        boyaca: {
          DEFAULT: '#1a6b4a',
          soft: '#e8f5ef',
        },
        status: {
          active: '#057a57',
          warning: '#c97a12',
          error: '#b83832',
        },
      },
      boxShadow: {
        brand: '0 18px 42px rgba(15, 78, 150, 0.1)',
        'brand-lg': '0 28px 56px rgba(8, 55, 93, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.55s ease-out forwards',
        'slide-up': 'slideUp 0.55s ease-out forwards',
        'pulse-soft': 'pulseSoft 2.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
};
