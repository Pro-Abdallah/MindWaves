import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navigation/Navbar';
import PageNavigation from '../Navigation/PageNavigation';
import SocialSidebar from './SocialSidebar';
import ChatbotWidget from './ChatbotWidget';
import './PageLayout.css';

/**
 * PageLayout
 * Wraps all pages to provide the persistent Navbar and pagination buttons.
 * Uses Framer Motion for smooth page transitions.
 */
export default function PageLayout({ children }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="page-layout">
      {/* Only show Navbar and Pagination if we are NOT on the Landing Page */}
      {!isLandingPage && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className={`page-content ${isLandingPage ? 'no-padding' : ''}`}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {!isLandingPage && <PageNavigation />}
      {!isLandingPage && <SocialSidebar />}
      {!isLandingPage && <ChatbotWidget />}
    </div>
  );
}
