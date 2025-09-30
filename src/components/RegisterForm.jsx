import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
    // GANTI 'displayName' menjadi 'namaTampilan' agar sesuai dengan e.parameter.namaTampilan di code.gs
    formData.append('namaTampilan', displayName.trim()); 

    try {
      const response = await fetch(ANONYMOUS_API_URL, { 
        method: 'POST', 
        body: formData 
      });

      // Response harus dibaca sebagai JSON
      const result = await response.json(); 

      // Perhatikan, jika di code.gs kamu mengembalikan 'result', gunakan 'result' di sini
      if (response.ok && result.result === 'success') {
        Swal.fire({
          title: "Registrasi Berhasil!",
          html: `Akunmu (@${result.data.userId}) berhasil dibuat.<br> 
                 <p class="text-danger fw-bold mt-2">SIMPAN KUNCI RAHASIA INI:</p>
                 <code class="d-inline-block p-2 rounded bg-light text-dark">${result.data.loginKey}</code>`,
          icon: "success",
          confirmButtonText: "Mengerti, Lanjut Login"
        }).then(() => {
          navigate('/login');
        });
      } else {
        // Tampilkan pesan error dari backend
        const errorText = result.message || 'Gagal! Cek log Apps Script untuk detailnya.'; 
        Swal.fire('Gagal!', errorText, 'error');
      }
    }catch (error) {
      console.error('Registration error:', error);
      Swal.fire('Error', 'An error occurred during registration.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-11/12 max-w-sm mx-auto my-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2">User ID</label>
            <input
              type="text"
              id="userId"
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Choose a unique User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              id="displayName"
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="How you want to be seen"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold rounded-lg bg-transparent border border-blue-600 text-blue-400 hover:bg-blue-600/20 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
