import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiCalendar, FiCamera } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Projects.css'

const ProjectCard = ({ project, index, inView, locale }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const title = (locale === 'ar' ? project.title_ar : project.title_en) || project.title_en || project.title_ar || ''
  const description = (locale === 'ar' ? project.description_ar : project.description_en) || project.description_en || project.description_ar || ''
  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : []
  const hasMultiple = images.length > 1

  const goTo = (idx) => {
    if (idx < 0) setActiveIndex(images.length - 1)
    else if (idx >= images.length) setActiveIndex(0)
    else setActiveIndex(idx)
  }

  return (
    <motion.div
      className="project-card glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12 }}
    >
      {/* Gallery Side */}
      <div className="project-gallery">
        {images.length === 0 && (
          <div className="project-gallery-placeholder">
            <FiCamera size={28} />
            <span>{locale === 'ar' ? 'لا توجد صور' : 'No images'}</span>
          </div>
        )}

        {images.map((img, i) => (
          <img
            key={`${img}-${i}`}
            src={img}
            alt={title}
            className={`project-gallery-img ${i === activeIndex ? 'active' : ''}`}
          />
        ))}

        {/* Image Counter Badge */}
        {images.length > 0 && (
          <div className="project-gallery-counter">
            <FiCamera size={11} />
            <span>{activeIndex + 1} / {images.length}</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultiple && (
          <>
            <button
              className="project-gallery-arrow project-gallery-arrow--left"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              className="project-gallery-arrow project-gallery-arrow--right"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {hasMultiple && (
          <div className="project-gallery-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`project-gallery-dot ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Side */}
      <div className="project-content">
        {project.date && (
          <div className="project-date-badge">
            <FiCalendar size={13} />
            <span>{project.date}</span>
          </div>
        )}

        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>

        {/* Photo Count Indicator */}
        {images.length > 0 && (
          <div className="project-photo-count">
            <FiCamera size={14} />
            <span>
              {images.length} {locale === 'ar' ? 'صور' : images.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>
        )}

        <div className="project-social-links">
          {project.socials?.instagram && project.socials.instagram !== '#' && (
            <a href={project.socials.instagram} target="_blank" rel="noopener noreferrer" className="project-social-btn instagram" aria-label="Instagram">
              <FaInstagram />
            </a>
          )}
          {project.socials?.facebook && project.socials.facebook !== '#' && (
            <a href={project.socials.facebook} target="_blank" rel="noopener noreferrer" className="project-social-btn facebook" aria-label="Facebook">
              <FaFacebookF />
            </a>
          )}
          {project.socials?.linkedin && project.socials.linkedin !== '#' && (
            <a href={project.socials.linkedin} target="_blank" rel="noopener noreferrer" className="project-social-btn linkedin" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const projects = content.projects || []

  return (
    <section id="projects" className="section projects" ref={ref}>
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>{t('projectsTitle')}</h2>
          <div className="underline" />
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || index}
              project={project}
              index={index}
              inView={inView}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
