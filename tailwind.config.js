/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        silver: "#E8E8ED",
        "apple-gray": "#1D1D1F",
        "apple-blue": "#2997FF",
        "apple-purple": "#BF5AF2",
        iris: "#A855F7",
        cyan: "#22D3EE",
      },
      boxShadow: {
        glow: "0 0 80px rgba(41, 151, 255, 0.15), 0 0 160px rgba(191, 90, 242, 0.1)",
        "glow-lg": "0 0 120px rgba(41, 151, 255, 0.2), 0 0 240px rgba(191, 90, 242, 0.15)",
      },
      fontFamily: {
        display: [
          "Sora",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
        ],
        mono: [
          "Space Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
