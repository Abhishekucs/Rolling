import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    letterSpacing: {
      tight: "-0.025em",
      wider: "0.05em",
      widest: "0.25em",
    },
    extend: {
      lineHeight: {
        "1": "0.5rem",
        "2": "0.8rem",
      },
      colors: {
        "brown-100": "#ADACA3",
        "brown-200": "#D7CDB9",
        "brown-300": "#3A3328",
        "brown-400": "#22201C",
        "brown-500": "#1C1A17",
      },
      fontFamily: {
        serif: ["Causten", "Arial", "Helvetica", "sans-serif"],
        sans: [
          "Causten",
          "-apple-system",
          "BlinkMacSystemFont",
          "avenir next",
          "avenir",
          "segoe ui",
          "helvetica neue",
          "helvetica",
          "Ubuntu",
          "roboto",
          "noto",
          "arial",
          "sans-serif",
        ],
      },
      animation: {
        "spin-circle": "spin 700ms ease-in-out ",
      },
      keyframes: {
        spin: {
          "0%, 100%": { transform: "rotate-[360deg]" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
