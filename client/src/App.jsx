import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'

import CinematicIntro from './components/CinematicIntro'
import OceanWorld from './components/OceanWorld/OceanWorld'
import MessagesFromTheSea from './components/MessagesFromTheSea/MessagesFromTheSea'
import InnerEcho from './components/InnerEcho/InnerEcho'
import SafeHarbor from './components/SafeHarbor/SafeHarbor'
import WhyWeSail from './components/WhyWeSail/WhyWeSail'
import RideTheWaves from './components/RideTheWaves/RideTheWaves'
import ABottleReturned from './components/ABottleReturned/ABottleReturned'
import Trailer from './components/Trailer/Trailer'
import IslandPage from './pages/IslandPage'

import PageLayout from './components/Layout/PageLayout'
import './App.css'

import { motion } from 'framer-motion';

/**
 * Landing page wrapper for the intro sequence.
 */
function LandingPage() {
  const navigate = useNavigate();
  const [introVisible, setIntroVisible] = useState(true);

  const handleIntroComplete = () => {
    setIntroVisible(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#010810', overflow: 'hidden' }}>
      {introVisible ? (
        <CinematicIntro onComplete={handleIntroComplete} />
      ) : (
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            color: 'white', 
            background: 'radial-gradient(circle at center, #051A2E 0%, #010810 100%)' 
          }}
        >
          {/* Subtle animated background particles could go here, for now just a clean gradient */}
          
          <motion.img 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            src="/logo 1.png" 
            alt="MindWaves Logo" 
            style={{ width: '64px', marginBottom: '-50px', zIndex: 10, position: 'relative' }} 
          />
          
          <motion.img 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            src="/Mind waves-2.png" 
            alt="MindWaves Text" 
            style={{ width: '220px', marginBottom: '-60px', marginTop: '-30px', zIndex: 9, position: 'relative' }} 
          />
          
          <motion.img 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
            src="/slogan 1 copy.png" 
            alt="Slogan" 
            style={{ width: '280px', marginTop: '-50px', marginBottom: '20px', zIndex: 8, position: 'relative' }} 
          />
          
          <motion.button 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
            onClick={() => navigate('/understanding-the-waves')}
            style={{ 
              padding: '12px 36px', 
              background: 'rgba(81, 132, 192, 0.05)', 
              border: '1px solid rgba(81, 132, 192, 0.3)', 
              color: '#DFE1E6', 
              borderRadius: '40px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '11px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.5s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(81, 132, 192, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(145, 191, 246, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(81, 132, 192, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(81, 132, 192, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(81, 132, 192, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Begin Journey
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Sub-component to access useLocation hook for routing setup.
 */
function AppRoutes() {
  const location = useLocation();

  return (
    <PageLayout>
      <Routes location={location} key={location.pathname}>
        {/* The 9 Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/understanding-the-waves" element={<OceanWorld />} />
        <Route path="/messages-from-the-sea" element={<MessagesFromTheSea />} />
        <Route path="/ride-the-waves" element={<RideTheWaves />} />
        <Route path="/inner-echo" element={<InnerEcho />} />
        <Route path="/safe-harbor" element={<SafeHarbor />} />
        <Route path="/a-bottle-returned" element={<ABottleReturned />} />
        <Route path="/trailer" element={<Trailer />} />
        <Route path="/why-we-sail" element={<WhyWeSail />} />
        
        {/* Dedicated island page for OceanWorld nodes */}
        <Route path="/island/:id" element={<IslandPage />} />
      </Routes>
    </PageLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
