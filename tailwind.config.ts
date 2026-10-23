import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#1E140E", soft: "#3B2E26", muted: "#6E6058" },
        walnut: { DEFAULT: "#4A2C1A", 700: "#3A2214", 800: "#2E1B10", 900: "#24150C" },
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
        card: "0 1px 0 rgba(36,21,12,.05), 0 12px 32px -12px rgba(36,21,12,.22)",
        lift: "0 2px 0 rgba(36,21,12,.05), 0 24px 48px -16px rgba(36,21,12,.32)",
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
