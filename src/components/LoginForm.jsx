// src/components/LoginForm.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Pastikan kamu sudah menginstal dan mengimpor Swal
import { ANONYMOUS_API_URL } from "../config/api";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [loginKey, setLoginKey] = useState("");
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
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-11/12 max-w-sm mx-auto my-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan User ID kamu"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="loginKey"
              className="block text-sm font-medium mb-2"
            >
              Login Key
            </label>
            <input
              type="password"
              id="loginKey"
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan kunci rahasia"
              value={loginKey}
              onChange={(e) => setLoginKey(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Buat akun
          </Link>
        </p>
      </div>
    </div>
  );
}
