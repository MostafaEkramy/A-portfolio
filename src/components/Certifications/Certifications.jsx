import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight, FiCalendar, FiCamera, FiAward } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Certifications.css'

const CertGallery = ({ images, title, orientation = 'landscape' }) => {
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
    <div className={`cert-gallery ${orientation}`}>
      {/* Images with crossfade */}
      {images.map((img, idx) => (
        <img
          key={`${img}-${idx}`}
          src={img}
          alt={`${title} - ${idx + 1}`}
          className={`cert-gallery-img ${idx === activeIndex ? 'active' : ''}`}
        />
      ))}

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
          <button className="cert-gallery-arrow left" onClick={goPrev} aria-label="Previous">
            <FiChevronLeft />
          </button>
          <button className="cert-gallery-arrow right" onClick={goNext} aria-label="Next">
            <FiChevronRight />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="cert-gallery-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`cert-gallery-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(idx) }}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Certifications = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const certifications = content.certifications || []

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
                {/* Certificate Image Gallery — large area */}
                <CertGallery images={images} title={cert.title || 'Certificate'} orientation={cert.orientation} />

                {/* Content area */}
                <div className="cert-content">
                  <div className="cert-content-top">
                    <h3 className="cert-title">{cert.title}</h3>
                    {/* Social links */}
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
    </section>
  )
}

export default Certifications
