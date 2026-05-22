/**
 * App.jsx — MindWaves root application
 *
 * Renders the CinematicIntro in front of all content.
 * Once the intro calls onComplete(), introVisible flips to false
 * and the main site fades in underneath.
 */

import { useState } from 'react'
import CinematicIntro from './components/CinematicIntro'
import './App.css'

export default function App() {
  const [introVisible, setIntroVisible] = useState(true)

  return (
    <>
      {/* ── Cinematic intro overlay ─────────────────────────── */}
      {introVisible && (
        <CinematicIntro onComplete={() => setIntroVisible(false)} />
      )}

      {/* ── Main website content ────────────────────────────── */}
      {/* Replace everything inside .app-main with your actual site */}
      <main
        className={`app-main${introVisible ? ' app-main--hidden' : ' app-main--visible'}`}
        aria-hidden={introVisible}
      >
        {/*
         * ───────────────────────────────────────────────────
         *   YOUR SITE CONTENT GOES HERE
         *   Add components, routes, sections, etc. below.
         * ───────────────────────────────────────────────────
         */}
        <section className="site-hero">
          <h1 className="site-hero__title">MindWaves</h1>
          <p className="site-hero__sub">
            Your cinematic journey begins here.
          </p>
        </section>
      </main>
    </>
  )
}
