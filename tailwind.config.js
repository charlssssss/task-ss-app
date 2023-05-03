/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'task-ss-dark-blue': {
        100: '#e9e6e6',
        200: '#302f53',
        300: '#040323',
        400: '#050424',
        500: '#090927',
        600: '#000000',
      },
      'task-ss-light-blue': {
        100: '#63dffc',
        200: '#22caf1', 
      },
      'task-ss-white': {
        100: '#ffffff',
        200: '#eeeeee',
        300: '#dedede',
        400: '#777777',
        500: '#333333',

      },
      'task-ss-purple': '#401AE1',
      'task-ss-yellow': '#F5D04F',
      'task-ss-red': {
        100: '#FFC4C4',
        200: '#E44545',
      },
      'task-ss-green': {
        100: '#9DFFB7',
        200: '#058527',
      },
      'task-ss-orange': '#854A05',
      'task-ss-category': {
        100: '#f5774f',
        200: '#4f91f5',
        300: '#4ff5a9',
        400: '#f5dc4f',
        500: '#f5534f',
      },
      'soc-med': {
        'google': '#BBBBBB',
        'facebook': '#3F4E9F',
      },
      'priority': {
        'high': {
          100: '#ffe3e3',
          200: '#E44545',
        },
        'med': {
          100: '#faf4de',
          200: '#F5D04F',
        },
        'low': {
          100: '#ebf3ff',
          200: '#4f91f5',
        },
        'default': {
          100: '#eeeeee',
          200: '#777777',
        }
      }
    },
    extend: {
      fontFamily: {
        'rubik': ['Rubik', 'san-serif'],
      }
    },
  },
  plugins: [],
  safelist: [{
      pattern: /(bg|text|border)-task-ss-category-(100|200|300|400|500)/
    }
  ]
}