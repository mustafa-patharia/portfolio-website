import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        "text-primary": "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        stroke: "hsl(var(--stroke))",
        accent: "hsl(var(--accent))",
        /* SmartScan brand blue (#026bc0) — scale lifted for dark surfaces */
        ss: {
          100: "#dbeeff",
          200: "#b8e2ff",
          300: "#6dc2ff",
          400: "#4ca2fb",
          500: "#3189e0",
          600: "#026bc0",
        },
        /* Odoo brand purple (#714B67) — scale lifted for dark surfaces */
        odoo: {
          100: "#f4ecf2",
          200: "#e5d0df",
          300: "#c9a3bf",
          400: "#a67a9a",
          500: "#8c6181",
          600: "#714b67",
          grey: "#8f8f8f",
        },
        /* Odoo brand teal (#017E84) — used for "posted to NetSuite" states */
        oteal: {
          200: "#a3e2e5",
          300: "#52c4ca",
          400: "#1ea4ab",
          500: "#017e84",
        },
        /* Infithra brand purple (#482084 buttons, #361863 headings, #170c34 nav ink) — 100–400 lifted for dark surfaces */
        inf: {
          100: "#eee8f8",
          200: "#d6c9ef",
          300: "#b39ce2",
          400: "#8d6dcf",
          500: "#6a45ab",
          600: "#482084",
          700: "#361863",
          800: "#241042",
          900: "#170c34",
        },
        /* Infithra brand pink (#fc1777 CTAs/tags) and the other logo-gradient stops */
        ipink: {
          200: "#fec2dc",
          300: "#fe7fb5",
          400: "#fd4a94",
          500: "#fc1777",
        },
        iblue: "#3a86ff",
        iorange: "#ff8001",
        /* Promax Global brand green (--color-brand #3aa328) — tokens from the site's own @theme; 200 is its mask-number highlight */
        pg: {
          100: "#ecf7ea",
          200: "#a8e6a0",
          500: "#3aa328",
          600: "#2f8a21",
          700: "#256d1a",
        },
        /* Promax Global navy family (--color-navy*) */
        pnavy: {
          500: "#3a6aa0",
          600: "#234b74",
          700: "#1a3a5c",
          800: "#16324f",
          900: "#12293f",
        },
        /* Promax Global gold foil (--color-gold*) — investor-facing accent */
        pgold: {
          300: "#e8ce7a",
          500: "#d4af37",
          600: "#a9871f",
        },
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      keyframes: {
        "scroll-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
        "role-fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "scroll-down": "scroll-down 1.5s ease-in-out infinite",
        "role-fade-in": "role-fade-in 0.4s ease-out",
        "gradient-shift": "gradient-shift 6s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
