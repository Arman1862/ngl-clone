import { useState } from 'react';
import Swal from 'sweetalert2';
import { ANONYMOUS_API_URL } from '../config/api'; 
import { Envelope } from 'react-bootstrap-icons';

export default function KirimPesanAnonim({ onPesanTerkirim, recipientId }) {
  const [pesan, setPesan] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('action', 'send'); 
    formData.append('pesan', pesan);
    formData.append('pengirim', pengirim.trim() === '' ? 'Anonim' : pengirim.trim()); 
    if (recipientId) {
      formData.append('recipientId', recipientId);
    }

    try {
      const response = await fetch(ANONYMOUS_API_URL, { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok && result.result === 'success') {
        setIsSent(true); 
        if (onPesanTerkirim) onPesanTerkirim();
      } else {
        const errorText = result.message || 'Pesan gagal terkirim. Cek log Apps Script untuk detailnya.'; 
        Swal.fire('Gagal!', errorText, 'error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error!', 'Koneksi gagal. Cek jaringan atau URL API.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAgain = () => {
    setIsSent(false);
    setPesan('');
    setPengirim('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-lg shadow-red-500/10 p-8 w-full max-w-sm mx-auto my-8 transition-all duration-500 hover:shadow-red-500/20">
        
        {isSent ? (
          <div className="text-center py-8">
            <h3 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Pesan Terkirim!
            </h3>
            <p className="text-lg text-gray-300 mb-8">
              Terima kasih sudah mengirim pesan anonim kepada @{recipientId}!
            </p>
            <button
              onClick={handleSendAgain}
              className="w-full px-6 py-3 font-bold rounded-xl 
                         bg-gradient-to-r from-red-600 to-orange-600 
                         text-white 
                         shadow-md shadow-red-500/30 
                         hover:from-red-500 hover:to-orange-500 
                         hover:shadow-lg hover:shadow-red-500/50
                         transition duration-300 transform hover:scale-[1.02] 
                         uppercase tracking-wider"
            >
              Kirim Pesan Lagi
            </button>
            <a href="/" className="block mt-4 text-sm text-red-400 hover:text-orange-400 transition-colors">
              Kembali ke Beranda
            </a>
          </div>
        ) : (
          <>
            <Envelope className="text-red-400 text-5xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Kirim Pesan Anonim
            </h2>
            <p className="text-center text-gray-300 mb-6">
              Tulis pesan rahasia untuk @{recipientId}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="pengirim" className="block text-sm font-medium mb-2 text-gray-300">Nama Pengirim (Opsional)</label>
                <input
                  type="text"
                  id="pengirim"
                  className="w-full px-4 py-3 border rounded-xl bg-white/10 border-red-500/20 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="Contoh: Secret Admirer / Kosongin"
                  value={pengirim}
                  onChange={(e) => setPengirim(e.target.value)}
                  disabled={isLoading}
                  name="pengirim"
                />
              </div>
              <div>
                <label htmlFor="pesan" className="block text-sm font-medium mb-2 text-gray-300">Pesan Anonim</label>
                <textarea
                  id="pesan"
                  className="w-full px-4 py-3 border rounded-xl bg-white/10 border-orange-500/20 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  rows="4"
                  placeholder="Tulis pesan rahasia kamu di sini..."
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  required
                  disabled={isLoading}
                  name="pesan"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 font-bold rounded-xl 
                           bg-gradient-to-r from-red-600 to-orange-600 
                           text-white 
                           shadow-md shadow-red-500/30 
                           hover:from-red-500 hover:to-orange-500 
                           hover:shadow-lg hover:shadow-red-500/50
                           transition duration-300 transform hover:scale-[1.02] 
                           uppercase tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}