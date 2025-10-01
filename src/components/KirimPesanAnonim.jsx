import { useState } from 'react';
import Swal from 'sweetalert2';
import { ANONYMOUS_API_URL } from '../config/api'; 
import { Envelope } from 'react-bootstrap-icons'; // Tambahkan ikon

export default function KirimPesanAnonim({ onPesanTerkirim, recipientId }) {
  const [pesan, setPesan] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // State baru untuk cek pesan terkirim

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('action', 'send'); 
    formData.append('pesan', pesan);
    // Jika pengirim kosong, kirim 'Anonim'
    formData.append('pengirim', pengirim.trim() === '' ? 'Anonim' : pengirim.trim()); 
    if (recipientId) {
      formData.append('recipientId', recipientId);
    }

    try {
      const response = await fetch(ANONYMOUS_API_URL, { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok && result.result === 'success') {
        // Hapus Swal sukses. Kita ganti dengan perubahan UI (isSent = true)
        setIsSent(true); 
        if (onPesanTerkirim) onPesanTerkirim();
      } else {
        // Tampilkan pesan error dari backend
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

  // Fungsi untuk reset form dan kirim pesan lagi
  const handleSendAgain = () => {
    setIsSent(false);
    setPesan('');
    setPengirim('');
  };

  return (
    // Wrapper Utama (Body style Neon Glassy)
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effect: Blob Neon (sama seperti Home/Login) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Main Card (Glassy Style) */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-fuchsia-500/30 rounded-3xl shadow-lg shadow-fuchsia-500/10 p-8 w-full max-w-sm mx-auto my-8 transition-all duration-500 hover:shadow-fuchsia-500/20">
        
        {/* KONTEN BERGANTUNG PADA STATUS PESAN TERKIRIM */}
        {isSent ? (
          // Tampilan Sukses Terkirim
          <div className="text-center py-8">
            <h3 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">
              Pesan Terkirim!
            </h3>
            <p className="text-lg text-gray-300 mb-8">
              Terima kasih sudah mengirim pesan anonim kepada @{recipientId}!
            </p>
            <button
              onClick={handleSendAgain}
              // Style tombol Gradient utama
              className="w-full px-6 py-3 font-bold rounded-xl 
                         bg-gradient-to-r from-blue-600 to-fuchsia-600 
                         text-white 
                         shadow-md shadow-blue-500/30 
                         hover:from-blue-500 hover:to-fuchsia-500 
                         hover:shadow-lg hover:shadow-blue-500/50
                         transition duration-300 transform hover:scale-[1.02] 
                         uppercase tracking-wider"
            >
              Kirim Pesan Lagi
            </button>
            <a href="/" className="block mt-4 text-sm text-fuchsia-400 hover:text-blue-400 transition-colors">
              Kembali ke Beranda
            </a>
          </div>
        ) : (
          // Tampilan Form Kirim Pesan
          <>
            <Envelope className="text-fuchsia-400 text-5xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400">
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
                  // Style input Glassy/Neon
                  className="w-full px-4 py-3 border rounded-xl bg-white/10 border-fuchsia-500/20 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
                  // Style input Glassy/Neon
                  className="w-full px-4 py-3 border rounded-xl bg-white/10 border-fuchsia-500/20 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
                // Style tombol Gradient utama
                className="w-full px-6 py-3 font-bold rounded-xl 
                           bg-gradient-to-r from-fuchsia-600 to-blue-600 
                           text-white 
                           shadow-md shadow-fuchsia-500/30 
                           hover:from-fuchsia-500 hover:to-blue-500 
                           hover:shadow-lg hover:shadow-fuchsia-500/50
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