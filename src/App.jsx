import { Routes, Route, useParams } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import KirimPesanAnonim from './components/KirimPesanAnonim';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import './App.css'; 

const SendMessagePage = () => {
  const { recipientId } = useParams();

  return (
      <KirimPesanAnonim recipientId={recipientId} />
  );
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send/:recipientId" element={<SendMessagePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
