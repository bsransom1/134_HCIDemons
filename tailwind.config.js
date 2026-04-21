/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        uci: {
          blue: "#0064A4",
          gold: "#FFD200",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Lora", "Georgia", "serif"],
      },
      maxWidth: {
        mobile: "430px",
      },
    },
  },
  plugins: [],
};
