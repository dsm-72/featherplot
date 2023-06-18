/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      aspectRatio: {
        '16/9': [16, 9],
        '12/8': [12, 8],
        '4/3': [4, 3],
      },
      zIndex: {
        '500': '500',
        '1000': '1000',
        '5000': '5000',
      },
      variants: {
        aspectRatio: ['responsive', 'hover']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require("daisyui")
  ],
  daisyui: {
    themes: true,
    // themes: ['cupcake', 'aqua'],
    lightTheme: 'light',
    darkTheme: 'winter', // name of one of the included themes for dark mode
    base: true,
    styled: true,
    utils: true,
    rtl: false,     
    logs: true,
  },
}

