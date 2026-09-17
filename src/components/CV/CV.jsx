import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone, FiPrinter, FiArrowLeft, FiFileText } from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './CV.css'

const getLocaleData = (cv, locale) => cv?.[locale] || cv?.en || {}

const CV = () => {
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const { content } = usePortfolioContent()
  const cv = content.cv || {}
  const data = getLocaleData(cv, locale)
  const contact = cv.contact || {}

  const contactItems = [
    {
      icon: <FiMail />,
      value: contact.email,
      href: contact.email ? `mailto:${contact.email}` : '#',
    },
    {
      icon: <FiPhone />,
      value: contact.phone,
      href: contact.phoneHref || '#',
    },
    {
      icon: <FiMapPin />,
      value: locale === 'ar' ? contact.location_ar : contact.location_en,
      href: '#',
    },
    {
      icon: <FiLinkedin />,
      value: contact.linkedinLabel || 'LinkedIn Profile',
      href: contact.linkedin || '#',
    },
    {
      icon: <FiGithub />,
      value: contact.githubLabel || 'GitHub Profile',
      href: contact.github || '#',
    },
  ].filter((item) => item.value)

  const handleFullCvClick = () => {
    if (cv.fullCvUrl) {
      if (cv.fullCvUrl.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = cv.fullCvUrl
        link.download = 'Ahmed_EL_Saeed_CV.pdf'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(cv.fullCvUrl, '_blank', 'noopener,noreferrer')
      }
    } else {
      window.print()
    }
  }

  const handleAtsCvClick = () => {
    if (cv.atsCvUrl) {
      if (cv.atsCvUrl.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = cv.atsCvUrl
        link.download = 'Ahmed_EL_Saeed_ATS_Resume.pdf'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(cv.atsCvUrl, '_blank', 'noopener,noreferrer')
      }
    } else {
      window.print()
    }
  }

  return (
    <section className="cv-page section">
      <div className="container">
        <div className="cv-actions no-print">
          <button className="btn-outline cv-back-btn" onClick={() => navigate('/')} type="button">
            <FiArrowLeft /> {t('cvBack')}
          </button>

          <div className="cv-actions-right">
            <button className="cv-ats-btn" onClick={handleAtsCvClick} type="button">
              <FiFileText /> {t('cvAtsBtn')}
            </button>
            <button className="cv-download-btn" onClick={handleFullCvClick} type="button">
              <FiPrinter /> {data.downloadText || t('cvDownload')}
            </button>
          </div>
        </div>

        <motion.div
          className="cv-document glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cv-header">
            <div className="cv-header-text">
              <h1>{data.name}</h1>
              <h3>{data.subtitle}</h3>
            </div>
            <div className="cv-contact-grid">
              {contactItems.map((item, index) => (
                <div key={`${item.value}-${index}`} className="cv-contact-item">
                  <span className="cv-contact-icon">{item.icon}</span>
                  {item.href !== '#' ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">{item.value}</a>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="cv-divider" />

          <div className="cv-grid">
            <div className="cv-col-left">
              <div className="cv-section">
                <h4 className="cv-section-title">{data.summaryTitle}</h4>
                <p className="cv-summary-text">{data.summaryText}</p>
              </div>

              <div className="cv-section">
                <h4 className="cv-section-title">{data.educationTitle}</h4>
                <div className="cv-edu-list">
                  {(data.educationList || []).map((edu, index) => (
                    <div key={edu.id || index} className="cv-edu-item">
                      <div className="cv-edu-header">
                        <h5>{edu.degree}</h5>
                        <span className="cv-period">{edu.period}</span>
                      </div>
                      <p className="cv-school">{edu.school}</p>
                      <p className="cv-desc">{edu.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cv-section">
                <h4 className="cv-section-title">{data.skillsTitle}</h4>
                <div className="cv-skills-list">
                  {(data.skillsList || []).map((skillGroup, index) => (
                    <div key={skillGroup.id || index} className="cv-skill-group">
                      <h5>{skillGroup.category}</h5>
                      <div className="cv-tags">
                        {(skillGroup.items || []).map((item, key) => (
                          <span key={`${item}-${key}`} className="cv-tag">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cv-col-right">
              <div className="cv-section">
                <h4 className="cv-section-title">{data.projectsTitle}</h4>
                <div className="cv-projects-list">
                  {(data.projectsList || []).map((proj, index) => (
                    <div key={proj.id || index} className="cv-project-item">
                      <h5>{proj.title}</h5>
                      <span className="cv-project-tech">{proj.tech}</span>
                      <p className="cv-desc">{proj.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cv-section">
                <h4 className="cv-section-title">{data.certsTitle}</h4>
                <div className="cv-certs-list">
                  {(data.certsList || []).map((cert, index) => (
                    <div key={cert.id || index} className="cv-cert-item">
                      <div className="cv-cert-header">
                        <h5>{cert.title}</h5>
                        <span className="cv-cert-date">{cert.date}</span>
                      </div>
                      <p className="cv-school">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cv-section">
                <h4 className="cv-section-title">{data.achievementsTitle}</h4>
                <div className="cv-ach-list">
                  {(data.achievementsList || []).map((ach, index) => (
                    <div key={ach.id || index} className="cv-ach-item">
                      <h5>{ach.title}</h5>
                      <p className="cv-desc">{ach.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CV
