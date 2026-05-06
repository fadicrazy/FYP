/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EBF0',
          100: '#C2D1DE',
          200: '#8FA8BF',
          300: '#5C7FA0',
          400: '#335D87',
          500: '#0A2540',
          600: '#091F36',
          700: '#07192C',
          800: '#051322',
          900: '#030D18',
        },
        accent: {
          50: '#E8FAF0',
          100: '#C5F2D9',
          200: '#8DE5B3',
          300: '#56D88D',
          400: '#2ECC71',
          500: '#27AE60',
          600: '#1F8C4D',
          700: '#176A3A',
          800: '#0F4827',
          900: '#082614',
        },
        medical: {
          blue: '#3498DB',
          red: '#E74C3C',
          orange: '#F39C12',
          purple: '#9B59B6',
          teal: '#1ABC9C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
