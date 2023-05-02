import { type Config } from "tailwindcss";

export default {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      colors: {
        'black': '#000000',
        'white': '#ffffff',
        'ivtcolor': '#02B5A5',
        'hover': '#35928C',
        'ivtcolor2': '#285966',
        'ivtcolor2hover': '#2D6B77',
        'xhover': '#3B3B3B',
      },
    },
    variants: {
      extend: {},
    }
  },
  plugins: [],
} satisfies Config;
