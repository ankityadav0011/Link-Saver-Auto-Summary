import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      nav('/dashboard');
      setTimeout(() => {
        alert("Welcome to the Bookmark Manager, Do you want to have a sweet coffee like You!");
      }, 1000);
    } catch {
      alert('Login failed');
    }
  };

  const handleNavigateToRegister = () => {
    nav('/register'); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '1rem' }}>New user?</p>
      <button
        onClick={handleNavigateToRegister}
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginTop: '8px',
        }}
      >
        Register
      </button>
    </div>
  );
}
