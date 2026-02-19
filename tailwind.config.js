/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D12",
        paper: "#EEF2FF",
        fog: "#A7B0C6",
        electric: "#2D6BFF",
        hot: "#FF3B3B",
        graphite: "#11151F",
      },
      boxShadow: {
        insetHairline: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

