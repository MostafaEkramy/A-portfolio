import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaBootstrap,
  FaJava,
  FaDocker,
  FaFigma,
  FaDatabase,
  FaAws,
  FaAngular,
  FaVuejs,
  FaSass,
  FaPhp,
  FaLinux,
  FaNpm,
} from 'react-icons/fa'
import {
  SiCplusplus,
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiTailwindcss,
  SiMongodb,
  SiFirebase,
  SiGraphql,
  SiRedux,
  SiPostgresql,
  SiMysql,
  SiFlutter,
  SiDart,
  SiKotlin,
  SiSwift,
  SiRust,
  SiGo,
  SiDjango,
  SiLaravel,
  SiVercel,
  SiNetlify,
  SiWebpack,
  SiVite,
  SiPostman,
  SiJest,
} from 'react-icons/si'
import {
  FiCode,
  FiUsers,
  FiAward,
  FiMessageSquare,
  FiClock,
  FiRefreshCw,
  FiBookOpen,
  FiCpu,
  FiZap,
  FiTarget,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiSmile,
  FiEye,
  FiCompass,
  FiLayers,
} from 'react-icons/fi'
import { useTranslation } from '../../context/TranslationContext'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import './Skills.css'

/* ───────────────────────────────────────────
   Icon resolver — maps skill name to icon
   ─────────────────────────────────────────── */
const techIconMap = {
  'html': <FaHtml5 />,
  'html5': <FaHtml5 />,
  'css': <FaCss3Alt />,
  'css3': <FaCss3Alt />,
  'javascript': <FaJs />,
  'js': <FaJs />,
  'typescript': <SiTypescript />,
  'ts': <SiTypescript />,
  'react': <FaReact />,
  'react.js': <FaReact />,
  'reactjs': <FaReact />,
  'next.js': <SiNextdotjs />,
  'nextjs': <SiNextdotjs />,
  'next': <SiNextdotjs />,
  'node.js': <FaNodeJs />,
  'nodejs': <FaNodeJs />,
  'node': <FaNodeJs />,
  'express': <SiExpress />,
  'express.js': <SiExpress />,
  'expressjs': <SiExpress />,
  'python': <FaPython />,
  'c/c++': <SiCplusplus />,
  'c++': <SiCplusplus />,
  'cpp': <SiCplusplus />,
  'git': <FaGitAlt />,
  'github': <FaGithub />,
  'tailwind': <SiTailwindcss />,
  'tailwind css': <SiTailwindcss />,
  'tailwindcss': <SiTailwindcss />,
  'bootstrap': <FaBootstrap />,
  'sass': <FaSass />,
  'scss': <FaSass />,
  'mongodb': <SiMongodb />,
  'mongo': <SiMongodb />,
  'firebase': <SiFirebase />,
  'graphql': <SiGraphql />,
  'redux': <SiRedux />,
  'postgresql': <SiPostgresql />,
  'postgres': <SiPostgresql />,
  'mysql': <SiMysql />,
  'sql': <FaDatabase />,
  'database': <FaDatabase />,
  'java': <FaJava />,
  'docker': <FaDocker />,
  'figma': <FaFigma />,
  'aws': <FaAws />,
  'angular': <FaAngular />,
  'vue': <FaVuejs />,
  'vue.js': <FaVuejs />,
  'vuejs': <FaVuejs />,
  'php': <FaPhp />,
  'linux': <FaLinux />,
  'npm': <FaNpm />,
  'flutter': <SiFlutter />,
  'dart': <SiDart />,
  'kotlin': <SiKotlin />,
  'swift': <SiSwift />,
  'rust': <SiRust />,
  'go': <SiGo />,
  'golang': <SiGo />,
  'django': <SiDjango />,
  'laravel': <SiLaravel />,
  'vercel': <SiVercel />,
  'netlify': <SiNetlify />,
  'webpack': <SiWebpack />,
  'vite': <SiVite />,
  'postman': <SiPostman />,
  'jest': <SiJest />,
}

const getTechIcon = (name) => {
  const lower = name.toLowerCase().trim()
  return techIconMap[lower] || <FiCode />
}

const softIconMap = {
  'problem': <FiCpu />,
  'team': <FiUsers />,
  'communicat': <FiMessageSquare />,
  'lead': <FiAward />,
  'time': <FiClock />,
  'critic': <FiTarget />,
  'adapt': <FiRefreshCw />,
  'learn': <FiBookOpen />,
  'creativ': <FiStar />,
  'organiz': <FiLayers />,
  'motiv': <FiTrendingUp />,
  'passion': <FiHeart />,
  'attention': <FiEye />,
  'confiden': <FiShield />,
  'positive': <FiSmile />,
  'decision': <FiCompass />,
}

const getSoftIcon = (nameEn) => {
  const lower = (nameEn || '').toLowerCase()
  for (const [key, icon] of Object.entries(softIconMap)) {
    if (lower.includes(key)) return icon
  }
  return <FiZap />
}

