import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bit: "Bitblox",
      },
      backgroundColor: {
        nave: "#0b0e16",
        offBlack: "#0F121A",
      },
      colors: {
        ligera: "#fed501",
        nave: "#0b0e16",
        offBlack: "#0F121A",
      },
      fontSize: {
        xxs: "0.6rem",
      },
    },
  },
  plugins: [],
};
export default config;
