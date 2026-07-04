import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './Loader.css'

const Loader = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 18) // ~1.8s to reach 100%, matching the 2s total loading time perfectly
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loader">
      <div className="loader-bg-overlay" />
      <div className="loader-glow-flare flare-1" />
      <div className="loader-glow-flare flare-2" />

      <div className="loader-content">
        <div className="loader-ring-container">
          <div className="loader-ring outer" />
          <div className="loader-ring inner" />
          <div className="loader-center-content">
            <span className="loader-initials">AES</span>
            <span className="loader-percent">{progress}%</span>
          </div>
        </div>

        <motion.div 
          className="loader-text-wrapper"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="loader-name">Ahmed EL Saeed</h1>
          <p className="loader-subtitle">Loading Portfolio</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Loader

