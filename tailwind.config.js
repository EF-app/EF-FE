/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9686BF", // EF 포인트 컬러
        bgGray: "#F5F3F1", // EF 배경 컬러
      },
    },
  },
  plugins: [],
};
