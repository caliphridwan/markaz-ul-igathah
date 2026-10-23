import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#0A1F1A", soft: "#2A3B35", muted: "#5E6B65" },
        emerald: { DEFAULT: "#0F4C3A", 700: "#0B3A2C", 800: "#082C21", 900: "#06201A" },
        jade: { DEFAULT: "#1F7A5C", light: "#2E9C77" },
        gold: { DEFAULT: "#C9A24B", light: "#E6CF8F", dark: "#A6823A" },
        parchment: "#F7F1E3",
        ivory: "#FBF8F1",
        sand: { DEFAULT: "#E9DFC8", dark: "#D8CAA8" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
        ruqaa: ["var(--font-ruqaa)", "var(--font-arabic)", "serif"],
      },
      borderRadius: { arch: "999px 999px 0 0" },
      boxShadow: {
        card: "0 1px 0 rgba(10,31,26,.04), 0 12px 32px -12px rgba(10,31,26,.18)",
        lift: "0 2px 0 rgba(10,31,26,.04), 0 24px 48px -16px rgba(10,31,26,.28)",
      },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        rise: "rise .8s cubic-bezier(.2,.7,.2,1) both",
        "spin-slow": "spin-slow 120s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
