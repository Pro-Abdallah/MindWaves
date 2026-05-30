import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_ROUTES } from '../../routes';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navRoutes = APP_ROUTES.filter(r => r.path !== '/');

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        className="main-navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            <img src="/logo 1.png"           alt="MindWaves Logo" className="logo-image" />
            <img src="/mind waves png.png"   alt="MindWaves"      className="logo-text"  />
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="navbar-links">
          {navRoutes.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {route.title}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="nav-indicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger (mobile only) */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar-mobile-drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {navRoutes.map((route, i) => {
              const isActive = location.pathname === route.path;
              return (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={route.path}
                    className={`navbar-mobile-link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    {route.title}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop — closes menu when tapping outside */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 498,
              background: 'transparent',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
