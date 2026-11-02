/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      transitionProperty : {
        'width': 'width, min-width',
        'custom': 'width, transform'
      },
      colors: {
        danger: '#C92630',
        primary: '#1673A1',
        secondary: 'rgba(105, 160, 204, 0.45)',
        'input-border': 'rgba(0, 0, 0, 0.35)',
        'faded-white': 'rgba(255, 255, 255, 0.65)',
        'bf-grey': '#BFBFBF',
        'side-bg': '#F5F6F7',
        'faded-black': 'rgba(0, 0, 0, 0.5)',
        'dropdown-border': 'rgba(62, 69, 82, 0.22)',
        'dark-blue': '#134974',
        'maroon-red': '#E00345',
        'grey-box': '#C0C5CA',
      },
      fontFamily: {
        'monte-carlo': `MonteCarlo, cursive`,
        'montserrat': ['Montserrat'],
        raleway: 'Raleway, sans-serif',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0 },
          '80%': { opacity: 1 },
        },
        logo: {
          '0%': {
            transform: 'scale(1.5)',
          },
          '80%, 100%': {
            transform: 'scale(1)',
          },
        },
        logoText: {
          '0%': {
            transform: 'scale(0)',
            width: '0px',
          },
          '50%': {
            transform: 'scale(1.05)',
            width: '235px',
          },
          '100%': {
            transform: 'scale(0.9)',
            width: '235px',
          },
        },
        logoSubtitle: {
          '0%, 80%': {
            transform: 'scale(0)',
            height: '0px',
          },
          '100%': {
            transform: 'scale(1)',
            height: '20px',
            width: '235px',
          },
        },
        loading: {
          '0%, 100%': { width: '0%' },
          '50%': { width: '80%' },
        },
        loader: {
          '0%': { transform: 'translateX(-100%)' },
          // '100%': { transform: 'translateX(100%)' },
        },
        vibrate: {
          '0%, 88%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '90%': { transform: 'translate(-2px, 0) scale(1.04)' },
          '92%': { transform: 'translate(2px, -1px) scale(1.04)' },
          '94%': { transform: 'translate(-2px, 1px) scale(1.04)' },
          '96%': { transform: 'translate(2px, 0) scale(1.04)' },
          '98%': { transform: 'translate(-1px, 0) scale(1.04)' },
        },
      },
      animation: {
        fadein: 'fadein 2.2s ease-in-out forwards',
        logo: 'logo 3.2s 1s ease-in-out forwards',
        logoText: 'logoText 3.2s 1s ease-in-out forwards',
        logoSubtitle: 'logoSubtitle 3.2s 1s ease-in-out forwards',
        loading: 'loading 3s infinite',
        loader: 'loader 2s linear ',
        vibrate: 'vibrate 2.6s ease-in-out infinite',
      },
      screens: {
        'small-mobile': {'max' : '400px'},
        // => @media (min-width: 400px) { ... }
  
        mobile: {'max' : '640px'},
        // => @media (min-width: 640px) { ... }
  
        tablet: {'max' : '800px'},
        // => @media (min-width: 800px) { ... }
  
        laptop: {'max' : '1024px'},
        // => @media (min-width: 1024px) { ... }
  
        desktop: {'max' : '1280px'},
        // => @media (min-width: 1280px) { ... }
  
        'large-desktop': {'max' : '1536px'},
        // => @media (min-width: 1536px) { ... }
        
      },
    },
    
  },
  plugins: [require('tw-elements/dist/plugin')],
};
