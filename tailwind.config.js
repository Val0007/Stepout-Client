/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'base-blue':"#2ea1e3",
        "sec-blue":"#24d9f9",
        "pale-blue":"#1fbbf1"
      }
    },
  },
  plugins: [],
}

