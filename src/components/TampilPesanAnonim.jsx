import { useState, useEffect } from 'react';
import { Person } from "react-bootstrap-icons";
import { ANONYMOUS_API_URL } from '../config/api';

export default function TampilPesanAnonim({ refreshTrigger }) {
  const [pesanAnonim, setPesanAnonim] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPesanAnonim = async () => {
    setIsLoading(true);
    
    // 1. Ambil data otentikasi dari LocalStorage
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    
    // 2. Lakukan pengecekan. Jika userAuth tidak ada, hentikan proses.
    if (!userAuth || !userAuth.userId || !userAuth.loginKey) {
        console.error("User not authenticated.");
        setIsLoading(false);
        // Mungkin kamu perlu redirect ke halaman login di sini jika tidak ada auth
        return; 
    }

    // 3. Buat URL dengan query parameter action=login dan data user
    const fetchUrl = `${ANONYMOUS_API_URL}?action=login&userId=${encodeURIComponent(userAuth.userId)}&loginKey=${encodeURIComponent(userAuth.loginKey)}`;

    try {
      // Menggunakan GET
      const response = await fetch(fetchUrl, { method: 'GET' });
      
      if (!response.ok) throw new Error('Gagal mengambil data dari server.');
      
      const data = await response.json();
      
      // 4. PERBAIKI: Cek result dan ambil array pesan dari data.messages
      if (data.result === 'success' && data.messages) {
          // data.messages.reverse() untuk menampilkan pesan terbaru di atas
          setPesanAnonim(data.messages.reverse()); 
      } else {
          console.error('Fetch gagal:', data.message || 'Respons tidak valid.');
          setPesanAnonim([]); // Kosongkan jika gagal
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-11/12 max-w-sm mx-auto my-8">
        <h2 className="text-center text-white text-3xl font-bold mb-6">Anonymous Inbox</h2>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="text-center text-white py-10">
              <p>Loading messages...</p>
            </div>
          ) : (
            pesanAnonim.length > 0 ? (
              pesanAnonim.map((pesan, i) => (
                <div key={i} className="p-3 my-2 rounded-lg bg-white/5 shadow-inner flex items-start space-x-3">
                  <Person className="text-white/70 text-xl flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <p className="mb-1 text-base text-white">{pesan.Pesan}</p>
                    <small className="text-white/50 text-xs">
                      from {pesan.Pengirim} • {new Date(pesan.Tanggal).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white/50 py-10">No anonymous messages yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}