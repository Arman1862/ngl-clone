import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TampilPesanAnonim from './TampilPesanAnonim';
import { Clipboard } from 'react-bootstrap-icons';

export default function Dashboard() {
  const [userAuth, setUserAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('userAuth'); // <-- CORRECTED KEY
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
          title: 'Copied!',
          text: 'Your share link has been copied to the clipboard.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }).catch(err => {
        console.error('Failed to copy:', err);
        Swal.fire('Oops!', 'Failed to copy the link.', 'error');
      });
    }
  };

  if (!userAuth) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>Loading...</p></div>;
  }

  const shareLink = `${window.location.origin}/send/${userAuth.userId}`;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Welcome, {userAuth.namaTampilan}!</h1>
        
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-400/30 rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Share Your Link</h2>
          <p className="text-slate-300 mb-4">Share this link to receive anonymous messages.</p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="w-full px-4 py-3 border rounded-lg bg-slate-900/70 border-slate-500/50 text-white placeholder-gray-400 flex-grow"
            />
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-5 py-3 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            >
              <Clipboard className="mr-2" />
              Copy
            </button>
          </div>
        </div>

        <TampilPesanAnonim />
      </div>
    </div>
  );
}