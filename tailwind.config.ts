import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Основний шрифт для тексту — Unbounded (через CSS-змінну), з системним fallback
        sans: ["var(--font-unbounded)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        semibold: "600",
        black: "900",
      },
      colors: {
        // Брендова палітра
        brand: {
          DEFAULT: "#006D77", // Бірюза (основний)
          gray: "#EAEAEA", // Додатковий сірий
          light: "#EBFDFB", // Світла бірюза
          dark: "#0E172A", // Темно-синій
          white: "#FFFFFF", // Білий
        },
      },
    },
  },
  plugins: [],
};

export default config;

