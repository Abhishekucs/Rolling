import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brown-100": "#ADACA3",
        "brown-200": "#D7CDB9",
        "brown-300": "#3A3328",
        "brown-400": "#22201C",
        "brown-500": "#1C1A17",
      },
      fontFamily: {
        "causten-bold": ["Causten-Bold"],
        "causten-semibold": ["Causten-Semibold"],
        "causten-medium": ["Causten-Medium"],
        "causten-regular": ["Causten-Regular"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
