import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_ROUTES } from '../../routes';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.nav 
      className="main-navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo 1.png" alt="MindWaves Logo" className="logo-image" />
          <img src="/Mind waves-2.png" alt="MindWaves" className="logo-text" />
        </Link>
      </div>

      <ul className="navbar-links">
        {APP_ROUTES.map((route) => {
          // Skip the landing page from the navbar links to keep it clean, or include it if desired.
          if (route.path === '/') return null;
          
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
    </motion.nav>
  );
}
