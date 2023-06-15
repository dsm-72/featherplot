/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // require("daisyui")
  ],
  // daisyui: {
  //   themes: true,
  //   // themes: ['cupcake', 'aqua'],
  //   lightTheme: 'light',
  //   darkTheme: 'winter', // name of one of the included themes for dark mode
  //   base: true,
  //   styled: true,
  //   utils: true,
  //   rtl: false,     
  //   logs: true,
  // },
}

