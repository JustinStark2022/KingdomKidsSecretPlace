import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        brand: {
          blue: "#0074c7",
          yellow: "#ffdc0e",
          white: "#ffffff",
        },
        background: "#0074c7",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#0074c7",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ffdc0e",
          foreground: "#0f172a",
        },
        muted: {
          DEFAULT: "#e2e8f0",
          foreground: "#334155",
        },
        accent: {
          DEFAULT: "#ffdc0e",
          foreground: "#1e293b",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        border: "#cbd5e1",
        input: "#f1f5f9",
        ring: "#0074c7",
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
          primary: "#0074c7",
          "primary-foreground": "#ffffff",
          accent: "#ffdc0e",
          "accent-foreground": "#1e1e1e",
          border: "#e2e8f0",
          ring: "#0074c7",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;