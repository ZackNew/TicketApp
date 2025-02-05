module.exports = {
  darkMode: "media",
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
          50: "#ecfffe",
          100: "#bdffff",
          200: "#7bfdff",
          300: "#31faff",
          400: "#00fffb",
          500: "#00ede2",
          600: "#00bfbb",
          700: "#009796",
          800: "#007577",
          900: "#005051",
          950: "#003a3d",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
