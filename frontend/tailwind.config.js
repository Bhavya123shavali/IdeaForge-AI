/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Muted, sophisticated palette
        ink: "#2d3436",
        sand: "#f0ece3",
        coral: "#c4796b",
        moss: "#6b8f71",
        cream: "#faf8f5",
        slategreen: "#7fa085",
        // Warm neutrals
        stone: {
          warm: "#e8e2d9",
          cool: "#d5cfc5",
        },
        // Muted accents
        terracotta: "#c4796b",
        sage: "#8faa91",
        dusty: {
          rose: "#c9a0a0",
          blue: "#8fa3b8",
          mauve: "#a893a8",
        },
        // Dark mode muted palette
        night: {
          DEFAULT: "#14191f",
          surface: "#1c232d",
          card: "#232b38",
          border: "rgba(255,255,255,0.06)",
        },
        aurora: {
          pink: "#c9a0a0",
          purple: "#9b8ec4",
          blue: "#7ea1c4",
          cyan: "#7ebcb5",
          green: "#8faa91",
        }
      },
      boxShadow: {
        panel: "0 8px 40px rgba(45, 52, 54, 0.06)",
        "panel-lg": "0 16px 60px rgba(45, 52, 54, 0.08)",
        "glow-soft": "0 0 30px rgba(196, 121, 107, 0.12)",
        "glow-moss": "0 0 30px rgba(107, 143, 113, 0.12)",
        "dark-panel": "0 8px 40px rgba(0, 0, 0, 0.25)",
        "dark-glow": "0 0 40px rgba(155, 142, 196, 0.1)",
      },
      fontFamily: {
        display: ["Outfit", "Georgia", "serif"],
        sans: ["Inter", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"]
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at 20% 15%, rgba(196,121,107,0.08), transparent 40%), radial-gradient(circle at 80% 5%, rgba(107,143,113,0.08), transparent 35%), linear-gradient(160deg, #faf8f5 0%, #f0ece3 50%, #e8e2d9 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        }
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};
