import React, { useContext } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../../context/DarkModeContext';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const { darkMode } = useContext(DarkModeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <h2>ShopEase</h2>
            </Link>
            <p className="footer-description">
              Your one-stop shop for all your shopping needs. Quality products, fast delivery, and exceptional customer service.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="Twitter"><TwitterIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Shop Links */}
          <div className="footer-links">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/products/category/electronics">Electronics</Link></li>
              <li><Link to="/products/category/clothing">Clothing</Link></li>
              <li><Link to="/products/category/home-garden">Home & Garden</Link></li>
              <li><Link to="/products/category/sports">Sports & Outdoor</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-links">
            <h3>Customer Service</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/returns">Returns & Refunds</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <p><LocationOnIcon /> 123 Shop Street, City, Country</p>
              <p><EmailIcon /> <a href="mailto:info@shopease.com">info@shopease.com</a></p>
              <p><PhoneIcon /> +1 (555) 123-4567</p>
            </div>
            <div className="newsletter">
              <h4>Subscribe to our newsletter</h4>
              <form className="newsletter-form">
                <input type="email" placeholder="Your Email" aria-label="Email for newsletter" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} ShopEase. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
