import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiMapPin, FiCalendar, FiCamera } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Events.css'

/* ── Per-card image carousel ── */
const EventGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultiple = images.length > 1
  const total = images.length

  const goTo = useCallback(
    (idx) => {
      if (idx < 0) setActiveIndex(total - 1)
      else if (idx >= total) setActiveIndex(0)
      else setActiveIndex(idx)
    },
    [total],
  )

  if (total === 0) {
    return (
      <div className="event-gallery">
        <div className="event-gallery-placeholder">
          <FiCamera size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="event-gallery">
      {/* Images – crossfade via opacity */}
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${title} ${i + 1}`}
          className={`event-gallery-img ${i === activeIndex ? 'active' : ''}`}
          draggable={false}
        />
      ))}

      {/* Counter badge */}
      <span className="event-gallery-counter">
        {activeIndex + 1} / {total}
      </span>

      {/* Photo count badge */}
      <span className="event-gallery-photo-count">
        <FiCamera size={12} />
        {total}
      </span>

      {/* Arrows – only when 2+ images */}
      {hasMultiple && (
        <>
          <button
            className="event-gallery-arrow arrow-left"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous image"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            className="event-gallery-arrow arrow-right"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next image"
          >
            <FiChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="event-gallery-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`event-gallery-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Events section ── */
const Events = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const events = content.events || []

  return (
    <section id="events" className="section events" ref={ref}>
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>{t('eventsTitle')}</h2>
          <div className="underline" />
        </motion.div>

        <div className="events-grid">
          {events.map((event, index) => {
            const title = (locale === 'ar' ? event.title_ar : event.title_en) || event.title_en || event.title_ar || ''
            const description = (locale === 'ar' ? event.description_ar : event.description_en) || event.description_en || event.description_ar || ''
            const images = Array.isArray(event.images) ? event.images.filter(Boolean) : []

            return (
              <motion.div
                key={event.id || index}
                className="event-card glass-card"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.12 }}
              >
                {/* ── Gallery (left / top on mobile) ── */}
                <EventGallery images={images} title={title} />

                {/* ── Content (right / bottom on mobile) ── */}
                <div className="event-content">
                  <div className="event-header-row">
                    <h3 className="event-title">{title}</h3>
                    <div className="event-inline-socials">
                      {event.socials?.facebook && event.socials.facebook !== '#' && (
                        <a
                          href={event.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="event-inline-social-btn facebook"
                          aria-label="Facebook"
                        >
                          <FaFacebookF />
                        </a>
                      )}
                      {event.socials?.instagram && event.socials.instagram !== '#' && (
                        <a
                          href={event.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="event-inline-social-btn instagram"
                          aria-label="Instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}
                      {event.socials?.github && event.socials.github !== '#' && (
                        <a
                          href={event.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="event-inline-social-btn github"
                          aria-label="GitHub"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {event.socials?.linkedin && event.socials.linkedin !== '#' && (
                        <a
                          href={event.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="event-inline-social-btn linkedin"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="event-desc">{description}</p>

                  <div className="event-meta-list">
                    {event.date && (
                      <div className="event-meta-item">
                        <FiCalendar className="event-meta-icon" />
                        <span>{event.date}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="event-meta-item">
                        <FiMapPin className="event-meta-icon" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="event-meta-item">
                        <FiCamera className="event-meta-icon" />
                        <span>
                          {images.length} {locale === 'ar' ? 'صور' : images.length === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>
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

export default Events
