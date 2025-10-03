import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import TampilPesanAnonim from './TampilPesanAnonim';
import { Mailbox2, Clipboard, X } from 'react-bootstrap-icons';

const MessageModal = ({ pesan, nomorPesan, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (pesan) {
      const timeout = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [pesan]);
  
  if (!pesan && !isVisible) return null;

  const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 300);
  };

  const formattedDate = pesan ? new Date(pesan.Tanggal).toLocaleString() : '';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 
                 ${isVisible ? 'opacity-100 backdrop-blur-sm bg-black/70' : 'opacity-0 pointer-events-none bg-black/0'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white/10 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-lg shadow-red-500/20 p-6 w-full max-w-sm mx-auto transition-all duration-300 
                    ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-red-neon">
            Pesan Rahasia #{nomorPesan || '#'} 
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-red-400 transition">
            <X className="text-2xl" />
          </button>
        </div>
        
        <p className="text-white text-base mb-4 whitespace-pre-wrap">{pesan.Pesan}</p>

        <div className="text-xs border-t border-red-500/30 pt-3 text-gray-400">
            <p className="font-semibold text-orange-300">Pengirim: {pesan.Pengirim}</p>
            <p>Tanggal: {formattedDate}</p>
        </div>
      </div>
    </div>
  );
};


export default function Dashboard() {
  const [userAuth, setUserAuth] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [selectedMessageData, setSelectedMessageData] = useState(null); 
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

  const handleSelectPesan = (pesan, nomor) => {
    setSelectedMessageData({ pesan: pesan, nomorPesan: nomor });
  };
  
  const handleCloseModal = () => {
    setSelectedMessageData(null); 
  };

  if (!userAuth) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p>Loading...</p></div>;
  }

  const shareLink = `${window.location.origin}/send/${userAuth.userId}`;

    
  const handleLogout = () => {
    localStorage.removeItem('userAuth');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-lg shadow-red-500/10 p-8 w-full max-w-md mx-auto my-8 transition-all duration-500 hover:shadow-red-500/20">
        
        <Mailbox2 className="text-red-neon text-5xl mx-auto mb-4" />
        <h1 className="text-3xl md:text-3xl text-orange-400 font-bold text-center mb-6">
          Welcome, <span className="text-orange-400">{userAuth.namaTampilan}!</span>
        </h1>
        
        <div className="bg-white/10 backdrop-blur-md border border-orange-500/20 rounded-xl shadow-inner shadow-red-500/5 p-4 mb-8">
          <h2 className="text-xl font-semibold mb-3 text-red-400">Bagikan Link Rahasiamu</h2>
          <div className="flex flex-col sm:flex-row items-stretch space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="w-full px-3 py-2 border rounded-lg bg-white/5 border-orange-500/20 text-white placeholder-gray-400 text-sm flex-grow focus:ring-red-500 focus:border-red-500 transition-all duration-300"
            />
            <button
              onClick={handleCopyLink}
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

        <div className="text-left mb-6">
             <h2 className="text-xl font-semibold mb-3 text-red-400">Kotak Masuk Anonim</h2>
             <TampilPesanAnonim 
                 refreshTrigger={refreshTrigger} 
                 onSelectPesan={handleSelectPesan} 
             />
        </div>
       
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
      
      {selectedMessageData && (
          <MessageModal 
              pesan={selectedMessageData.pesan} 
              nomorPesan={selectedMessageData.nomorPesan}
              onClose={handleCloseModal}
          />
      )}

    </div>
  );
}