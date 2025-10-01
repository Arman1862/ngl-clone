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
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effect: Blob Neon (sama seperti Home) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Main Card */}
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