import { useState, useEffect } from 'react';
import { Person } from "react-bootstrap-icons";

const ANONYMOUS_API_URL = "https://script.google.com/macros/s/AKfycbx05SoPrXdvVU5KH0vl2qcHXgjKTzhZOQZg4s732RmJ5UmUvFq8sedCtSludVOVjs7tyw/exec";

export default function TampilPesanAnonim({ refreshTrigger }) {
  const [pesanAnonim, setPesanAnonim] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPesanAnonim = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(ANONYMOUS_API_URL);
      if (!response.ok) throw new Error('Failed to fetch data.');
      const data = await response.json();
      setPesanAnonim(data.reverse());
    } catch (error) {
      console.error('Failed to fetch messages:', error);
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