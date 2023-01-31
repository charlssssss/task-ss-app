/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
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
      },
      'task-ss-light-blue': {
        100: '#63dffc',
        200: '#22caf1', 
      },
      'task-ss-white': {
        100: '#ffffff',
        200: '#eeeeee',
        300: '#dedede',

      },
      'task-ss-purple': '#040323',
      'task-ss-red': '#e4545',
      'task-ss-category': {
        100: '#f5774f',
        200: '#4f91f5',
        300: '#4ff5a9',
        400: '#f5dc4f',
        500: '#f5534f',
      }
    },
    extend: {},
  },
  plugins: [],
  safelist: [{
      pattern: /(bg|text|border)-task-ss-category-(100|200|300|400|500)/
    }
  ]
}