/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00A0D2',
        error: '#FC0606',
        // Text colors
        text: {
          primary: '#1F1F1F',
          secondary: '#41444B',
          tertiary: '#6E6E6E',
          quaternary: '#8A8A8A',
          disabled: '#BBBBBB',
        },
        // Background colors
        bg: {
          primary: '#FFFFFF',
          secondary: '#FAFAFA',
          tertiary: '#F5F5F5',
        },
        // Border colors
        border: {
          DEFAULT: '#D9D9D9',
          light: '#F0F0F0',
        },
      },
      spacing: {
        // 하단 버튼 영역 (90px = 5.625rem)
        'bottom-bar': '5.625rem',
        // 섹션 간격 (10px = 0.625rem)
        'section-gap': '0.625rem',
        // 섹션 패딩 (20px = 1.25rem)
        'section-padding': '1.25rem',
        // 섹션 수직 패딩 (30px = 1.875rem)
        'section-padding-v': '1.875rem',
      },
      fontSize: {
        // 24px = 1.5rem
        'page-title': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        // 18px = 1.125rem
        'section-title': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        // 14px = 0.875rem
        'label': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        // 16px = 1rem
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