/* ───────────────────────────────────────────
   Category metadata for subcategory headers
   ─────────────────────────────────────────── */
const techCategories = [
  { key: 'frontend', label_en: 'Frontend', label_ar: 'واجهات الويب' },
  { key: 'backend', label_en: 'Backend', label_ar: 'البرمجيات الخلفية' },
  { key: 'languages', label_en: 'Programming Languages', label_ar: 'لغات البرمجة' },
  { key: 'tools', label_en: 'Tools & Technologies', label_ar: 'الأدوات والتقنيات' },
]

/* ─── Animation variants ─── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

/* ─── Skill Badge Component ─── */
const SkillBadge = ({ icon, name }) => (
  <motion.div className="skill-badge" variants={fadeUp} whileHover={{ y: -5, scale: 1.04 }}>
    <span className="skill-badge-icon">{icon}</span>
    <span className="skill-badge-name">{name}</span>
  </motion.div>
)

/* ─── Soft Skill Card Component ─── */
const SoftSkillCard = ({ icon, name }) => (
  <motion.div className="soft-skill-card" variants={fadeUp} whileHover={{ y: -6, scale: 1.03 }}>
    <span className="soft-skill-icon">{icon}</span>
    <span className="soft-skill-name">{name}</span>
  </motion.div>
)

/* ═══════════════════════════════════════════
   Main Skills Component
   ═══════════════════════════════════════════ */
const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  const { locale } = useTranslation()
  const { content } = usePortfolioContent()
  const [activeTab, setActiveTab] = useState('all')

  const technical = content.skills?.technical || []
  const soft = content.skills?.soft || []

  const tabs = [
    { key: 'all', label_en: 'All Skills', label_ar: 'كل المهارات' },
    { key: 'technical', label_en: 'Technical', label_ar: 'التقنية' },
    { key: 'soft', label_en: 'Soft Skills', label_ar: 'الشخصية' },
  ]

  const sectionTitle = locale === 'ar' ? 'المهارات والخبرات' : 'Skills & Expertise'

  /* ─── Render Technical Skills Block ─── */
  const renderTechnicalBlock = (animateWhenInView) => (
    <div className="skills-block">
      <div className="skills-block-header">
        <FiCode className="skills-block-header-icon" />
        <h3>{locale === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}</h3>
      </div>
      {techCategories.map((cat) => {
        const items = technical.filter((s) => s.category === cat.key)
        if (items.length === 0) return null
        return (
          <div key={cat.key} className="skills-subcategory">
            <h4 className="skills-subcategory-label">
              {locale === 'ar' ? cat.label_ar : cat.label_en}
            </h4>
            <motion.div
              className="skills-badge-grid"
              variants={stagger}
              initial="hidden"
              animate={animateWhenInView ? (inView ? 'visible' : 'hidden') : 'visible'}
            >
              {items.map((skill) => (
                <SkillBadge key={skill.id} icon={getTechIcon(skill.name)} name={skill.name} />
              ))}
            </motion.div>
          </div>
        )
      })}
    </div>
  )

  /* ─── Render Soft Skills Block ─── */
  const renderSoftBlock = (animateWhenInView) => (
    <div className="skills-block">
      <div className="skills-block-header">
        <FiZap className="skills-block-header-icon" />
        <h3>{locale === 'ar' ? 'المهارات الشخصية' : 'Soft Skills'}</h3>
      </div>
      <motion.div
        className="soft-skills-grid"
        variants={stagger}
        initial="hidden"
        animate={animateWhenInView ? (inView ? 'visible' : 'hidden') : 'visible'}
      >
        {soft.map((skill) => (
          <SoftSkillCard
            key={skill.id}
            icon={getSoftIcon(skill.name_en)}
            name={locale === 'ar' ? skill.name_ar : skill.name_en}
          />
        ))}
      </motion.div>
    </div>
  )

  return (
    <section id="skills" className="section skills" ref={ref}>
      <div className="container">
        {/* ─── Section Title ─── */}
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>{sectionTitle}</h2>
          <div className="underline skills-underline" />
        </motion.div>

        {/* ─── Filter Tabs ─── */}
        <motion.div
          className="skills-tab-bar"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`skills-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {locale === 'ar' ? tab.label_ar : tab.label_en}
            </button>
          ))}
        </motion.div>

        {/* ─── Content ─── */}
        <AnimatePresence mode="wait">
          {activeTab === 'all' && (
            <motion.div
              key="all"
              className="skills-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              {renderTechnicalBlock(true)}
              {renderSoftBlock(true)}
            </motion.div>
          )}

          {activeTab === 'technical' && (
            <motion.div
              key="technical"
              className="skills-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              {renderTechnicalBlock(false)}
            </motion.div>
          )}

          {activeTab === 'soft' && (
            <motion.div
              key="soft"
              className="skills-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              {renderSoftBlock(false)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Skills
