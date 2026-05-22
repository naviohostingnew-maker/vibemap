import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // legacy aliases (kept so CNA boilerplate page does not break)
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Aurora — base
        "cream-base": "#fef5ee",
        // Aurora — gradient mesh blobs
        "mesh-pink": "#ffcfe0",
        "mesh-peach": "#ffd6a8",
        "mesh-lilac": "#d4d6ff",
        // Aurora — ink scale (primary text + CTA fill share #2a1832)
        "ink-cta": "#2a1832",
        "ink-text": "#2a1832",
        ink: {
          DEFAULT: "#2a1832",
          70: "#2a183299",
          50: "#2a183280",
          30: "#2a183240",
        },
        "rose-deep": "#6b2e4d",
        // Aurora — accent gradient stops
        "accent-magenta": "#d4537e",
        "accent-orange": "#ef9f27",
        // Aurora — glass surface fill (tokens §4 split: #b0 decorative / #d0 text-heavy)
        "glass-bg": "#ffffffb0",
        "glass-bg-strong": "#ffffffd0",
      },
      borderRadius: {
        card: "16px",
        portrait: "24px",
        pill: "999px",
        input: "12px",
      },
      fontFamily: {
        // Display = Playfair Display (Instrument Serif lacks Cyrillic — see tokens §2)
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "Manrope", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
