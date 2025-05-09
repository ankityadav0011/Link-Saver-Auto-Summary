import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === 'true');

  useEffect(() => {
    document.body.style.background = dark ? '#222' : '#fff';
    document.body.style.color = dark ? '#eee' : '#000';
    localStorage.setItem('dark', dark);
  }, [dark]);

  return (
    <Router>
      <button onClick={() => setDark(!dark)} style={{ position: 'fixed', top: 10, right: 10 }}>
        {dark ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
