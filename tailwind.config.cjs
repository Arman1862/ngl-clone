// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-indigo': '#0D0E25', // Background utama
        'violet-neon': '#7E22CE', // Warna utama tombol/aksen (Ungu)
        'blue-cyber': '#3B82F6', // Warna sekunder tombol/border (Biru)
        'glass-border-blue': '#60A5FA', // Border untuk efek glass
        // Warna-warna ini disesuaikan dari Home.jsx sebelumnya
        'deep-orange': '#1A0E0B',
        'orange-primary': '#DD6B20',
        'orange-neon': '#F97316',
        'amber-glow': '#FBBF24',
        'glass-border-orange': '#F59E0B',
      },
      boxShadow: {
        'neon-blue': '0 0 10px #3B82F6, 0 0 20px #3B82F6',
        'neon-violet': '0 0 10px #7E22CE, 0 0 20px #7E22CE',
      }
    },
  },
  plugins: [],
}