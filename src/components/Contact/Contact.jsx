import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiUser, FiMail, FiEdit3, FiMessageSquare, FiMapPin, FiSend, FiCheck } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { useTranslation } from '../../context/TranslationContext'
import './Contact.css'

const socialLinks = [
  { icon: <FaFacebookF />, href: 'https://www.facebook.com/share/18qRTnK1cF/', label: 'Facebook' },
  { icon: <FaInstagram />, href: 'https://www.instagram.com/ahmed_el_saeed_1', label: 'Instagram' },
  { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/in/ahmed-el-saeed-01b927330', label: 'LinkedIn' },
  { icon: <FaWhatsapp />, href: 'https://wa.me/201061931040', label: 'WhatsApp' },
]

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const { t } = useTranslation()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const formattedMessage = `*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message}`
    const whatsappUrl = `https://wa.me/201061931040?text=${encodeURIComponent(formattedMessage)}`
    
    window.open(whatsappUrl, '_blank')

    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section id="contact" className="section contact" ref={ref}>
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>{t('contactTitle')}</h2>
          <div className="underline" />
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-form-wrapper glass-card"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('contactLabelName')}</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('contactPlaceholderName')} required />
                </div>
              </div>
              <div className="form-group">
                <label>{t('contactLabelEmail')}</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('contactPlaceholderEmail')} required />
                </div>
              </div>
              <div className="form-group">
                <label>{t('contactLabelSubject')}</label>
                <div className="input-wrapper">
                  <FiEdit3 className="input-icon" />
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder={t('contactPlaceholderSubject')} required />
                </div>
              </div>
              <div className="form-group">
                <label>{t('contactLabelMessage')}</label>
                <div className="input-wrapper textarea-wrapper">
                  <FiMessageSquare className="input-icon" />
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder={t('contactPlaceholderMessage')} rows="5" required />
                </div>
              </div>
              <button type="submit" className="btn-primary contact-submit">
                {sent ? <><FiCheck /> {t('contactBtnSent')}</> : <><FiSend /> {t('contactBtnSend')}</>}
              </button>
            </form>
          </motion.div>

          <motion.div
            className="contact-info-wrapper"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="contact-info glass-card">
              <h3 className="contact-info-title">{t('contactGetInTouch')}</h3>
              <p className="contact-info-text">{t('contactDesc')}</p>
              <div className="contact-info-items">
                <a href="https://wa.me/201061931040" className="contact-info-item" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="contact-info-icon" />
                  <div>
                    <span className="contact-info-label">WhatsApp</span>
                    <span className="contact-info-value">+20 10 61931040</span>
                  </div>
                </a>
                <a href="mailto:ahmedelsaeed2666@gmail.com" className="contact-info-item">
                  <FiMail className="contact-info-icon" />
                  <div>
                    <span className="contact-info-label">{t('contactLabelEmail')}</span>
                    <span className="contact-info-value">ahmedelsaeed2666@gmail.com</span>
                  </div>
                </a>
                <div className="contact-info-item">
                  <FiMapPin className="contact-info-icon" />
                  <div>
                    <span className="contact-info-label">Location</span>
                    <span className="contact-info-value">Mansoura, Egypt</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-socials glass-card">
              <h4>{t('contactFollowMe')}</h4>
              <div className="contact-social-icons">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-icon"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
