import { useState, useEffect } from 'react';
import TampilPesanAnonim from './TampilPesanAnonim';
import { Link } from 'react-router-dom';
import { Mailbox2 } from 'react-bootstrap-icons'; // Tambahkan ikon

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [namaTampilan, setNamaTampilan] = useState('Anonim'); // State untuk nama tampilan

  useEffect(() => {
    // Ambil namaTampilan dari localStorage saat komponen dimuat
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    if (userAuth && userAuth.namaTampilan) {
      setNamaTampilan(userAuth.namaTampilan);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect: Blob Neon */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Main Card: Glassy, Neon-Glow, dan Lebih Berkelas - GANTI DENGAN STYLE HOME/LOGIN */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-lg shadow-blue-500/10 p-8 w-full max-w-sm sm:max-w-md mx-auto my-8 text-center transition-all duration-500 hover:shadow-blue-500/20">
        
        {/* Tambahkan Ikon dan Judul ala Home/Login */}
        <Mailbox2 className="text-blue-400 text-5xl mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400 uppercase tracking-wider">
          Halo, {namaTampilan}!
        </h1>
        <p className="text-md mb-6 text-gray-400">
          Cek pesan anonim yang masuk di bawah.
        </p>

        {/* CONTAINER PESAN (TampilPesanAnonim) */}
        {/* TampilPesanAnonim sekarang TIDAK perlu punya wrapper card lagi */}
        <TampilPesanAnonim refreshTrigger={refreshTrigger} />
        
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
    </div>
  );
}