import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0a0a0f",
        panel: "#12121a",
        border: "#1e1e2e",
        accent: "#6366f1",
        "accent-hover": "#818cf8",
        match: "#22d3ee",
        "match-bg": "rgba(34, 211, 238, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
