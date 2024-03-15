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
        "pale-blue":"#1fbbf1",
        "base-black":"#222831",
        "nav-green":"#4B5D67",
        "main-nav-grey":"#31363F"
      },
      fontFamily:{
        "barlow":"Barlow",
        "poppins":"Poppins"
      }
    },
  },
  plugins: [],
}

