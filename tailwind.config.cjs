/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-indigo": "#0A0A0A",
        "red-neon": "#FF3366",
        "orange-cyber": "#FF9933",
        "glass-border-main": "#F87171",

        "deep-orange": "#1A0E0B",
        "orange-primary": "#DD6B20",
        "orange-neon": "#F97316",
        "amber-glow": "#FBBF24",
        "glass-border-orange": "#F59E0B",
      },
      boxShadow: {
        "neon-red": "0 0 10px #FF3366, 0 0 20px #FF3366",
        "neon-orange": "0 0 10px #FF9933, 0 0 20px #FF9933",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
      },
      animation: {
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [],
};
