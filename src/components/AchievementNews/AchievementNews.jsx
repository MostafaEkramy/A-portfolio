import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiAward, FiExternalLink, FiCalendar, FiMapPin, FiBook, FiUser } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import './AchievementNews.css'

/* ── Single configurable URL ── */
const officialNewsURL = "https://www.facebook.com/share/1Duvz3G34M/"

const AchievementNews = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { locale } = useTranslation()

  useEffect(() => {
    document.title = locale === 'ar'
      ? 'أحمد السعيد – المركز الثالث في مسابقة الطالب المثالي | جامعة المنصورة الأهلية'
      : 'Ahmed El Saeed Wins Third Place in the Ideal Student Competition | Mansoura National University'
  }, [locale])

  const content = {
    en: {
      badge: 'Official Achievement',
      title: 'Ahmed El Saeed Wins Third Place in the Ideal Student Competition',
      subtitle: 'Mansoura National University – Faculty of Engineering',
      description: 'Ahmed El Saeed achieved Third Place in the Ideal Student Competition held at Mansoura National University, representing the Faculty of Engineering. This recognition highlights academic excellence, leadership qualities, and community engagement.',
      details: [
        { icon: <FiUser />, label: 'Student', value: 'Ahmed El Saeed' },
        { icon: <FiMapPin />, label: 'University', value: 'Mansoura National University' },
        { icon: <FiBook />, label: 'Faculty', value: 'Faculty of Engineering' },
        { icon: <FiAward />, label: 'Achievement', value: 'Third Place – Ideal Student Competition' },
        { icon: <FiCalendar />, label: 'Date', value: 'July 2026' },
      ],
      btnText: 'Read Official News',
      sourceNote: 'This achievement was officially announced by Mansoura National University on their official Facebook page.',
    },
    ar: {
      badge: 'إنجاز رسمي',
      title: 'أحمد السعيد يحصد المركز الثالث في مسابقة الطالب المثالي',
      subtitle: 'جامعة المنصورة الأهلية – كلية الهندسة',
      description: 'حصل أحمد السعيد على المركز الثالث في مسابقة الطالب المثالي التي أقيمت بجامعة المنصورة الأهلية، ممثلاً كلية الهندسة. يعكس هذا التكريم التفوق الأكاديمي والقيادة والمشاركة المجتمعية.',
      details: [
        { icon: <FiUser />, label: 'الطالب', value: 'أحمد السعيد' },
        { icon: <FiMapPin />, label: 'الجامعة', value: 'جامعة المنصورة الأهلية' },
        { icon: <FiBook />, label: 'الكلية', value: 'كلية الهندسة' },
        { icon: <FiAward />, label: 'الإنجاز', value: 'المركز الثالث – مسابقة الطالب المثالي' },
        { icon: <FiCalendar />, label: 'التاريخ', value: 'يوليو 2026' },
      ],
      btnText: 'اقرأ الخبر الرسمي',
      sourceNote: 'تم الإعلان عن هذا الإنجاز رسمياً من قبل جامعة المنصورة الأهلية عبر صفحتها الرسمية على فيسبوك.',
    },
  }

  const c = content[locale] || content.en

  return (
    <section className="achievement-news-page section" ref={ref}>
      <div className="container">
        <motion.article
          className="achievement-news-card glass-card"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
          {/* Badge */}
          <motion.div
            className="achievement-news-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FiAward className="achievement-news-badge-icon" />
            <span>{c.badge}</span>
          </motion.div>

          {/* Title */}
          <h1 className="achievement-news-title" itemProp="headline">{c.title}</h1>
          <p className="achievement-news-subtitle">{c.subtitle}</p>

          {/* Description */}
          <p className="achievement-news-desc" itemProp="description">{c.description}</p>

          {/* Details Grid */}
          <div className="achievement-news-details">
            {c.details.map((detail, i) => (
              <motion.div
                key={i}
                className="achievement-news-detail-item"
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              >
                <span className="achievement-news-detail-icon">{detail.icon}</span>
                <div>
                  <span className="achievement-news-detail-label">{detail.label}</span>
                  <span className="achievement-news-detail-value">{detail.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Source Note */}
          <p className="achievement-news-source">{c.sourceNote}</p>

          {/* CTA Button */}
          <motion.a
            href={officialNewsURL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary achievement-news-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            itemProp="mainEntityOfPage"
          >
            <FiExternalLink />
            {c.btnText}
          </motion.a>

          {/* Hidden structured data */}
          <meta itemProp="datePublished" content="2026-07-01" />
          <meta itemProp="dateModified" content="2026-07-04" />
          <span itemProp="author" itemScope itemType="https://schema.org/Organization" style={{ display: 'none' }}>
            <meta itemProp="name" content="Mansoura National University" />
          </span>
        </motion.article>
      </div>
    </section>
  )
}

export default AchievementNews
