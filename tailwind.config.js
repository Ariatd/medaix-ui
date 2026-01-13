/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B1FF',
          400: '#3397FF',
          500: '#0066CC',
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001429',
        },
        success: {
          DEFAULT: '#00AA00',
          50: '#E6FFE6',
          100: '#CCFFCC',
          200: '#99FF99',
          300: '#66FF66',
          400: '#33FF33',
          500: '#00AA00',
          600: '#008800',
          700: '#006600',
          800: '#004400',
          900: '#002200',
        },
        warning: {
          DEFAULT: '#FFAA00',
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFAA00',
          600: '#CC8800',
          700: '#996600',
          800: '#664400',
          900: '#332200',
        },
        danger: {
          DEFAULT: '#CC0000',
          50: '#FFE6E6',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF3333',
          500: '#CC0000',
          600: '#A30000',
          700: '#7A0000',
          800: '#520000',
          900: '#290000',
        },
        background: {
          DEFAULT: '#F5F5F5',
          light: '#FAFAFA',
          dark: '#E5E5E5',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(400px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

