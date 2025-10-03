// Footer.jsx

import React from 'react';

export default function Footer() {
  return (
    // FIX: Terapkan style Glassy/Neon yang konsisten dengan Main Card:
    // Gunakan bg-white/5 dan backdrop-blur-md untuk efek kaca
    // Gunakan border-t dengan warna Merah Neon (red-500/30)
    <footer className="w-full text-center p-4 text-orange-400 text-sm bg-gray-950 backdrop-blur-md ">
      <p>
        Created by: 
        <a 
          href="https://www.instagram.com/cyvix4102/" 
          target="_blank" 
          rel="noopener noreferrer" 
          // Link style: Pakai red-neon (merah) dan hover orange-cyber (jingga)
          className="font-bold from-red-400 to-orange-400 hover:text-orange-cyber transition duration-200 mx-1"
        >
          @cyvix4102
        </a> 
        <span className="text-orange-400">|</span> 
        <a 
          href="https://www.instagram.com/calx4102" 
          target="_blank" 
          rel="noopener noreferrer" 
          // Link style: Pakai red-neon (merah) dan hover orange-cyber (jingga)
          className="font-bold text-red-neon hover:text-orange-cyber transition duration-200 ml-1"
        >
          @calx4102
        </a>
      </p>
    </footer>
  );
}