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
    formData.append('userId', userId);
    formData.append('displayName', displayName);

    try {
      const response = await fetch(ANONYMOUS_API_URL, { 
        method: 'POST', 
        body: formData 
      });
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        Swal.fire({
          title: 'Success!',
          text: 'Registration successful. Please login.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire('Registration Failed', result.message || 'That User ID might already be taken.', 'error');
      }
    } catch (error) {
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
