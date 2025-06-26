import { useState, useEffect } from 'react'
import './App.css';
import api from './api.js';
import Home from './Home.jsx';

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        const response = await api.post(`/api/auth/signup`, {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });

        setSuccess('Registration successful! You can now login.');
        setIsRegister(false);
      }
      else {
        const response = await api.post(`/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        
        setSuccess('Login successful!');
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          password: ''
        });
        
        // Set logged in state after a brief delay to show success message
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 1000);
      }
    }
    catch (err) {
      setError(err.response?.data?.message || 
               (isRegister ? 'Registration failed' : 'Login failed'));
    }
    finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If user is logged in, show Home component
  if (isLoggedIn) {
    return <Home onLogout={handleLogout} />;
  }

  // Otherwise show the login/register form
  return (
    <div className='auth-container'>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className='form-group'>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className='submit-btn'
        >
          {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
        </button>
      </form>

      <p>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          className='toggle-btn'
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            setSuccess('');
          }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}

export default App