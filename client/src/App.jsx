import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Home from './pages/Home/Home.jsx';
import Header from './components/header/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import { DarkModeContext } from './context/DarkModeContext.js';

// Layout component that wraps Header and Footer around content
const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const { darkMode } = useContext(DarkModeContext);
  
  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {!isLoginPage && <Header />}
      <main className="main-content">
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/home" element={<Home />} />
              {/* Add more routes as needed */}
              <Route path="/products" element={<div className="placeholder-page"><h1>Products Page</h1><p>This is a placeholder for the products page</p></div>} />
              <Route path="/about" element={<div className="placeholder-page"><h1>About Us</h1><p>This is a placeholder for the about page</p></div>} />
              <Route path="/contact" element={<div className="placeholder-page"><h1>Contact Us</h1><p>This is a placeholder for the contact page</p></div>} />
              <Route path="/cart" element={<div className="placeholder-page"><h1>Shopping Cart</h1><p>This is a placeholder for the shopping cart page</p></div>} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}
