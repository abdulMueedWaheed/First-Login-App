import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice.js';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async() => {
    dispatch(logout());
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
