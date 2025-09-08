import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#1E40AF",
        accent: "#FBBF24",
        background: "#F3F4F6",
        text: "#111827",
        border: "#E5E7EB",
      },
      fontFamily: {
        primary: ["var(--font-manrope)"],
      },
    },
  },
  plugins: [],
};
export default config;
