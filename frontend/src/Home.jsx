import { useState, useEffect } from 'react';
import api from './api.js';
import './Home.css';

function Home({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual user info endpoint
        const response = await api.get('/api/auth/profile');
        setUserData(response.data);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="header">
        <h1>Welcome to Your Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="user-info">
        <h2>User Profile</h2>
        {userData ? (
          <div className="profile-details">
            <p><strong>Name:</strong> {userData.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Member Since:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Recent Activity</h3>
          <p>No recent activity to display.</p>
        </div>
        <div className="card">
          <h3>Settings</h3>
          <p>Manage your account settings and preferences.</p>
          <button className="action-btn">Go to Settings</button>
        </div>
      </div>
    </div>
  );
}

export default Home;