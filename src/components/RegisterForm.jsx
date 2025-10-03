import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PersonAdd } from 'react-bootstrap-icons';
import { ANONYMOUS_API_URL } from '../config/api';

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
                <div class="flex items-center bg-gray-900 p-3 rounded-lg">
                    <code class="flex-grow text-orange-cyber font-mono">${loginKey}</code>
                    <button id="copy-key-btn" class="ml-4 px-3 py-1 rounded-lg bg-red-neon hover:opacity-80 text-white font-semibold">
                    Copy
                    </button>
                </div>
            </div>
          `,
          confirmButtonText: "Mengerti, Lanjut Login",
          background: '#0A0A0A',
          color: '#ffffff',
          confirmButtonColor: '#FF3366',
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
            background: '#0A0A0A',
            color: '#ffffff',
            confirmButtonColor: '#FF3366'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
          title: 'Error', 
          text: 'An error occurred during registration.', 
          icon: 'error',
          background: '#0A0A0A',
          color: '#ffffff',
          confirmButtonColor: '#FF3366'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      

      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-lg shadow-red-500/10 p-8 w-full max-w-sm mx-auto my-8 transition-all duration-500 hover:shadow-red-500/20">
        
        <PersonAdd className="text-red-400 text-5xl mx-auto mb-4" />
        <h1 className="text-3xl text-center font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 uppercase tracking-wider">
          Register
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium mb-2 text-gray-300 text-left">User ID</label>
            <input
              type="text"
              id="userId"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-red-500/20 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              placeholder="User ID unik (tanpa spasi)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="displayName" className="block text-sm font-medium mb-2 text-gray-300 text-left">Nama Tampilan</label>
            <input
              type="text"
              id="displayName"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-orange-500/20 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
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
                       bg-gradient-to-r from-red-600 to-orange-600 
                       text-white 
                       shadow-md shadow-red-500/30 
                       hover:from-red-500 hover:to-orange-500 
                       hover:shadow-lg hover:shadow-red-500/50
                       transition duration-300 transform hover:scale-[1.02] 
                       uppercase tracking-wider"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-400">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}