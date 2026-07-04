import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaGithub } from 'react-icons/fa'
import { FiChevronDown, FiDownload } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Hero.css'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const socialLinks = [
  { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/in/ahmed-el-saeed-01b927330', label: 'LinkedIn' },
  { icon: <FaFacebookF />, href: 'https://www.facebook.com/share/18qRTnK1cF/', label: 'Facebook' },
  { icon: <FaInstagram />, href: 'https://www.instagram.com/ahmed_el_saeed_1', label: 'Instagram' },
  { icon: <FaWhatsapp />, href: 'https://wa.me/201061931040', label: 'WhatsApp' },
]

const Hero = () => {
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const navigate = useNavigate()
  const roles = locale === 'ar' ? content.hero.roles_ar : content.hero.roles_en

  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [imgError, setImgError] = useState(false)

  const profileImageUrl = content.hero?.profileImage || ''

  useEffect(() => {
    setImgError(false)
  }, [profileImageUrl])

  useEffect(() => {
    const currentRole = roles[roleIndex]
    let timeout

    if (!isDeleting && charIndex <= currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.slice(0, charIndex))
        setCharIndex(prev => prev + 1)
      }, 100)
    } else if (!isDeleting && charIndex > currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setCharIndex(prev => prev - 1)
        setDisplayText(currentRole.slice(0, charIndex - 1))
      }, 50)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, roleIndex, roles])

  useEffect(() => {
    setCharIndex(0)
    setIsDeleting(false)
    setDisplayText('')
  }, [locale])

  return (
    <section id="home" className="hero">
      <div className="hero-bg-gradient" />
      <div className="container hero-container">
        <motion.div
          className="hero-content"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="hero-greeting" variants={item}>
            {locale === 'ar' ? content.hero.greeting_ar : content.hero.greeting_en}
          </motion.p>
          <motion.h1 className="hero-name" variants={item}>
            {t('heroName')}
          </motion.h1>
          <motion.div className="hero-subtitle" variants={item}>
            <span className="hero-intro">{t('heroIntro')}</span>
            <span className="typing-text">{displayText}</span>
            <span className="typing-cursor">|</span>
          </motion.div>
          <motion.p className="hero-description" variants={item}>
            {locale === 'ar' ? content.hero.description_ar : content.hero.description_en}
          </motion.p>
          <motion.p className="hero-quote" variants={item}>
            <em>{locale === 'ar' ? content.hero.quote_ar : content.hero.quote_en}</em>
          </motion.p>
          <motion.div className="hero-buttons" variants={item}>
            <button className="btn-primary" onClick={() => navigate('/projects')}>
              {t('heroBtnProjects')}
            </button>
            <button className="btn-outline hero-btn-cv" onClick={() => navigate('/cv')}>
              <FiDownload /> {t('heroBtnCV')}
            </button>
            <button className="btn-outline" onClick={() => navigate('/contact')}>
              {t('heroBtnContact')}
            </button>
          </motion.div>
          <motion.div className="hero-socials" variants={item}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-icon"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="hero-image-wrapper">
            <div className="hero-image-glow" />
            <div className="hero-image-frame">
              {profileImageUrl && !imgError ? (
                <img
                  src={profileImageUrl}
                  alt={t('heroName')}
                  className="hero-profile-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="hero-image-placeholder">
                  <span>AES</span>
                </div>
              )}
            </div>
            <div className="hero-floating-dot dot-1" />
            <div className="hero-floating-dot dot-2" />
            <div className="hero-floating-dot dot-3" />
            <div className="hero-orbit-ring" />
          </div>
        </motion.div>
      </div>

    </section>
  )
}

export default Hero
