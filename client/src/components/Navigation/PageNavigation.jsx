import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../routes';
import { motion } from 'framer-motion';
import './PageNavigation.css';

export default function PageNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Find current route index
  const currentIndex = APP_ROUTES.findIndex(route => route.path === location.pathname);

  // If we can't find it (e.g. 404), don't show navigation
  if (currentIndex === -1) return null;

  const prevRoute = currentIndex > 0 ? APP_ROUTES[currentIndex - 1] : null;
  const nextRoute = currentIndex < APP_ROUTES.length - 1 ? APP_ROUTES[currentIndex + 1] : null;

  // Key handler for left/right arrows
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' && nextRoute) {
      navigate(nextRoute.path);
    } else if (e.key === 'ArrowLeft' && prevRoute) {
      navigate(prevRoute.path);
    }
  };

  return (
    <motion.div 
      className="page-navigation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="nav-container">
        {/* Previous Button */}
        <div className="nav-btn-wrapper nav-prev">
          {prevRoute && (
            <Link to={prevRoute.path} className="nav-btn">
              <span className="nav-arrow">←</span>
              <div className="nav-text">
                <span className="nav-label">Previous</span>
                <span className="nav-title">{prevRoute.title}</span>
              </div>
            </Link>
          )}
        </div>

        {/* Next Button */}
        <div className="nav-btn-wrapper nav-next">
          {nextRoute && (
            <Link to={nextRoute.path} className="nav-btn">
              <div className="nav-text">
                <span className="nav-label">Next</span>
                <span className="nav-title">{nextRoute.title}</span>
              </div>
              <span className="nav-arrow">→</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
