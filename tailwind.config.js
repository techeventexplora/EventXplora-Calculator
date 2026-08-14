/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#0B1330",
        paper: "#F4F7FF",
        brand: {
          900: "#0B1E63",
          700: "#1D3FD1",
          600: "#2B4EEA",
          100: "#E3E9FF",
        },
        gold: "#F2A93B",
        rose: "#E1546B",
        muted: "#8A93BF",
        body: "#5B6699",
      },
    },
  },
  plugins: [],
};
