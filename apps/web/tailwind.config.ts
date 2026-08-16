import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#059669",
          "green-hover": "#047857",
          "green-light": "#ecfdf5",
          yellow: "#f59e0b",
          "yellow-light": "#fefce8",
          dark: "#0f172a",
        },
        pastel: {
          yellow: "#fef9c3",
          "yellow-deep": "#fef08a",
          green: "#dcfce7",
          "green-deep": "#bbf7d0",
          blue: "#e0f2fe",
          "blue-deep": "#bae6fd",
          peach: "#ffedd5",
          "peach-deep": "#fed7aa",
          purple: "#f3e8ff",
          "purple-deep": "#e9d5ff",
          pink: "#fce7f3",
          "pink-deep": "#fbcfe8",
          mint: "#ccfbf1",
          cream: "#fffbeb",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
