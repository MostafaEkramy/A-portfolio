import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiUser, FiMapPin, FiBook, FiAward } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './About.css'

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const isAr = locale === 'ar'

  const infoItems = [
    { icon: <FiUser />, label: t('aboutLabelName'), value: isAr ? content.about.name_ar : content.about.name_en },
    { icon: <FiAward />, label: t('aboutLabelUniversity'), value: isAr ? content.about.university_ar : content.about.university_en },
    { icon: <FiBook />, label: t('aboutLabelFaculty'), value: isAr ? content.about.faculty_ar : content.about.faculty_en },
    { icon: <FiMapPin />, label: t('aboutLabelLocation'), value: isAr ? content.about.location_ar : content.about.location_en },
  ]

  const timeline = (content.about.timeline || []).map((entry) => ({
    id: entry.id,
    title: isAr ? entry.title_ar : entry.title_en,
    subtitle: isAr ? entry.subtitle_ar : entry.subtitle_en,
    period: isAr ? entry.period_ar : entry.period_en,
    description: isAr ? entry.desc_ar : entry.desc_en,
  }))

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="about-bg-circle" />
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>{t('aboutTitle')}</h2>
          <div className="underline" />
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="about-info"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="about-text">{isAr ? content.about.text_ar : content.about.text_en}</p>
            <div className="about-info-grid">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="about-info-item glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <span className="about-info-icon">{item.icon}</span>
                  <div>
                    <span className="about-info-label">{item.label}</span>
                    <span className="about-info-value">{item.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="about-timeline"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="about-timeline-title">{t('aboutEduTitle')}</h3>
            <div className="timeline">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  className="timeline-item glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                >
                  <div className="timeline-dot" />
                  <span className="timeline-period">{item.period}</span>
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-subtitle">{item.subtitle}</p>
                  <p className="timeline-desc">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
