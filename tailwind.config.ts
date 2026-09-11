import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  // `shared/` builds class strings for the reveal card, so it must be scanned
  // too or those utilities are never emitted and the logo renders unbounded.
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        /** 13.3" Mac default (1440×900). Phones are excluded so home hero spacing stays intact. */
        "h-short": { raw: "(min-width: 768px) and (max-height: 900px)" },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        /** passwords.lu / Rams palette — partner chrome & shared branding */
        rams: {
          green: "#15803D",
          orange: "#FF6B35",
          red: "#DC2626",
          offWhite: "#F5F5F4",
          graphite: "#1C1C1C",
          concrete: "#999A94",
          olive: "#66735C",
          beige: "#D6CBB7",
          steel: "#D8D8D8",
          signal: "#C0392B",
          success: "#4CAF50",
          darkBg: "#171717",
          white: "#FFFFFF",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        /** Synapse-style pulse for on-device AI "thinking" affordance */
        "neuron-pulse": {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.65)" },
          "35%": { opacity: "1", transform: "scale(1.25)" },
          "55%": { opacity: "0.55", transform: "scale(0.95)" },
          "70%": { opacity: "0.2", transform: "scale(0.75)" },
        },
        "brain-think": {
          "0%, 100%": { opacity: "0.82", filter: "brightness(0.95)" },
          "45%": { opacity: "1", filter: "brightness(1.08)" },
        },
        /** Hand-writing motion for streaming / "Writing…" phase */
        "pencil-write": {
          "0%, 100%": { transform: "rotate(-12deg) translate(0, 0)" },
          "22%": { transform: "rotate(7deg) translate(3px, -2px)" },
          "45%": { transform: "rotate(-5deg) translate(-2px, 2px)" },
          "68%": { transform: "rotate(9deg) translate(2px, 1px)" },
          "85%": { transform: "rotate(-4deg) translate(-1px, -1px)" },
        },
        /** Gravity drop zone — expanding ripple ring */
        "gravity-ring": {
          "0%": { opacity: "0.55", transform: "translate(-50%, -50%) scale(0.2)" },
          "70%": { opacity: "0.15" },
          "100%": { opacity: "0", transform: "translate(-50%, -50%) scale(1)" },
        },
        /** Gravity drop zone — concentric static ring breathe */
        "ring-breathe": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.22s cubic-bezier(0.16,1,0.3,1)",
        "accordion-up": "accordion-up 0.18s cubic-bezier(0.16,1,0.3,1)",
        "neuron-pulse": "neuron-pulse 2.8s ease-in-out infinite",
        "brain-think": "brain-think 2.8s ease-in-out infinite",
        "pencil-write": "pencil-write 1.15s ease-in-out infinite",
        "gravity-ring": "gravity-ring 2.4s ease-out forwards",
        "ring-breathe": "ring-breathe 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
