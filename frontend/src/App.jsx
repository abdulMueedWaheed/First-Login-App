import { useState, useEffect } from 'react'
import './App.css';
import api from './api.js';
import Home from './Home.jsx';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { CSSTransition } from 'react-transition-group'; // Add this import

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
  const [animating, setAnimating] = useState(false); // Add this state for animation

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
        
        // Animate mode change
        setAnimating(true);
        setTimeout(() => {
          setIsRegister(false);
          setAnimating(false);
        }, 300);
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
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setAnimating(true);
    setError('');
    setSuccess('');
    
    // Delay the actual state change to allow for animation
    setTimeout(() => {
      setIsRegister(!isRegister);
      setAnimating(false);
    }, 300);
  };

  // If user is logged in, show Home component
  if (isLoggedIn) {
    return <Home onLogout={handleLogout} />;
  }

  // Otherwise show the login/register form
  return (
    <div className={`container ${isRegister ? 'register-mode' : ''}`}>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className={`form-box-login ${animating ? 'animating' : ''}`}>
        <form onSubmit={handleSubmit}>
          <CSSTransition
            in={!animating}
            timeout={300}
            classNames="form"
            unmountOnExit
          >
            <div>
              <h1>{isRegister ? 'Sign Up' : 'Login'}</h1>
              
              {isRegister && (
                <div className="input-box">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  <PersonIcon/>
                </div>
              )}
              
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className='icon'><PersonIcon/></div>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className='icon'><LockIcon/></div>
              </div>
              
              {!isRegister && (
                <div className="forgot-link">
                  <a href="#">Forgot Password?</a>
                </div>
              )}
              
              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading ? "Processing..." : (isRegister ? "Sign Up" : "Login")}
              </button>

              <p>
                {isRegister ? "Already have an account? " : "Don't have an account? "}
                <a href="#" onClick={toggleMode}>
                  {isRegister ? "Login" : "Sign Up"}
                </a>
              </p>

              <p>Or login with other platforms:</p>

              <div className="social-icons">
                <a href="#"><GitHubIcon/></a>
                <a href="#"><GoogleIcon/></a>
                <a href="#"><FacebookIcon/></a>
                <a href="#"><LinkedInIcon/></a>
              </div>
            </div>
          </CSSTransition>
        </form>
      </div>
    </div>
  );
}

export default App