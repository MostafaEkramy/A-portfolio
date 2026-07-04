import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Achievements from './components/Achievements/Achievements'
import Events from './components/Events/Events'
import Certifications from './components/Certifications/Certifications'
import Contact from './components/Contact/Contact'
import CV from './components/CV/CV'
import AdminPanel from './components/Admin/AdminPanel'
import AchievementNews from './components/AchievementNews/AchievementNews'
import Footer from './components/Footer/Footer'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'
import BackToTop from './components/BackToTop/BackToTop'
import Loader from './components/Loader/Loader'
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground'
import './App.css'

const Home = () => (
  <>
    <Hero />
    <About />
  </>
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/news/ideal-student-competition" element={<AchievementNews />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  )
}

export default App
