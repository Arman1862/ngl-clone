import React from 'react';
import { Link } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons'; 

export default function Home() {
  return (
    // Body: Background lebih gelap (bg-gray-950) dengan gradient radial
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effect: Blob Neon */}{/* Pastikan CSS di atas sudah diterapkan */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Main Card: Glassy, Neon-Glow, dan Lebih Berkelas */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-fuchsia-500/30 rounded-3xl shadow-lg shadow-fuchsia-500/10 p-8 w-full max-w-sm mx-auto my-8 text-center transition-all duration-500 hover:shadow-fuchsia-500/20">
        
        {/* Ikon dan Judul */}
        <PersonCircle className="text-fuchsia-400 text-6xl mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400 uppercase tracking-widest">
          YTTA aja
        </h1>
        <p className="text-md mb-8 text-gray-400">
          Kirim dan terima pesan rahasia tanpa nama.
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col space-y-4">
          
          {/* Tombol Utama (Login) - Gradient untuk kesan Power */}
          <Link 
            to="/login" 
            className="w-full px-6 py-3 font-bold rounded-xl 
                       bg-gradient-to-r from-blue-600 to-fuchsia-600 
                       text-white 
                       shadow-md shadow-blue-500/30 
                       hover:from-blue-500 hover:to-fuchsia-500 
                       hover:shadow-lg hover:shadow-blue-500/50
                       transition duration-300 transform hover:scale-[1.02] 
                       text-center uppercase tracking-wider"
          >
            Login
          </Link>
          
          {/* Tombol Sekunder (Register) - Neon Outline */}
          <Link 
            to="/register" 
            className="w-full px-6 py-3 font-semibold rounded-xl 
                       bg-transparent 
                       border-2 border-fuchsia-500 
                       text-fuchsia-400 
                       hover:bg-fuchsia-500/10 
                       hover:text-white
                       transition duration-300 text-center uppercase tracking-wider"
          >
            Register Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}