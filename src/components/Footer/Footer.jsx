import { NavLink } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaHeart } from 'react-icons/fa'
import { useTranslation } from '../../context/TranslationContext'
import './Footer.css'

const socialLinks = [
  { icon: <FaFacebookF />, href: 'https://www.facebook.com/share/18qRTnK1cF/' },
  { icon: <FaInstagram />, href: 'https://www.instagram.com/ahmed_el_saeed_1' },
  { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/in/ahmed-el-saeed-01b927330' },
  { icon: <FaWhatsapp />, href: 'https://wa.me/201061931040' },
]

const Footer = () => {
  const { t } = useTranslation()

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navCV'), path: '/cv' },
    { name: t('navProjects'), path: '/projects' },
    { name: t('navAchievements'), path: '/achievements' },
    { name: t('navEvents'), path: '/events' },
    { name: t('navCertifications'), path: '/certifications' },
    { name: t('navContact'), path: '/contact' },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-name">Ahmed EL Saeed</h3>
            <p className="footer-tagline">Engineering Student | Future Software Engineer</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <div className="footer-links-grid">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="footer-link"
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="footer-social">
            <h4>Connect</h4>
            <div className="footer-social-icons">
              {socialLinks.map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-flex">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} Ahmed EL Saeed. {t('footerCopyright')}
            </p>
            <NavLink to="/admin" className="footer-admin-btn">
              Admin Area
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
