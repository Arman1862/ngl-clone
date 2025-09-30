import { useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import KirimPesanAnonim from './components/KirimPesanAnonim';
import TampilPesanAnonim from './components/TampilPesanAnonim';
import './App.css'; // Keep existing App.css for now

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePesanTerkirim = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-3xl text-center mb-6">Your Anonymous Inbox</h2>
      <TampilPesanAnonim refreshTrigger={refreshTrigger} />
      <div className="mt-8">
        <KirimPesanAnonim onPesanTerkirim={handlePesanTerkirim} recipientId="YOUR_USER_ID_HERE" /> {/* Placeholder recipientId */}
      </div>
    </div>
  );
};

const SendMessagePage = () => {
  const { recipientId } = useParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Not directly used here, but good practice

  const handlePesanTerkirim = () => {
    setRefreshTrigger(prev => prev + 1); // This would trigger a refresh if TampilPesanAnonim was here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <KirimPesanAnonim onPesanTerkirim={handlePesanTerkirim} recipientId={recipientId} />
    </div>
  );
};


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send/:recipientId" element={<SendMessagePage />} />
    </Routes>
  );
}

export default App;
