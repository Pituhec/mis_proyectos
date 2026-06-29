import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./frontend/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexa: {
          50:  "#eef2ff",
          100: "#d8e0fd",
          200: "#b8c6fb",
          400: "#7b93fa",
          500: "#4f6ef7",
          600: "#3a56e8",
          700: "#2a3fcc",
          900: "#1a2480",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
