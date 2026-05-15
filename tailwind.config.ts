import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: "#2F5D50",
        cream: "#F4EFE6",
        gold: "#D9A441",
        earth: "#B97A4B",
        ink: "#1F2937",
        mist: "#6B7280",
        paper: "#FAFAF7"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(31, 41, 55, 0.10)",
        card: "0 18px 45px rgba(47, 93, 80, 0.12)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
