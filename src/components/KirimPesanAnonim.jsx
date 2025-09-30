import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ANONYMOUS_API_URL } from '../config/api'; 

export default function KirimPesanAnonim({ onPesanTerkirim, recipientId }) {
  const [pesan, setPesan] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        Swal.fire('Success!', 'Your message has been sent.', 'success');
        setPesan('');
        setPengirim('');
        if (onPesanTerkirim) onPesanTerkirim();
      } else {
        Swal.fire('Failed!', 'Something went wrong.', 'error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error!', 'Connection error.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-11/12 max-w-sm mx-auto my-8">
        <h3 className="text-center text-white text-2xl font-bold mb-4">Send an Anonymous Message</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your name (optional)"
              value={pengirim}
              onChange={(e) => setPengirim(e.target.value)}
              disabled={isLoading}
              name="pengirim"
            />
          </div>
          <div>
            <textarea
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Write your message here..."
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              required
              disabled={isLoading}
              name="pesan"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}