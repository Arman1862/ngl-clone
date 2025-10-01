import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import TampilPesanAnonim from './TampilPesanAnonim';
import { Mailbox2, Clipboard, X } from 'react-bootstrap-icons';

// --- Komponen Modal Blur Pesan ---
const MessageModal = ({ pesan, onClose }) => {
  // Tambahkan state isVisible untuk mengontrol transisi
  const [isVisible, setIsVisible] = useState(false);

  // Efek untuk mengontrol animasi saat pesan berubah (dibuka atau ditutup)
  useEffect(() => {
    if (pesan) {
      // Jika ada pesan, atur isVisible ke true setelah delay sebentar
      // agar ada waktu untuk komponen di-render sebelum transisi dimulai
      const timeout = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timeout);
    } else {
      // Jika tidak ada pesan (ditutup), atur isVisible ke false
      setIsVisible(false);
    }
  }, [pesan]);
  
  // Jika tidak ada pesan dan isVisible sudah false, jangan render apa-apa
  if (!pesan && !isVisible) return null;

  const handleClose = () => {
      // PENTING: Matikan isVisible dulu untuk menjalankan animasi 'fade out'
      setIsVisible(false);
      // Panggil onClose setelah animasi selesai (300ms sesuai durasi transisi)
      setTimeout(onClose, 300); 
  }


  return (
    // Overlay fixed, dark transparent, dan BLUR di belakangnya
    // Transisi opacity di sini untuk efek fade overlay
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      // Menutup modal jika klik di luar box pesan
      onClick={handleClose}
    >
      
      {/* Message Card: Glassy/Neon Style, lebih fokus dan keren */}
      <div 
        // Hentikan propagasi klik agar klik di dalam modal tidak menutup modal
        onClick={(e) => e.stopPropagation()} 
        className={`bg-white/10 backdrop-blur-xl border border-fuchsia-500/30 rounded-3xl shadow-lg shadow-fuchsia-500/20 p-8 w-full max-w-sm mx-auto relative 
                  transition-all duration-300 ease-out 
                  ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} // <-- ANIMASI SCALE-UP/FADE-IN DI SINI
      >
        
        {/* Tombol Close */}
        <X 
          className="absolute top-4 right-4 text-white text-3xl cursor-pointer hover:text-fuchsia-400 transition-colors"
          onClick={handleClose} // <-- Gunakan handleClose yang baru
        />

        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-fuchsia-400 text-center">Isi Pesan Rahasia</h2>
        
        {/* Box Pesan */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-xl text-white font-semibold break-words whitespace-pre-wrap">
            {pesan.Pesan}
          </p>
        </div>

        {/* Footer/Meta */}
        <small className="block mt-4 text-center text-gray-400 text-xs">
            Dikirim oleh **{pesan.Pengirim}** pada {new Date(pesan.Tanggal).toLocaleString()}
        </small>
        
      </div>
    </div>
  );
};
// --- Akhir Komponen Modal Blur Pesan ---


export default function Dashboard() {
  const [userAuth, setUserAuth] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedPesan, setSelectedPesan] = useState(null); // State baru untuk pesan yang difokuskan
  const navigate = useNavigate();

  // ... (useEffect dan fungsi handleCopyLink, handleLogout tetap sama)
  useEffect(() => {
    const storedData = localStorage.getItem('userAuth');
    if (storedData) {
      setUserAuth(JSON.parse(storedData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Handler untuk mengaktifkan mode fokus
  const handleSelectPesan = (pesan) => {
    setSelectedPesan(pesan);
  };
  
  // Handler untuk menutup mode fokus
  const handleCloseFocus = () => {
    setSelectedPesan(null);
  };
  
  const handleCopyLink = () => {
    if (userAuth && userAuth.userId) {
      const shareLink = `${window.location.origin}/send/${userAuth.userId}`; 
      navigator.clipboard.writeText(shareLink).then(() => {
        Swal.fire({
          title: 'Link Berhasil Disalin!',
          text: `Bagikan link: ${shareLink}`,
          icon: 'success',
          timer: 2500,
          showConfirmButton: false,
          customClass: {
            popup: 'text-white bg-slate-800 rounded-xl',
          }
        });
      }).catch(err => {
        console.error('Failed to copy:', err);
        Swal.fire('Oops!', 'Gagal menyalin link.', 'error');
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
  };

  if (!userAuth) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  const shareLink = `${window.location.origin}/send/${userAuth.userId}`;
  // ... (End of unchanged functions)

  return (
    // Dashboard Utama
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effect: Blob Neon */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* MAIN CARD: Glassy Style */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-lg shadow-blue-500/10 p-8 w-full max-w-sm sm:max-w-md mx-auto my-8 text-center transition-all duration-500 hover:shadow-blue-500/20">
        
        {/* Header Dashboard */}
        <Mailbox2 className="text-blue-400 text-5xl mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400 uppercase tracking-wider">
          Halo, {userAuth.namaTampilan}!
        </h1>
        <p className="text-md mb-6 text-gray-400">
          Cek pesan anonim dan bagikan linkmu.
        </p>

        {/* 1. CARD SHARE YOUR LINK */}
        <div className="bg-white/10 backdrop-blur-md border border-fuchsia-500/30 rounded-xl shadow-lg shadow-fuchsia-500/10 p-4 mb-6 text-left transition-all duration-300 hover:shadow-fuchsia-500/20">
          <h2 className="text-xl font-semibold mb-3 text-fuchsia-400">Bagikan Linkmu</h2>
          <p className="text-gray-300 text-sm mb-3">Salin dan sebar link rahasia di bawah ini:</p>
          <div className="flex flex-col sm:flex-row items-stretch space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="w-full px-3 py-2 border rounded-lg bg-white/5 border-fuchsia-500/20 text-white placeholder-gray-400 text-sm flex-grow focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-4 py-2 font-semibold rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 transition duration-300 flex items-center justify-center text-sm"
            >
              <Clipboard className="mr-2 text-lg" />
              Copy
            </button>
          </div>
        </div>

        {/* 2. DAFTAR PESAN (TampilPesanAnonim) */}
        <div className="text-left mb-6">
             <h2 className="text-xl font-semibold mb-3 text-blue-400">Kotak Masuk Anonim</h2>
             <TampilPesanAnonim 
                 refreshTrigger={refreshTrigger} 
                 onSelectPesan={handleSelectPesan} 
             />
        </div>
       
        {/* Tombol Logout */}
        <div className="text-center mt-6">
            <Link 
                to="/login" 
                onClick={handleLogout}
                className="text-sm text-slate-400 hover:text-fuchsia-400 font-semibold transition-colors"
            >
                Logout
            </Link>
        </div>
      </div>
      
      {/* RENDER MODAL BLUR JIKA ADA PESAN YANG DIPILIH */}
      <MessageModal pesan={selectedPesan} onClose={handleCloseFocus} />

    </div>
  );
}