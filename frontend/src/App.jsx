import { useState } from 'react'
import './App.css'

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      alert(`Registering:\nName: ${formData.fullName}\nEmail: ${formData.email}`);
    } else {
      alert(`Logging in:\nEmail: ${formData.email}`);
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}

export default App
