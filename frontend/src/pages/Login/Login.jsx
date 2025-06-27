import React, { useState } from 'react';
import './Auth.css';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        await api.post('/api/auth/signup', {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        alert('Registered successfully!');
      }
	  
	  else {
        await api.post('/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        alert('Logged in successfully!');
      }

	  navigate('/home');
    } 
	
	catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {isRegister && (
          <div className="input-group">
            <PersonIcon className="input-icon" />
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
        <div className="input-group">
          <EmailIcon className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <LockIcon className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p className="toggle-text">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <button
          type="button"
          className="toggle-button"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}
