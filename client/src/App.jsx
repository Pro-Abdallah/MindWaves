import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CinematicIntro from './components/CinematicIntro'
import OceanWorld from './components/OceanWorld/OceanWorld'
import IslandPage from './pages/IslandPage'
import './App.css'

/**
 * Main application component.
 * Sets up routing with react-router-dom and coordinates the
 * entry intro overlay fade with the OceanWorld environment.
 */
function HomePage() {
  const [introVisible, setIntroVisible] = useState(true)

  return (
    <>
      {/* ── Cinematic Intro sequence ── */}
      {introVisible && (
        <CinematicIntro onComplete={() => setIntroVisible(false)} />
      )}

      {/* ── Section II: Understanding The Waves ── */}
      <main
        className={`app-main${introVisible ? ' app-main--hidden' : ' app-main--visible'}`}
        aria-hidden={introVisible}
      >
        <OceanWorld />
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
