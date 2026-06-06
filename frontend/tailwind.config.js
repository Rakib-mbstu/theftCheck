/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E3A8A',
          danger:  '#DC2626',
          accent:  '#F59E0B',
          bg:      '#F9FAFB',
          text:    '#111827',
          success: '#16A34A',
          card:    '#FFFFFF',
          muted:   '#6B7280',
          border:  '#E5E7EB',
          subtle:  '#EFF6FF',
        }
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / .08), 0 1px 2px -1px rgb(0 0 0 / .06)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / .08), 0 2px 4px -2px rgb(0 0 0 / .06)',
      }
    }
  },
  plugins: []
}
