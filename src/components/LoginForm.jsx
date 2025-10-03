import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Lock } from 'react-bootstrap-icons';
import { ANONYMOUS_API_URL } from '../config/api';

export default function LoginForm() {
  const [userId, setUserId] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginUrl = `${ANONYMOUS_API_URL}?action=login&userId=${encodeURIComponent(
      userId.trim()
    )}&loginKey=${encodeURIComponent(loginKey.trim())}`;

    try {
      const response = await fetch(loginUrl, { method: "GET" });
      const result = await response.json();

      if (response.ok && result.result === "success") {
        const userAuthData = {
          userId: result.profile.userId,
          loginKey: loginKey.trim(),
          namaTampilan: result.profile.namaTampilan,
        };

        localStorage.setItem("userAuth", JSON.stringify(userAuthData));

        Swal.fire({
          title: "Login Sukses!",
          text: `Selamat datang, ${result.profile.namaTampilan}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: '#0A0A0A',
          color: '#ffffff'
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        const errorText =
          result.message || "Login gagal. Cek User ID dan Kunci Rahasiamu.";
        Swal.fire({
          title: "Gagal!",
          text: errorText,
          icon: "error",
          background: '#0A0A0A',
          color: '#ffffff',
          confirmButtonColor: '#FF3366'
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        title: "Error!",
        text: "Koneksi gagal. Cek jaringan atau URL API.",
        icon: "error",
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
        
        <Lock className="text-orange-400 text-5xl mx-auto mb-4" />
        <h1 className="text-3xl text-center font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 uppercase tracking-wider">
          Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium mb-2 text-gray-300 text-left">User ID</label>
            <input
              type="text"
              id="userId"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-red-500/20 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              placeholder="Masukkan User ID kamu"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="loginKey" className="block text-sm font-medium mb-2 text-gray-300 text-left">Kunci Rahasia</label>
            <input
              type="password"
              id="loginKey"
              className="w-full px-4 py-3 border rounded-xl bg-white/10 border-orange-500/20 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
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
                       bg-gradient-to-r from-red-600 to-orange-600 
                       text-white 
                       shadow-md shadow-red-500/30 
                       hover:from-red-500 hover:to-orange-500 
                       hover:shadow-lg hover:shadow-red-500/50
                       transition duration-300 transform hover:scale-[1.02] 
                       uppercase tracking-wider"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-400">
          Belum punya akun?{" "}
          <Link to="/register" className="text-red-400 hover:text-red-300 font-semibold">Register di sini</Link>
        </p>
      </div>
    </div>
  );
}