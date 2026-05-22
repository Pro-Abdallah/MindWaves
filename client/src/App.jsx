import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CinematicIntro from './components/CinematicIntro'
import OceanWorld from './components/OceanWorld/OceanWorld'
import InnerEcho from './components/InnerEcho/InnerEcho'
import SafeHarbor from './components/SafeHarbor/SafeHarbor'
import IslandPage from './pages/IslandPage'
import './App.css'

/**
 * Main application component.
 * Sets up routing with react-router-dom and coordinates the
 * entry intro overlay fade with the OceanWorld environment.
 */
function HomePage() {
  const [introVisible, setIntroVisible] = useState(() => {
    // Check if the intro was already completed or skipped in this session
    return sessionStorage.getItem('mw_intro_completed') !== 'true'
  })

  const handleIntroComplete = () => {
    sessionStorage.setItem('mw_intro_completed', 'true')
    setIntroVisible(false)
  }

  return (
    <>
      {/* ── Cinematic Intro sequence ── */}
      {introVisible && (
        <CinematicIntro onComplete={handleIntroComplete} />
      )}

      {/* ── Section II & III & IV Main content wrapper ── */}
      <main
        className={`app-main${introVisible ? ' app-main--hidden' : ' app-main--visible'}`}
        aria-hidden={introVisible}
      >
        {/* Section II: Understanding The Waves */}
        <OceanWorld />

        {/* Section III: Test Your Inner Echo */}
        <InnerEcho />

        {/* Section IV: Safe Harbor */}
        <SafeHarbor />
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main interactive ocean homepage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dedicated island page for each topic */}
        <Route path="/island/:id" element={<IslandPage />} />
      </Routes>
    </BrowserRouter>
  )
}
