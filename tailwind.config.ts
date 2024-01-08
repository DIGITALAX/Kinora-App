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
        vcr: "Vcr",
      },
      backgroundColor: {
        nave: "#0b0e16",
        offBlack: "#0F121A",
      },
      colors: {
        ligera: "#fed501",
        nave: "#0b0e16",
        offBlack: "#0F121A",
        verde: "#7CDD00",
        rojo: "#FE0000",
        azul: "#0097FC",
        girasol: "#FBD201",
        calcetine: "#FBDB86",
        acei: "#819463",
        suave: "#C27AA0",
        cost: "#847FF2",
        gris: "#C2C0B5"
      },
      fontSize: {
        xxs: "0.6rem",
      },
      zIndex: {
        1: "1",
      },
      screens: {
        tablet: "900px",
        galaxy: "300px",
        pre: "400px",
        otro: "1350px",
      },
      backgroundImage: {
        fuzz: 'url("https://thedial.infura-ipfs.io/ipfs/QmcnyZRwBo2yRC8xPuyD2UVEfRGX6JNPX86dT43aPSsy5y")',
      },
    },
  },
  plugins: [],
};
export default config;
