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
    // Backdrop: Transparan dengan blur
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      {/* Modal Card: Border Merah, Shadow Merah */}
      <div 
        className={`bg-white/10 border border-red-500/30 rounded-2xl shadow-xl shadow-red-500/20 p-6 w-full max-w-sm transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-90'}`}
        onClick={e => e.stopPropagation()} // Mencegah klik di dalam card menutup modal
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
            Pesan Rahasia #{pesan.nomorPesan}
          </h3>
          <button onClick={handleClose} className="text-red-400 hover:text-white transition-colors">
            <X className="text-2xl" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6 whitespace-pre-wrap">{pesan.Pesan}</p>

        <div className="text-sm text-gray-400 border-t border-red-500/30 pt-4">
          <p>Dari: <span className="font-semibold text-orange-400">{pesan.Pengirim}</span></p>
          <p>Dikirim: {new Date(pesan.Tanggal).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
// --- Akhir Komponen Modal Blur Pesan ---


export default function Dashboard() {
  const [userAuth, setUserAuth] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [selectedPesan, setSelectedPesan] = useState(null); // State untuk modal
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('userAuth');
    if (storedData) {
      setUserAuth(JSON.parse(storedData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleCopyLink = () => {
    if (userAuth && userAuth.userId) {
      const shareLink = `${window.location.origin}/send/${userAuth.userId}`; 
      navigator.clipboard.writeText(shareLink).then(() => {
        // Swal sudah menggunakan customClass di Register/Login, jadi kita pastikan sama.
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
        Swal.fire('Oops!', 'Failed to copy the link.', 'error');
      });
    }
  };

  const handleSelectPesan = (pesan) => {
    setSelectedPesan(pesan);
  };
  
  const handleCloseModal = () => {
    setSelectedPesan(null);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userAuth');
  };


  if (!userAuth) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p>Loading...</p></div>;
  }

  const shareLink = `${window.location.origin}/send/${userAuth.userId}`;

  return (
    // Body: Background gelap
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effect: Blob Neon (Ubah ke Red/Orange) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-lg shadow-red-500/10 p-8 w-full max-w-lg mx-auto my-8 transition-all duration-500 hover:shadow-red-500/20">
        
        {/* Header */}
        <Mailbox2 className="text-orange-400 text-5xl mx-auto mb-4" /> 
        <h1 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 uppercase tracking-wider">
          Halo, {userAuth.namaTampilan}!
        </h1>
        
        {/* 1. SHARE LINK CARD - Border Merah/Orange */}
        <div className="bg-white/5 border border-orange-500/20 rounded-xl shadow-lg p-5 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-red-400">Bagikan Link Rahasiamu</h2>
          <p className="text-slate-300 mb-4 text-sm">Orang lain bisa kirim pesan anonim lewat link ini:</p>
          <div className="flex flex-col sm:flex-row items-stretch space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              readOnly
              value={shareLink}
              // Style input agar sama dengan di Register/Login
              className="w-full px-3 py-2 border rounded-lg bg-white/5 border-red-500/20 text-white placeholder-gray-400 text-sm flex-grow focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            />
            <button
              onClick={handleCopyLink}
              // Style tombol Copy (Gradient Merah-Orange)
              className="w-full sm:w-auto px-4 py-2 font-semibold rounded-lg 
                         bg-gradient-to-r from-red-600 to-orange-600 
                         text-white 
                         shadow-md shadow-red-500/30 
                         hover:from-red-500 hover:to-orange-500 
                         transition duration-300 flex items-center justify-center text-sm"
            >
              <Clipboard className="mr-2 text-lg" />
              Copy Link
            </button>
          </div>
        </div>

        {/* 2. DAFTAR PESAN (TampilPesanAnonim) - Header Merah */}
        <div className="text-left mb-6">
             <h2 className="text-xl font-semibold mb-3 text-red-400">Kotak Masuk Anonim</h2>
             <TampilPesanAnonim 
                 refreshTrigger={refreshTrigger} 
                 onSelectPesan={handleSelectPesan} 
             />
        </div>
       
        {/* Tombol Logout - Teks Merah/Orange */}
        <div className="text-center mt-6">
            <Link 
                to="/login" 
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-400 font-semibold transition-colors"
            >
                Logout
            </Link>
        </div>
      </div>
      
      {/* Panggil Modal */}
      <MessageModal pesan={selectedPesan} onClose={handleCloseModal} />

    </div>
  );
}