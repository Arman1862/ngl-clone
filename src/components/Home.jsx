import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">NGL Remake</h1>
        <p className="text-lg mb-10">Send and receive anonymous messages.</p>
        <div className="w-full max-w-xs mx-auto flex flex-col space-y-4">
          <Link 
            to="/login" 
            className="w-full px-4 py-3 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 text-center"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="w-full px-4 py-3 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
