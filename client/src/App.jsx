import { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'

import CinematicIntro from './components/CinematicIntro'

// Lazy-loaded components for other routes
const OceanWorld = lazy(() => import('./components/OceanWorld/OceanWorld'))
const MessagesFromTheSea = lazy(() => import('./components/MessagesFromTheSea/MessagesFromTheSea'))
const InnerEcho = lazy(() => import('./components/InnerEcho/InnerEcho'))
const SafeHarbor = lazy(() => import('./components/SafeHarbor/SafeHarbor'))
const WhyWeSail = lazy(() => import('./components/WhyWeSail/WhyWeSail'))
const RideTheWaves = lazy(() => import('./components/RideTheWaves/RideTheWaves'))
const ABottleReturned = lazy(() => import('./components/ABottleReturned/ABottleReturned'))
const Trailer = lazy(() => import('./components/Trailer/Trailer'))
const IslandPage = lazy(() => import('./pages/IslandPage'))

import PageLayout from './components/Layout/PageLayout'
import './App.css'

/**
 * Route Loading Fallback component
 */
function RouteLoader() {
  return (
    <div className="app-route-loader" role="status" aria-label="Loading page">
      <div className="app-route-loader__ring" aria-hidden="true" />
      <p className="app-route-loader__text">Loading Journey...</p>
    </div>
  )
}

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
      <Suspense fallback={<RouteLoader />}>
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
      </Suspense>
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

