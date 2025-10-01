import { useState, useEffect } from 'react';
import { Person } from "react-bootstrap-icons";
import { ANONYMOUS_API_URL } from '../config/api';

// Tambahkan prop onSelectPesan
export default function TampilPesanAnonim({ refreshTrigger, onSelectPesan }) { 
  const [pesanAnonim, setPesanAnonim] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (Kode fetchPesanAnonim tetap sama)
  const fetchPesanAnonim = async () => {
    setIsLoading(true);
    
    // 1. Ambil data otentikasi dari LocalStorage
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    
    // 2. Lakukan pengecekan. Jika userAuth tidak ada, hentikan proses.
    if (!userAuth || !userAuth.userId || !userAuth.loginKey) {
        console.error("User not authenticated.");
        setIsLoading(false);
        return; 
    }

    // 3. Buat URL dengan query parameter action=login dan data user
    const fetchUrl = `${ANONYMOUS_API_URL}?action=login&userId=${encodeURIComponent(userAuth.userId)}&loginKey=${encodeURIComponent(userAuth.loginKey)}`;

    try {
      // Menggunakan GET
      const response = await fetch(fetchUrl, { method: 'GET' });
      
      if (!response.ok) throw new Error('Gagal mengambil data dari server.');
      
      const data = await response.json();
      
      // 4. Cek result dan ambil array pesan dari data.messages
      if (data.result === 'success' && data.messages) {
          // data.messages.reverse() untuk menampilkan pesan terbaru di atas
          setPesanAnonim(data.messages.reverse()); 
      } else {
          console.error('Fetch gagal:', data.message || 'Respons tidak valid.');
          setPesanAnonim([]); 
      }

    } catch (error) {
      console.error('Gagal mengambil pesan:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchPesanAnonim();
  }, [refreshTrigger]);

  return (
    <div className="w-full">
      <div className="max-h-[50vh] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="text-center text-white/70 py-4">
            <p>Loading messages...</p>
          </div>
        ) : (
          pesanAnonim.length > 0 ? (
            pesanAnonim.map((pesan, i) => { // <-- BUKA DENGAN KURUNG KURAWAL
              // Deklarasi variabel di sini sudah benar
              const nomorPesan = pesanAnonim.length - i; 

              return ( // <-- JANGAN LUPA RETURN ELEMEN JSX
                <div 
                  key={i} 
                  className="p-3 my-3 rounded-xl bg-white/10 border border-white/5 shadow-lg flex items-start space-x-3 transition-all duration-300 hover:bg-white/15 cursor-pointer"
                  onClick={() => onSelectPesan(pesan)} // <-- PENTING: Kirim data pesan saat diklik
                >
                  <Person className="text-white/80 text-xl flex-shrink-0 mt-1" />
                  <div className="flex-grow text-left">
                    {/* Tampilkan sebagai Pesan Rahasia [nomor] */}
                    <p className="mb-1 text-base text-white font-bold">Pesan Rahasia #{nomorPesan}</p>
                    <small className="text-white/50 text-xs">
                      dari **{pesan.Pengirim}** • {new Date(pesan.Tanggal).toLocaleString()}
                    </small>
                  </div>
                </div>
              ); // <-- TUTUP RETURN
            }) // <-- TUTUP FUNGSI MAP
          ) : (
            <p className="text-center text-white/50 py-10">Belum ada pesan anonim yang masuk.</p>
          )
        )}
      </div>
    </div>
  );
}