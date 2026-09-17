import { useState, useEffect, lazy, Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Footer from './components/Footer/Footer'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'
import BackToTop from './components/BackToTop/BackToTop'
import Loader from './components/Loader/Loader'
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground'
import './App.css'

/* Lazy-load pages that are NOT on the home page for faster initial load */
const Projects = lazy(() => import('./components/Projects/Projects'))
const Achievements = lazy(() => import('./components/Achievements/Achievements'))
const Events = lazy(() => import('./components/Events/Events'))
const Certifications = lazy(() => import('./components/Certifications/Certifications'))
const Contact = lazy(() => import('./components/Contact/Contact'))
const CV = lazy(() => import('./components/CV/CV'))
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'))
const AchievementNews = lazy(() => import('./components/AchievementNews/AchievementNews'))

const Home = () => (
  <>
    <Hero />
    <About />
  </>
)

/* Minimal inline spinner for lazy route transitions */
const RouteLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  }}>
    <div style={{
      width: 36,
      height: 36,
      border: '3px solid rgba(0,180,216,0.2)',
      borderTopColor: '#00B4D8',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
)

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <Router>
      <div className="app">
        <ParticlesBackground />
        <ScrollProgress />
        <Navbar />
        <main style={{ minHeight: '80vh', position: 'relative', zIndex: 1 }}>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/events" element={<Events />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/news/ideal-student-competition" element={<AchievementNews />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  )
}

export default App
