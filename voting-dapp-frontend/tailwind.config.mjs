/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: 'rgb(var(--primary))',
        secondary: 'rgb(var(--secondary))',
        accent: 'rgb(var(--accent))',
        muted: 'rgb(var(--muted))',
        card: 'rgb(var(--card))',
        border: 'rgb(var(--border))',
      },
      animation: {
        gradient: 'gradient 8s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}