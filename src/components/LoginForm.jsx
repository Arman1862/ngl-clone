import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ANONYMOUS_API_URL = "https://script.google.com/macros/s/AKfycbx05SoPrXdvVU5KH0vl2qcHXgjKTzhZOQZg4s732RmJ5UmUvFq8sedCtSludVOVjs7tyw/exec";

export default function LoginForm() {
  const [userId, setUserId] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginUrl = `${ANONYMOUS_API_URL}?action=login&userId=${encodeURIComponent(userId)}&loginKey=${encodeURIComponent(loginKey)}`;

    try {
      const response = await fetch(loginUrl, { method: 'GET' });
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        // Save user data to Local Storage
        localStorage.setItem('userData', JSON.stringify(result.data));

        Swal.fire({
          title: 'Success!',
          text: 'Login successful!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/dashboard');
        });
      } else {
        Swal.fire('Login Failed', result.message || 'Invalid User ID or Login Key.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire('Error', 'An error occurred during login.', 'error');
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
            <label htmlFor="userId" className="block text-sm font-medium mb-2">User ID</label>
            <input
              type="text"
              id="userId"
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="loginKey" className="block text-sm font-medium mb-2">Login Key</label>
            <input
              type="password"
              id="loginKey"
              className="w-full px-4 py-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your secret key"
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
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          No account? <Link to="/register" className="text-blue-400 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}