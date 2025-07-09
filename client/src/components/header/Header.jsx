import './Header.css'
import { Link, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { makeRequest } from '../../axios';

const Header = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await makeRequest.get(`/users/${currentUser.id}`);

        if (res.data && res.data.data) {
          const user = res.data.data;
          setProfilePic(user.profile_pic || "");
        }
      }
      catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser.id]);

  // Handle clicks outside search results to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search users when typing
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const res = await makeRequest.get(`/users/search?q=${searchQuery}`);
        if (res.data && res.data.success) {
          setSearchResults(res.data.data || []);
          setShowResults(true);
        } else {
          setSearchResults([]);
          console.error("search response error: ", res.data);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      }
    };

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header ${darkMode ? 'dark' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1>ShopEase</h1>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar" ref={searchRef}>
          <SearchOutlinedIcon />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchResults.length > 0) setShowResults(true);
            }}
          />
          {searchQuery && (
            <CloseIcon className="clear-search" onClick={handleClearSearch} />
          )}
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div 
                  key={user.id} 
                  className="search-result-item"
                  onClick={() => handleUserClick(user.id)}
                >
                  <img 
                    src={user.profile_pic || "/path/to/default-avatar.jpg"} 
                    alt={user.name} 
                  />
                  <div className="user-info">
                    <span className="name">{user.full_name}</span>
                    <span className="username">@{user.user_name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links - Desktop */}
        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>
          <div className="theme-toggle mobile-only">
            {(darkMode === false) ? 
              <DarkModeOutlinedIcon onClick={toggle} /> : 
              <LightModeOutlinedIcon onClick={toggle} />}
            <span>Theme</span>
          </div>
        </nav>

        {/* User Actions */}
        <div className="user-actions">
          {/* Theme Toggle - Desktop */}
          <div className="theme-toggle desktop-only">
            {(darkMode === false) ? 
              <DarkModeOutlinedIcon onClick={toggle} /> : 
              <LightModeOutlinedIcon onClick={toggle} />}
          </div>
          
          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon">
            <ShoppingCartOutlinedIcon />
            <span className="cart-count">0</span>
          </Link>

          {/* Notifications */}
          <div className="notifications">
            <NotificationsOutlinedIcon />
          </div>

          {/* User Menu */}
          {currentUser ? (
            <div className="user-menu">
              <div className="user-avatar">
                <Link to={`/profile/${currentUser.id}`}>
                  <img 
                    src={profilePic || "/path/to/default-avatar.jpg"} 
                    alt="Profile Pic"
                  />
                </Link>
              </div>
              <div className="user-dropdown">
                <Link to={`/profile/${currentUser.id}`}>
                  Profile
                </Link>
                {currentUser.is_admin && (
                  <Link to="/admin/dashboard">
                    <DashboardOutlinedIcon /> Dashboard
                  </Link>
                )}
                <button onClick={handleLogout}>
                  <LogoutOutlinedIcon /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-button">Sign In</Link>
          )}

          {/* Hamburger Menu */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;