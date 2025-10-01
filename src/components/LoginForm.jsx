import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Lock } from 'react-bootstrap-icons'; // Tambahkan ikon
import { ANONYMOUS_API_URL } from '../config/api'; // Pastikan path benar

export default function LoginForm() {
  const [userId, setUserId] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. MEMBUAT URL DENGAN QUERY PARAMETER YANG LENGKAP
    // Menambahkan action=login dan memastikan userId/loginKey di-encode
    const loginUrl = `${ANONYMOUS_API_URL}?action=login&userId=${encodeURIComponent(
      userId.trim()
    )}&loginKey=${encodeURIComponent(loginKey.trim())}`;

    try {
      // Login menggunakan GET
      const response = await fetch(loginUrl, { method: "GET" });
      const result = await response.json();

      // 2. MEMPERBAIKI STATUS CHECK: Menggunakan result.result
      if (response.ok && result.result === "success") {
        // Simpan data otentikasi ke LocalStorage
        // Kita simpan userId, loginKey, dan namaTampilan untuk dipakai di TampilPesanAnonim
        const userAuthData = {
          userId: result.profile.userId, // <-- Key Baru
          loginKey: loginKey.trim(),
          namaTampilan: result.profile.namaTampilan, // <-- Key Baru
        };

        localStorage.setItem("userAuth", JSON.stringify(userAuthData));

        Swal.fire({
          title: "Login Sukses!",
          text: `Selamat datang, ${result.profile.namaTampilan}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/dashboard"); // Redirect ke dashboard setelah login
        });
      } else {
        // Handle error dari backend (misal: 'Invalid credentials')
        const errorText =
          result.message || "Login gagal. Cek User ID dan Kunci Rahasiamu.";
        Swal.fire("Gagal!", errorText, "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("Error!", "Koneksi gagal. Cek jaringan atau URL API.", "error");
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
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-fuchsia-500/30 rounded-3xl shadow-lg shadow-fuchsia-500/10 p-8 w-full max-w-sm mx-auto my-8 transition-all duration-500 hover:shadow-fuchsia-500/20">
        <Lock className="text-fuchsia-400 text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400">
          Login ke Akun
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2 text-gray-300">User ID</label>
            <input
              type="text"
              id="userId"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-fuchsia-500/20 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Masukkan User ID kamu"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="loginKey" className="block text-sm font-medium mb-2 text-gray-300">Login Key</label>
            <input
              type="password"
              id="loginKey"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-fuchsia-500/20 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Masukkan kunci rahasia"
              value={loginKey}
              onChange={(e) => setLoginKey(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 font-bold rounded-xl 
                       bg-gradient-to-r from-blue-600 to-fuchsia-600 
                       text-white 
                       shadow-md shadow-blue-500/30 
                       hover:from-blue-500 hover:to-fuchsia-500 
                       hover:shadow-lg hover:shadow-blue-500/50
                       transition duration-300 transform hover:scale-[1.02] 
                       uppercase tracking-wider"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-400">
          Belum punya akun?{" "}
          <Link to="/register" className="text-fuchsia-400 hover:text-blue-400 font-semibold transition duration-200">
            Register Akun Baru
          </Link>
        </p>
      </div>
    </div>
  );
}