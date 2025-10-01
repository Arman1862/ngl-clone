import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PersonAdd } from 'react-bootstrap-icons'; // Tambahkan ikon
import { ANONYMOUS_API_URL } from '../config/api'; // Pastikan path benar

export default function RegisterForm() {
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('action', 'register');
    formData.append('userId', userId.trim()); 
    formData.append('namaTampilan', displayName.trim()); 

    try {
      const response = await fetch(ANONYMOUS_API_URL, { 
        method: 'POST', 
        body: formData 
      });

      const result = await response.json(); 

      if (response.ok && result.result === 'success' && result.data.loginKey) {
        const loginKey = result.data.loginKey;

        Swal.fire({
          title: "Registrasi Berhasil!",
          icon: "success",
          html: `
            <div class="text-left text-white my-4">
                <p>Akunmu (@${result.data.userId}) berhasil dibuat.</p>
                <p class="font-bold mt-3 mb-2">SIMPAN KUNCI RAHASIA INI:</p>
                <div class="flex items-center bg-gray-800 p-3 rounded-lg">
                    <code class="flex-grow text-yellow-300 font-mono">${loginKey}</code>
                    <button id="copy-key-btn" class="ml-4 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Copy
                    </button>
                </div>
            </div>
          `,
          confirmButtonText: "Mengerti, Lanjut Login",
          background: '#1e293b',
          color: '#ffffff',
          didOpen: () => {
            const copyBtn = document.getElementById('copy-key-btn');
            if (copyBtn) {
              copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(loginKey).then(() => {
                  copyBtn.textContent = 'Copied!';
                  copyBtn.disabled = true;
                }).catch(err => {
                  console.error('Failed to copy key:', err);
                  copyBtn.textContent = 'Failed!';
                });
              });
            }
          }
        }).then(() => {
          navigate('/login');
        });
      } else {
        const errorText = result.message || 'Gagal! Cek log Apps Script untuk detailnya.'; 
        Swal.fire({
            title: 'Gagal!', 
            text: errorText, 
            icon: 'error',
            background: '#1e293b',
            color: '#ffffff'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
          title: 'Error', 
          text: 'An error occurred during registration.', 
          icon: 'error',
          background: '#1e293b',
          color: '#ffffff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-lg shadow-blue-500/10 p-8 w-full max-w-sm mx-auto my-8 transition-all duration-500 hover:shadow-blue-500/20">
        <PersonAdd className="text-blue-400 text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">
          Buat Akun Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2 text-gray-300">User ID (@username)</label>
            <input
              type="text"
              id="userId"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-blue-500/20 text-white placeholder-gray-400 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-300"
              placeholder="Pilih User ID unik"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-2 text-gray-300">Nama Tampilan</label>
            <input
              type="text"
              id="displayName"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-blue-500/20 text-white placeholder-gray-400 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-300"
              placeholder="Nama kamu di profil"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-400">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-400 hover:text-fuchsia-400 font-semibold transition duration-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}