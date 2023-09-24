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
        xxs: '0.6rem',
        sm: '0.7rem',
        base: '0.9rem',
        md: '0.96rem'
      },
      keyframes: {
        bounceBubbles: {
          '0%': { opacity: '0', transform: 'scaleX(0.5)' },
          '25%': { opacity: '0.25', transform: 'translateY(0)' },
          '50%': { opacity: '0.5', transform: 'translateY(0)' },
          '100%': { opacity: '1.0', transform: 'translateY(0)' },
        },
      },
      animation: {
        'bounceBubbles': 'bounceBubbles 350ms linear 0ms 1 alternate'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
