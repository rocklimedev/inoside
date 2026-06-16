/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./public/index.html",
  ],

  theme: {
    extend: {
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
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        brand: {
          orange: "#dc2626",
          amber: "#f59e0b",
          slate: "#0f172a",
          surface: "#f8fafc",
        },
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.06)",
        glow: "0 0 0 1px rgba(220,38,38,0.15), 0 8px 30px rgba(220,38,38,0.12)",
      },

      backdropBlur: {
        xs: "2px",
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

        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        slideInRight: {
          from: {
            opacity: "0",
            transform: "translateX(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        subtlePulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: ".7",
          },
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        fadeInUp: "fadeInUp 0.5s ease-out",
        fadeIn: "fadeIn 0.4s ease-out",
        slideInRight: "slideInRight 0.4s ease-out",
        subtlePulse: "subtlePulse 2.5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
