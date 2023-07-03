/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        'black': '#000000',
        'midnight-blue': '#142D55',
        'baby-blue': '#4B92FF',
        'pale-blue': '#B7e3FF',
        'deep-sapphire': '#0856CF',
        'bright-gold': '#EEB609',
        'light-gray': '#EAEBE7',
        'teal': '#029791',
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        sm: '0.7rem',
        base: '0.9rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
