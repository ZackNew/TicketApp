module.exports = {
  darkMode: false,
  safelist: ["dark"],
  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f7f7",
          100: "#c8eaea",
          200: "#99d6d6",
          300: "#66bcbc",
          400: "#339e9e",
          500: "#005051",
          600: "#004647",
          700: "#003b3c",
          800: "#003132",
          900: "#002627",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
