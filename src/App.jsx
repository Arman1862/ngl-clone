import { Routes, Route, useParams } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import KirimPesanAnonim from './components/KirimPesanAnonim';
import Dashboard from './components/Dashboard'; // <-- Import Dashboard
import './App.css'; 

const SendMessagePage = () => {
  const { recipientId } = useParams();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <KirimPesanAnonim recipientId={recipientId} />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* <-- Use imported Dashboard */}
      <Route path="/send/:recipientId" element={<SendMessagePage />} />
    </Routes>
  );
}

export default App;