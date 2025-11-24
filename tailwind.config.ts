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
        sans: ["Mont", "system-ui", "sans-serif"],
      },
      fontWeight: {
        normal: '400', // Mont Regular
        semibold: '600', // Mont SemiBold
        black: '900', // Mont Black
      },
    },
  },
  plugins: [],
};

export default config;

