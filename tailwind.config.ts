import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",       // Biru Utama
          darkblue: "#1e3a8a",   // Biru Gelap
          orange: "#f97316",     // Orange Utama
          lightorange: "#ffedd5" // Orange Muda
        },
      },
      backgroundImage: {
        'gradient-milenial': 'linear-gradient(135deg, #2563eb 0%, #f97316 100%)',
        'gradient-soft': 'linear-gradient(to right, #eff6ff, #fff7ed)',
      }
    },
  },
  plugins: [],
};
export default config;