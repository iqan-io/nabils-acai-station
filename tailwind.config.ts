import type { Config } from "tailwindcss";
import relumePreset from "@relume_io/relume-tailwind";

const config: Config = {
  presets: [relumePreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          acai: "#3B1440",
          "acai-deep": "#160B18",
          "acai-light": "#63305F",
          lavender: "#D9C9D6",
          cream: "#F5ECDF",
          "cream-warm": "#EADCCD",
          honey: "#D9A441",
          saffron: "#F2C879",
          pistachio: "#97A96A",
          strawberry: "#C43B4E",
          cedar: "#667849",
        },
        background: {
          primary: "#F5ECDF",
          secondary: "#EADCCD",
          alternative: "#160B18",
        },
        border: {
          primary: "#3B1440",
          secondary: "#63305F",
          alternative: "#F5ECDF",
        },
        text: {
          primary: "#160B18",
          alternative: "#F5ECDF",
        },
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Georgia",
          "system-ui",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Segoe UI",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "sunburst-cream":
          "repeating-conic-gradient(from 0deg at 50% 100%, rgba(61,23,71,0.04) 0deg, rgba(61,23,71,0.04) 6deg, transparent 6deg, transparent 12deg)",
        "sunburst-acai":
          "repeating-conic-gradient(from 0deg at 50% 100%, rgba(251,245,236,0.07) 0deg, rgba(251,245,236,0.07) 6deg, transparent 6deg, transparent 12deg)",
        "paper-grain":
          "radial-gradient(rgba(31,11,37,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: "3px 3px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "rise-in": "rise-in 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "fade-in": "fade-in 0.9s ease-out both",
        "spin-slow": "spin-slow 60s linear infinite",
      },
    },
  },
};

export default config;
