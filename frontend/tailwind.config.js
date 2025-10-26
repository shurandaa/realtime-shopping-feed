/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'amazon-navy': '#131921',
        'amazon-orange': '#FF9900',
      },
    },
  },
  plugins: [],
}
