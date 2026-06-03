/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure monochrome palette
        surface:  "#0a0a0a",
        "surface-2": "#111111",
        "surface-3": "#1a1a1a",
        border:   "rgba(255,255,255,0.08)",
        "border-strong": "rgba(255,255,255,0.16)",
      },
      fontFamily: {
        sans:    ["Google Sans", "Product Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Google Sans", "Product Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease-out both",
        "slide-up": "slideUp 0.4s ease-out both",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        float: { 
          "0%, 100%": { transform: "translateY(0)" }, 
          "50%": { transform: "translateY(-20px)" } 
        },
      },
    },
  },
  plugins: [],
};
