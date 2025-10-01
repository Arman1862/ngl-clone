import React from 'react';
import { Link } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effect: Blob Neon (Fuchsia/Blue -> Red/Orange) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Main Card: Glassy, Neon-Glow */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-lg shadow-red-500/10 p-8 w-full max-w-sm mx-auto my-8 text-center transition-all duration-500 hover:shadow-red-500/20">
        
        {/* Ikon dan Judul */}
        <PersonCircle className="text-red-400 text-6xl mx-auto mb-4" /> 
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 uppercase tracking-wider">
          YTTA Aja
        </h1>
        <p className="text-md mb-8 text-gray-400">
          Kirim dan terima pesan rahasia tanpa nama.
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col space-y-4">
          
          {/* Tombol Utama (Login) - Gradient Merah-Orange */}
          <Link 
            to="/login" 
            className="w-full px-6 py-3 font-bold rounded-xl 
                       bg-gradient-to-r from-red-600 to-orange-600 
                       text-white 
                       shadow-md shadow-red-500/30 
                       hover:from-red-500 hover:to-orange-500 
                       hover:shadow-lg hover:shadow-red-500/50
                       transition duration-300 transform hover:scale-[1.02] 
                       text-center uppercase tracking-wider"
          >
            Login
          </Link>
          
          {/* Tombol Sekunder (Register) - Neon Outline Merah */}
          <Link 
            to="/register" 
            className="w-full px-6 py-3 font-semibold rounded-xl 
                       bg-transparent 
                       border-2 border-red-500 
                       text-red-400 
                       hover:bg-red-500/10 
                       hover:text-white
                       transition duration-300 transform hover:scale-[1.02]
                       text-center uppercase tracking-wider"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}