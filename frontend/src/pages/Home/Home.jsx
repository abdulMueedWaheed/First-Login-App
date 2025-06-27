import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import api from '../../services/api.js';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async() => {
    const response = await api.post("/api/auth/logout", {});
    navigate('/');
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Home Page!</h1>
      <p>You are now logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
