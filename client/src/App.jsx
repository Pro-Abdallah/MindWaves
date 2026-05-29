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

/**
 * Landing page wrapper for the intro sequence.
 */
function LandingPage() {
  const navigate = useNavigate();
  const [introVisible, setIntroVisible] = useState(true);

  const handleIntroComplete = () => {
    setIntroVisible(false);
    navigate('/understanding-the-waves', { replace: true });
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#010810', overflow: 'hidden' }}>
      {introVisible && (
        <CinematicIntro onComplete={handleIntroComplete} />
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
