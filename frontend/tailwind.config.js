/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        soc: {
          background: "#0B1220",
          card: "#111827",
          border: "#1F2937",
          primary: "#00E5FF",
          danger: "#EF4444",
          warning: "#FACC15",
          success: "#22C55E",
        },
      },
      boxShadow: {
        soc: "0 24px 60px rgba(0,0,0,.32)",
        "cyan-glow": "0 0 25px rgba(0, 229, 255, 0.15)",
        "red-glow": "0 0 25px rgba(239, 68, 68, 0.12)",
        "amber-glow": "0 0 25px rgba(245, 158, 11, 0.12)",
      },
    },
  },
  plugins: [],
}