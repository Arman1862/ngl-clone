import { useState, useEffect } from 'react';
import { Person } from "react-bootstrap-icons";
import { ANONYMOUS_API_URL } from '../config/api';

export default function TampilPesanAnonim({ refreshTrigger, onSelectPesan }) { 
  const [pesanAnonim, setPesanAnonim] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPesanAnonim = async () => {
    setIsLoading(true);
    
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    
    if (!userAuth || !userAuth.userId || !userAuth.loginKey) {
        console.error("User not authenticated.");
        setIsLoading(false);
        return; 
    }

    const fetchUrl = `${ANONYMOUS_API_URL}?action=login&userId=${encodeURIComponent(userAuth.userId)}&loginKey=${encodeURIComponent(userAuth.loginKey)}`;

    try {
      const response = await fetch(fetchUrl, { method: 'GET' });
      
      if (!response.ok) throw new Error('Gagal mengambil data dari server.');
      
      const data = await response.json();
      
      if (data.result === 'success' && data.messages) {
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
            [...pesanAnonim].reverse().map((pesan, i) => { 
              const totalPesan = pesanAnonim.length;
              const nomorPesan = totalPesan - i; 

              return ( 
                <div 
                  key={i} 
                  className="p-3 my-3 rounded-xl bg-white/10 border border-orange-500/10 shadow-lg shadow-red-500/5 flex items-start space-x-3 transition-all duration-300 hover:bg-white/15 cursor-pointer"
                  onClick={() => onSelectPesan(pesan, nomorPesan  )} 
                >
                  <Person className="text-orange-400 text-xl flex-shrink-0 mt-1" />
                  <div className="flex-grow text-left">
                    <p className="mb-1 text-base text-red-400 font-bold">Pesan Rahasia #{nomorPesan}</p>
                    <small className="text-white/50 text-xs">
                      dari **{pesan.Pengirim}** • {new Date(pesan.Tanggal).toLocaleString()}
                    </small>
                  </div>
                </div>
              ); 
            })
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Belum ada pesan anonim. Bagikan linkmu!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}