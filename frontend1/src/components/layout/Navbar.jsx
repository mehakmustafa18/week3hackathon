import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img 
             src="/assets/images/logo.png" 
             alt="Brand Logo" 
               />
            <span>Brand Name</span>
          </Link>

          {/* Center Nav Links */}
          <ul className="navbar__links">
            <li><Link to="/collections">Tea Collections</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>

          {/* Right Icons */}
          <div className="navbar__actions">
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <img src="/assets/images/icons/Search.png" alt="" />
            </button>

            {user ? (
              <div className="navbar__user-menu">
                <button className="navbar__icon-btn" aria-label="Account">
                  <img src="/assets/images/icons/Person.png" alt="" />
                </button>
                <div className="navbar__dropdown">
                  <span className="navbar__dropdown-name">{user.name}</span>
                  <Link to="/orders">My Orders</Link>
                  {isAdmin && <Link to="/admin">Dashboard</Link>}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="navbar__icon-btn" aria-label="Login">
                <img src="/assets/person.png" alt="" />
              </Link>
            )}

            <button className="navbar__icon-btn navbar__cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
            </button>

            {/* Mobile hamburger */}
            <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="navbar__search">
            <form onSubmit={handleSearch}>
              <input
                autoFocus
                type="text"
                placeholder="Search teas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
              <button type="button" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/collections" onClick={() => setMenuOpen(false)}>Tea Collections</Link>
          <Link to="/accessories" onClick={() => setMenuOpen(false)}>Accessories</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          {user ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
