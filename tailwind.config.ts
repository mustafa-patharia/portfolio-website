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
