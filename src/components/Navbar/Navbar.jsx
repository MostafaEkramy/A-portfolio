import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FiGlobe } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t, locale, toggleLocale } = useTranslation()
  const location = useLocation()

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navCV'), path: '/cv' },
    { name: t('navProjects'), path: '/projects' },
    { name: t('navCertifications'), path: '/certifications' },
    { name: t('navAchievements'), path: '/achievements' },
    { name: t('navEvents'), path: '/events' },
    { name: t('navContact'), path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          <span>&lt; </span>Ahmed EL Saeed<span> /&gt;</span>
        </NavLink>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            className="navbar-lang-btn"
            onClick={toggleLocale}
            aria-label="Toggle language"
          >
            <FiGlobe size={16} />
            <span>{locale === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="navbar-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                className="navbar-mobile"
                initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
                animate={{ x: 0 }}
                exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <div className="navbar-mobile-links">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink
                        to={link.path}
                        end={link.path === '/'}
                        className={({ isActive }) =>
                          `navbar-mobile-link ${isActive ? 'active' : ''}`
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </NavLink>
                    </motion.div>
                  ))}
                  <button
                    className="navbar-lang-btn mobile-lang-btn"
                    onClick={() => { toggleLocale(); setIsOpen(false); }}
                  >
                    <FiGlobe size={16} />
                    <span>{locale === 'en' ? 'العربية' : 'English'}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
