import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiAward, FiFolder, FiTarget, FiClock, FiStar, FiTrendingUp, FiUsers, FiHeart } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Achievements.css'

const iconMap = {
  award: <FiAward />,
  folder: <FiFolder />,
  target: <FiTarget />,
  clock: <FiClock />,
  star: <FiStar />,
  'trending-up': <FiTrendingUp />,
  users: <FiUsers />,
  heart: <FiHeart />,
}

const Counter = ({ value, suffix, inView }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = value
    const duration = 1500
    const stepTime = duration / end
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, stepTime)
    return () => clearInterval(timer)
  }, [inView, value])
  return <span className="stat-value">{count}{suffix}</span>
}

const Achievements = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const achievementsData = content.achievements || {}
  const stats = achievementsData.stats || []
  const items = achievementsData.items || []

  return (
    <section id="achievements" className="section achievements" ref={ref}>
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>{t('achievementsTitle')}</h2>
          <div className="underline" />
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id || index}
              className="stat-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="stat-icon">{iconMap[stat.icon] || <FiAward />}</span>
              <Counter value={Number(stat.value) || 0} suffix={stat.suffix || ''} inView={inView} />
              <span className="stat-label">{locale === 'ar' ? stat.label_ar : stat.label_en}</span>
            </motion.div>
          ))}
        </div>

        <div className="achievements-timeline">
          {[...items]
            .sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0))
            .map((item, index) => {
              const title = (locale === 'ar' ? item.title_ar : item.title_en) || item.title_en || item.title_ar || ''
              const description = (locale === 'ar' ? item.description_ar : item.description_en) || item.description_en || item.description_ar || ''
            return (
              <motion.div
                key={item.id || index}
                className={`achievement-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
              >
                <div className="achievement-card glass-card">
                  <div className="achievement-year">{item.year}</div>
                  <span className="achievement-icon">{iconMap[item.icon] || <FiStar />}</span>
                  <h4 className="achievement-title">{title}</h4>
                  <p className="achievement-desc">{description}</p>
                </div>
                <div className="achievement-dot" />
              </motion.div>
            )
          })}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  )
}

export default Achievements
