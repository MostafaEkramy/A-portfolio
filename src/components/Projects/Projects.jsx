import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiCamera, FiExternalLink, FiX, FiSearch } from 'react-icons/fi'
import { FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Projects.css'

/* ─── Image Lightbox Modal ─── */
const ImageLightbox = ({ images, activeIndex, title, onClose, onPrev, onNext, onSelect, t }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <FiX size={24} />
        </button>

        {/* Main Image Area */}
        <div className="lightbox-main">
          {/* Left Arrow */}
          {images.length > 1 && (
            <button className="lightbox-arrow lightbox-arrow--left" onClick={onPrev} aria-label="Previous">
              <FiChevronLeft size={32} />
            </button>
          )}

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${title} - ${activeIndex + 1}`}
              className="lightbox-image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>

          {/* Right Arrow */}
          {images.length > 1 && (
            <button className="lightbox-arrow lightbox-arrow--right" onClick={onNext} aria-label="Next">
              <FiChevronRight size={32} />
            </button>
          )}
        </div>

        {/* Bottom Info */}
        <div className="lightbox-info">
          <h3 className="lightbox-title">{title}</h3>
          <span className="lightbox-counter">
            {activeIndex + 1} {t('projectsOf')} {images.length}
          </span>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="lightbox-thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                className={`lightbox-thumb ${i === activeIndex ? 'active' : ''}`}
                onClick={() => onSelect(i)}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Project Card ─── */
const ProjectCard = ({ project, index, inView, locale, t, onImageClick }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const title = (locale === 'ar' ? project.title_ar : project.title_en) || project.title_en || project.title_ar || ''
  const description = (locale === 'ar' ? project.description_ar : project.description_en) || project.description_en || project.description_ar || ''
  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : []
  const hasMultiple = images.length > 1
  const tags = Array.isArray(project.tags) ? project.tags : []
  const category = project.category || ''

  const goTo = (idx) => {
    if (idx < 0) setActiveIndex(images.length - 1)
    else if (idx >= images.length) setActiveIndex(0)
    else setActiveIndex(idx)
  }

  const handleImageClick = () => {
    if (images.length > 0) {
      onImageClick(images, activeIndex, title)
    }
  }

  return (
    <motion.div
      className="project-card glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12 }}
    >
      {/* Gallery Top */}
      <div className="project-gallery" onClick={handleImageClick}>
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
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1) }}
              aria-label="Previous image"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              className="project-gallery-arrow project-gallery-arrow--right"
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1) }}
              aria-label="Next image"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Content Bottom */}
      <div className="project-content">
        {/* Category Badge */}
        {category && (
          <span className="project-category-badge">{category}</span>
        )}

        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>

        {/* Tech Tags */}
        {tags.length > 0 && (
          <div className="project-tags">
            {tags.map((tag, i) => (
              <span key={i} className="project-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="project-actions">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn project-action-btn--demo"
            >
              <FiExternalLink size={14} />
              {t('projectsLiveDemo')}
            </a>
          )}
          {project.socials?.linkedin && project.socials.linkedin !== '#' && (
            <a
              href={project.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn project-action-btn--linkedin"
            >
              <FaLinkedinIn size={14} />
              LinkedIn
            </a>
          )}
          {project.socials?.facebook && project.socials.facebook !== '#' && (
            <a
              href={project.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn project-action-btn--social"
            >
              <FaFacebookF size={13} />
            </a>
          )}
          {project.socials?.instagram && project.socials.instagram !== '#' && (
            <a
              href={project.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn project-action-btn--social"
            >
              <FaInstagram size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Projects Page ─── */
const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const projects = content.projects || []

  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0, title: '' })

  const openLightbox = useCallback((images, index, title) => {
    setLightbox({ open: true, images, index, title })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(prev => ({ ...prev, open: false }))
  }, [])

  const lightboxPrev = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      index: prev.index <= 0 ? prev.images.length - 1 : prev.index - 1,
    }))
  }, [])

  const lightboxNext = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      index: prev.index >= prev.images.length - 1 ? 0 : prev.index + 1,
    }))
  }, [])

  const lightboxSelect = useCallback((i) => {
    setLightbox(prev => ({ ...prev, index: i }))
  }, [])

  // Get unique categories for filter tabs
  const categories = useMemo(() => {
    const cats = new Set()
    projects.forEach(p => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats)
  }, [projects])

  // Filter & search
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Category filter
      if (activeFilter !== 'all') {
        if (p.category !== activeFilter) return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const title = ((locale === 'ar' ? p.title_ar : p.title_en) || p.title_en || '').toLowerCase()
        const desc = ((locale === 'ar' ? p.description_ar : p.description_en) || p.description_en || '').toLowerCase()
        const tags = (Array.isArray(p.tags) ? p.tags.join(' ') : '').toLowerCase()
        if (!title.includes(q) && !desc.includes(q) && !tags.includes(q)) return false
      }
      return true
    })
  }, [projects, activeFilter, searchQuery, locale])

  return (
    <section id="projects" className="section projects" ref={ref}>
      {/* Floating Code Decorations */}
      <span className="projects-deco projects-deco--1" aria-hidden="true">{'</>'}</span>
      <span className="projects-deco projects-deco--2" aria-hidden="true">git push</span>
      <span className="projects-deco projects-deco--3" aria-hidden="true">async</span>
      <span className="projects-deco projects-deco--4" aria-hidden="true">const</span>

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

        {/* Filter & Search Bar */}
        <motion.div
          className="projects-toolbar"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="projects-filters">
            <button
              className={`projects-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              {t('projectsFilterAll')}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`projects-filter-pill ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="projects-search">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder={t('projectsSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="projects-grid">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                index={index}
                inView={inView}
                locale={locale}
                t={t}
                onImageClick={openLightbox}
              />
            ))}
          </AnimatePresence>
          {filteredProjects.length === 0 && (
            <div className="projects-empty">
              <FiSearch size={40} />
              <p>{t('projectsNoResults')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.open && (
          <ImageLightbox
            images={lightbox.images}
            activeIndex={lightbox.index}
            title={lightbox.title}
            onClose={closeLightbox}
            onPrev={lightboxPrev}
            onNext={lightboxNext}
            onSelect={lightboxSelect}
            t={t}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
