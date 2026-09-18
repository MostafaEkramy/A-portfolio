import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight, FiCalendar, FiCamera, FiAward, FiEye, FiX } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Certifications.css'

/* ─── Certificate Lightbox Modal ─── */
const CertLightbox = ({ images, activeIndex, title, issuer, onClose, onPrev, onNext, onSelect }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onPrev, onNext])

  return createPortal(
    <motion.div
      className="cert-lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="cert-lightbox-container" onClick={onClose}>
        {/* Top Floating Close Button */}
        <button
          className="cert-lightbox-close"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          aria-label="Close"
          type="button"
        >
          <FiX size={24} />
        </button>

        {/* Main Certificate View */}
        <div className="cert-lightbox-main" onClick={onClose}>
          {images.length > 1 && (
            <button
              className="cert-lightbox-arrow left"
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              aria-label="Previous"
              type="button"
            >
              <FiChevronLeft size={30} />
            </button>
          )}

          <div className="cert-lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt={`${title} - ${activeIndex + 1}`}
                className="cert-lightbox-image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
          </div>

          {images.length > 1 && (
            <button
              className="cert-lightbox-arrow right"
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              aria-label="Next"
              type="button"
            >
              <FiChevronRight size={30} />
            </button>
          )}
        </div>

        {/* Bottom Title Bar */}
        <div className="cert-lightbox-footer" onClick={(e) => e.stopPropagation()}>
          <h3 className="cert-lightbox-title">{title}</h3>
          {issuer && <span className="cert-lightbox-issuer">• {issuer}</span>}
          {images.length > 1 && (
            <div className="cert-lightbox-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`cert-lightbox-dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => onSelect(idx)}
                  type="button"
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>,
    document.body
  )
}

/* ─── Certificate Image Gallery with Hover Effect ─── */
const CertGallery = ({ images, title, orientation = 'landscape', onOpen, t }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultiple = images.length > 1

  const goNext = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  const goPrev = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className={`cert-gallery ${orientation}`}>
        <div className="cert-gallery-placeholder">
          <FiAward />
          <span>No certificate image</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`cert-gallery ${orientation}`}
      onClick={() => onOpen && onOpen(images, activeIndex, title)}
      role="button"
      tabIndex={0}
      title="Click to view certificate"
    >
      {/* Images with crossfade */}
      {images.map((img, idx) => (
        <img
          key={`${img}-${idx}`}
          src={img}
          alt={`${title} - ${idx + 1}`}
          className={`cert-gallery-img ${idx === activeIndex ? 'active' : ''}`}
        />
      ))}

      {/* Hover Overlay with Eye icon & "View Certificate" */}
      <div className="cert-gallery-hover-overlay">
        <div className="cert-hover-icon-circle">
          <FiEye size={24} />
        </div>
        <span className="cert-hover-text">{t('certsViewCertificate') || 'View Certificate'}</span>
      </div>

      {/* Counter badge */}
      {hasMultiple && (
        <div className="cert-gallery-counter">
          <FiCamera />
          <span>{activeIndex + 1} / {images.length}</span>
        </div>
      )}

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button className="cert-gallery-arrow left" onClick={goPrev} aria-label="Previous" type="button">
            <FiChevronLeft />
          </button>
          <button className="cert-gallery-arrow right" onClick={goNext} aria-label="Next" type="button">
            <FiChevronRight />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="cert-gallery-dots" onClick={(e) => e.stopPropagation()}>
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`cert-gallery-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(idx) }}
              aria-label={`Image ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main Certifications Component ─── */
const Certifications = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const certifications = content.certifications || []

  // Lightbox State
  const [lightbox, setLightbox] = useState({
    open: false,
    images: [],
    index: 0,
    title: '',
    issuer: '',
  })

  const openLightbox = (images, index, title, issuer) => {
    setLightbox({
      open: true,
      images,
      index,
      title,
      issuer,
    })
  }

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, open: false }))
  }

  const lightboxNext = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }))
  }

  const lightboxPrev = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }))
  }

  const lightboxSelect = (idx) => {
    setLightbox((prev) => ({ ...prev, index: idx }))
  }

  return (
    <section id="certifications" className="section certifications" ref={ref}>
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>{t('certsTitle')}</h2>
          <div className="underline" />
        </motion.div>

        <div className="certs-grid">
          {certifications.map((cert, index) => {
            const description = (locale === 'ar' ? cert.description_ar : cert.description_en) || cert.description_en || cert.description_ar || ''
            const images = Array.isArray(cert.images) ? cert.images.filter(Boolean) : []

            return (
              <motion.div
                key={cert.id || index}
                className="cert-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Certificate Image Gallery — large area with hover overlay */}
                <CertGallery
                  images={images}
                  title={cert.title || 'Certificate'}
                  orientation={cert.orientation}
                  onOpen={(imgs, idx, ttl) => openLightbox(imgs, idx, ttl, cert.issuer)}
                  t={t}
                />

                {/* Content area */}
                <div className="cert-content">
                  <div className="cert-content-top">
                    <div className="cert-title-group">
                      <h3 className="cert-title">{cert.title}</h3>
                      {cert.issuer && (
                        <span className="cert-issuer-highlight">• {cert.issuer}</span>
                      )}
                    </div>

                    {/* Social icons */}
                    <div className="cert-social-links">
                      {cert.socials?.facebook && cert.socials.facebook !== '#' && (
                        <a href={cert.socials.facebook} target="_blank" rel="noopener noreferrer" className="cert-social-btn facebook" aria-label="Facebook">
                          <FaFacebookF />
                        </a>
                      )}
                      {cert.socials?.instagram && cert.socials.instagram !== '#' && (
                        <a href={cert.socials.instagram} target="_blank" rel="noopener noreferrer" className="cert-social-btn instagram" aria-label="Instagram">
                          <FaInstagram />
                        </a>
                      )}
                      {cert.socials?.github && cert.socials.github !== '#' && (
                        <a href={cert.socials.github} target="_blank" rel="noopener noreferrer" className="cert-social-btn github" aria-label="GitHub">
                          <FaGithub />
                        </a>
                      )}
                      {cert.socials?.linkedin && cert.socials.linkedin !== '#' && (
                        <a href={cert.socials.linkedin} target="_blank" rel="noopener noreferrer" className="cert-social-btn linkedin" aria-label="LinkedIn">
                          <FaLinkedinIn />
                        </a>
                      )}
                    </div>
                  </div>

                  {description && <p className="cert-desc">{description}</p>}

                  {/* LinkedIn Full Action Button if available */}
                  {cert.socials?.linkedin && cert.socials.linkedin !== '#' && (
                    <div className="cert-actions">
                      <a
                        href={cert.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-action-btn--linkedin"
                      >
                        <FaLinkedinIn size={14} />
                        LinkedIn
                      </a>
                    </div>
                  )}

                  {/* Meta row */}
                  <div className="cert-meta">
                    {cert.date && (
                      <span className="cert-meta-badge">
                        <FiCalendar />
                        {cert.date}
                      </span>
                    )}
                    {cert.issuer && (
                      <span className="cert-meta-badge issuer">
                        <FiAward />
                        {cert.issuer}
                      </span>
                    )}
                    {images.length > 0 && (
                      <span className="cert-meta-badge photos">
                        <FiCamera />
                        {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.open && (
          <CertLightbox
            images={lightbox.images}
            activeIndex={lightbox.index}
            title={lightbox.title}
            issuer={lightbox.issuer}
            onClose={closeLightbox}
            onPrev={lightboxPrev}
            onNext={lightboxNext}
            onSelect={lightboxSelect}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Certifications
