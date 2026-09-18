import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {
  FiAlertCircle,
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiFileText,
  FiGrid,
  FiHome,
  FiImage,
  FiLink,
  FiLock,
  FiLogIn,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSettings,
  FiShield,
  FiStar,
  FiTrash2,
  FiTrendingUp,
  FiUploadCloud,
  FiUser,
  FiX,
  FiZap,
} from 'react-icons/fi'
import { cloneDefaultContent } from '../../data/defaultContent'
import { usePortfolioContent } from '../../hooks/usePortfolioContent'
import { auth, isFirebaseConfigured, missingFirebaseConfig } from '../../lib/firebase'
import { savePortfolioContent, uploadPortfolioImage } from '../../services/contentService'
import './AdminPanel.css'

const adminTabs = [
  { key: 'home', label: 'Home', icon: FiHome, desc: 'Hero section & profile image' },
  { key: 'about', label: 'About', icon: FiUser, desc: 'About section & timeline' },
  { key: 'cv', label: 'CV', icon: FiFileText, desc: 'Curriculum vitae content' },
  { key: 'achievements', label: 'Achievements', icon: FiTrendingUp, desc: 'Stats & timeline achievements' },
  { key: 'projects', label: 'Projects', icon: FiGrid, desc: 'Project cards & images' },
  { key: 'events', label: 'Events', icon: FiCalendar, desc: 'Event cards & images' },
  { key: 'certifications', label: 'Certificates', icon: FiAward, desc: 'Certificate cards & images' },
]

const clone = (value) => JSON.parse(JSON.stringify(value))

const createId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const splitLines = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const joinLines = (items) => (Array.isArray(items) ? items : []).join('\n')

const createSocials = () => ({ instagram: '', facebook: '', linkedin: '', github: '' })

const createCardItem = (sectionKey) => {
  const base = {
    id: createId(sectionKey),
    date: '',
    description_en: '',
    description_ar: '',
    images: [],
    socials: createSocials(),
  }

  if (sectionKey === 'certifications') {
    return {
      ...base,
      title: '',
      issuer: '',
      orientation: 'landscape',
    }
  }

  if (sectionKey === 'projects') {
    return {
      ...base,
      title_en: '',
      title_ar: '',
      category: '',
      tags: [],
      liveDemo: '',
    }
  }

  return {
    ...base,
    title_en: '',
    title_ar: '',
  }
}

const Field = ({ label, value, onChange, textarea = false, className = '', ...inputProps }) => (
  <label className={`admin-field ${className}`}>
    <span>{label}</span>
    {textarea ? (
      <textarea
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        {...inputProps}
      />
    ) : (
      <input
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        {...inputProps}
      />
    )}
  </label>
)

const StatusMessage = ({ status }) => {
  if (!status?.text) return null

  const icons = {
    success: FiCheck,
    error: FiAlertCircle,
    warning: FiAlertCircle,
    info: FiZap,
  }

  const Icon = icons[status.type] || FiAlertCircle

  return (
    <div className={`admin-status ${status.type || 'info'}`}>
      <Icon />
      <span>{status.text}</span>
    </div>
  )
}

const SetupNotice = () => (
  <div className="admin-notice">
    <FiSettings />
    <div>
      <h3>Firebase is not configured yet</h3>
      <p>
        Add the missing Vite env values, then restart the dev server:
        {' '}
        {missingFirebaseConfig.join(', ')}.
      </p>
    </div>
  </div>
)

const LoginPanel = ({ credentials, setCredentials, onSubmit, status, isSubmitting }) => (
  <section className="admin-page section">
    <div className="container">
      <div className="admin-login-card">
        <span className="admin-kicker">Admin Panel</span>
        <h1>Welcome Back</h1>
        <p>Sign in with your Firebase credentials to manage your portfolio.</p>

        <form className="admin-login-form" onSubmit={onSubmit}>
          <Field
            label="Email Address"
            type="email"
            value={credentials.email}
            onChange={(email) => setCredentials((prev) => ({ ...prev, email }))}
            autoComplete="email"
            required
          />
          <Field
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(password) => setCredentials((prev) => ({ ...prev, password }))}
            autoComplete="current-password"
            required
          />
          <button className="admin-primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <><FiRefreshCw style={{ animation: 'adminPulse 1s ease infinite' }} /> Signing in...</>
            ) : (
              <><FiLogIn /> Sign in</>
            )}
          </button>
        </form>

        <StatusMessage status={status} />
      </div>
    </div>
  </section>
)

/* ─────────────────────────────────────────────
   HOME EDITOR – Hero section
   ───────────────────────────────────────────── */
const HomeEditor = ({ draft, updateDraft, setStatus, uploadingId, setUploadingId }) => {
  const hero = draft.hero || {}
  const [imgError, setImgError] = useState(false)
  const [uploadMode, setUploadMode] = useState('file')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [hero.profileImage])

  const handleProfileUpload = async (files, event) => {
    const file = files?.[0]
    if (!file) return
    if (!isFirebaseConfigured) {
      setStatus({ type: 'warning', text: 'Configure Firebase first to upload images.' })
      return
    }
    setUploadingId('hero-profile')
    setStatus({ type: 'info', text: 'Compressing and uploading image...' })
    try {
      const url = await uploadPortfolioImage('hero', 'profile', file)
      updateDraft((next) => {
        if (!next.hero) next.hero = {}
        next.hero.profileImage = url
      })
      setStatus({ type: 'success', text: 'Profile image uploaded! Press Save to publish.' })
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Upload failed.' })
    } finally {
      setUploadingId('')
      if (event?.target) event.target.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleProfileUpload(e.dataTransfer.files)
    }
  }

  return (
    <div className="admin-stack">
      {/* Profile Image */}
      <div className="admin-editor-block full">
        <div className="admin-profile-section" style={{ alignItems: 'center' }}>
          <div className="admin-profile-preview" style={{ width: '130px', height: '130px' }}>
            {hero.profileImage && !imgError ? (
              <img src={hero.profileImage} alt="Profile" onError={() => setImgError(true)} />
            ) : (
              <FiUser />
            )}
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="admin-img-uploader-container" style={{ margin: 0 }}>
              <div className="admin-img-uploader-header">
                <div className="admin-img-uploader-title-group">
                  <div className="admin-img-uploader-title">
                    <FiUser />
                    <span>Profile Image</span>
                  </div>
                  <span className="admin-img-uploader-kicker">HERO AVATAR PHOTO</span>
                </div>

                <div className="admin-img-mode-pills">
                  <button
                    type="button"
                    className={`admin-img-pill ${uploadMode === 'file' ? 'active' : ''}`}
                    onClick={() => setUploadMode('file')}
                  >
                    <FiUploadCloud /> Upload File
                  </button>
                  <button
                    type="button"
                    className={`admin-img-pill ${uploadMode === 'url' ? 'active' : ''}`}
                    onClick={() => setUploadMode('url')}
                  >
                    <FiLink /> Image URL
                  </button>
                </div>
              </div>

              {uploadMode === 'file' ? (
                <label
                  className={`admin-img-dropzone-box ${isDragging ? 'dragging' : ''} ${
                    uploadingId === 'hero-profile' ? 'uploading' : ''
                  }`}
                  style={{ padding: '24px 16px' }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProfileUpload(e.target.files, e)}
                    disabled={uploadingId === 'hero-profile'}
                  />
                  <div className="admin-img-dropzone-icon-circle" style={{ width: 40, height: 40, fontSize: '1.2rem' }}>
                    <FiUploadCloud />
                  </div>
                  <div className="admin-img-dropzone-prompt" style={{ fontSize: '0.9rem' }}>
                    {uploadingId === 'hero-profile' ? (
                      <span><FiRefreshCw style={{ animation: 'adminPulse 1s ease infinite' }} /> Uploading profile photo...</span>
                    ) : (
                      <>Drop profile photo here or <span className="admin-img-browse-highlight">click to browse</span></>
                    )}
                  </div>
                  <div className="admin-img-dropzone-sub">JPG, PNG, WebP • Free Cloud Firestore</div>
                </label>
              ) : (
                <div className="admin-img-url-box">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={hero.profileImage || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      updateDraft((next) => {
                        if (!next.hero) next.hero = {}
                        next.hero.profileImage = val
                      })
                    }}
                    className="admin-url-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>Greeting</h3>
        </div>
        <div className="admin-row-grid two">
          <Field
            label="Greeting EN"
            value={hero.greeting_en}
            onChange={(value) => updateDraft((next) => { next.hero.greeting_en = value })}
          />
          <Field
            label="Greeting AR"
            value={hero.greeting_ar}
            onChange={(value) => updateDraft((next) => { next.hero.greeting_ar = value })}
          />
        </div>
      </div>

      {/* Description */}
      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>Description</h3>
        </div>
        <div className="admin-row-grid two">
          <Field
            label="Description EN"
            textarea
            rows="4"
            value={hero.description_en}
            onChange={(value) => updateDraft((next) => { next.hero.description_en = value })}
          />
          <Field
            label="Description AR"
            textarea
            rows="4"
            value={hero.description_ar}
            onChange={(value) => updateDraft((next) => { next.hero.description_ar = value })}
          />
        </div>
      </div>

      {/* Quote */}
      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>Quote</h3>
        </div>
        <div className="admin-row-grid two">
          <Field
            label="Quote EN"
            value={hero.quote_en}
            onChange={(value) => updateDraft((next) => { next.hero.quote_en = value })}
          />
          <Field
            label="Quote AR"
            value={hero.quote_ar}
            onChange={(value) => updateDraft((next) => { next.hero.quote_ar = value })}
          />
        </div>
      </div>

      {/* Roles */}
      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>Roles</h3>
        </div>
        <div className="admin-row-grid two">
          <Field
            label="Roles EN (one per line)"
            textarea
            rows="4"
            value={joinLines(hero.roles_en)}
            onChange={(value) => updateDraft((next) => { next.hero.roles_en = splitLines(value) })}
          />
          <Field
            label="Roles AR (one per line)"
            textarea
            rows="4"
            value={joinLines(hero.roles_ar)}
            onChange={(value) => updateDraft((next) => { next.hero.roles_ar = splitLines(value) })}
          />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ABOUT EDITOR – About section & timeline
   ───────────────────────────────────────────── */
const AboutEditor = ({ draft, updateDraft }) => {
  const about = draft.about || {}

  const addTimelineEntry = () => {
    updateDraft((next) => {
      next.about.timeline = next.about.timeline || []
      next.about.timeline.push({
        id: createId('timeline'),
        title_en: '',
        title_ar: '',
        subtitle_en: '',
        subtitle_ar: '',
        period_en: '',
        period_ar: '',
        desc_en: '',
        desc_ar: '',
      })
    })
  }

  const updateTimeline = (index, field, value) => {
    updateDraft((next) => {
      next.about.timeline[index][field] = value
    })
  }

  const removeTimeline = (index) => {
    updateDraft((next) => {
      next.about.timeline.splice(index, 1)
    })
  }

  return (
    <div className="admin-stack">
      {/* About Text */}
      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>About Text</h3>
        </div>
        <div className="admin-row-grid two">
          <Field
            label="About Text EN"
            textarea
            rows="5"
            value={about.text_en}
            onChange={(value) => updateDraft((next) => { next.about.text_en = value })}
          />
          <Field
            label="About Text AR"
            textarea
            rows="5"
            value={about.text_ar}
            onChange={(value) => updateDraft((next) => { next.about.text_ar = value })}
          />
        </div>
      </div>

      {/* Personal Info */}
      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>Personal Info</h3>
        </div>
        <div className="admin-row-grid two">
          <Field
            label="Name EN"
            value={about.name_en}
            onChange={(value) => updateDraft((next) => { next.about.name_en = value })}
          />
          <Field
            label="Name AR"
            value={about.name_ar}
            onChange={(value) => updateDraft((next) => { next.about.name_ar = value })}
          />
          <Field
            label="University EN"
            value={about.university_en}
            onChange={(value) => updateDraft((next) => { next.about.university_en = value })}
          />
          <Field
            label="University AR"
            value={about.university_ar}
            onChange={(value) => updateDraft((next) => { next.about.university_ar = value })}
          />
          <Field
            label="Faculty EN"
            value={about.faculty_en}
            onChange={(value) => updateDraft((next) => { next.about.faculty_en = value })}
          />
          <Field
            label="Faculty AR"
            value={about.faculty_ar}
            onChange={(value) => updateDraft((next) => { next.about.faculty_ar = value })}
          />
          <Field
            label="Location EN"
            value={about.location_en}
            onChange={(value) => updateDraft((next) => { next.about.location_en = value })}
          />
          <Field
            label="Location AR"
            value={about.location_ar}
            onChange={(value) => updateDraft((next) => { next.about.location_ar = value })}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>Timeline</h3>
          <button className="admin-small-btn" type="button" onClick={addTimelineEntry}>
            <FiPlus /> Add Entry
          </button>
        </div>

        <div className="admin-item-list">
          {(about.timeline || []).map((entry, index) => (
            <div className="admin-row-card" key={entry.id || index}>
              <div className="admin-row-grid two">
                <Field
                  label="Title EN"
                  value={entry.title_en}
                  onChange={(value) => updateTimeline(index, 'title_en', value)}
                />
                <Field
                  label="Title AR"
                  value={entry.title_ar}
                  onChange={(value) => updateTimeline(index, 'title_ar', value)}
                />
                <Field
                  label="Subtitle EN"
                  value={entry.subtitle_en}
                  onChange={(value) => updateTimeline(index, 'subtitle_en', value)}
                />
                <Field
                  label="Subtitle AR"
                  value={entry.subtitle_ar}
                  onChange={(value) => updateTimeline(index, 'subtitle_ar', value)}
                />
                <Field
                  label="Period EN"
                  value={entry.period_en}
                  onChange={(value) => updateTimeline(index, 'period_en', value)}
                />
                <Field
                  label="Period AR"
                  value={entry.period_ar}
                  onChange={(value) => updateTimeline(index, 'period_ar', value)}
                />
                <Field
                  label="Description EN"
                  textarea
                  rows="3"
                  value={entry.desc_en}
                  onChange={(value) => updateTimeline(index, 'desc_en', value)}
                />
                <Field
                  label="Description AR"
                  textarea
                  rows="3"
                  value={entry.desc_ar}
                  onChange={(value) => updateTimeline(index, 'desc_ar', value)}
                />
              </div>
              <button className="admin-icon-danger" type="button" onClick={() => removeTimeline(index)}>
                <FiTrash2 /> Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   CV LIST EDITOR
   ───────────────────────────────────────────── */
const CvListEditor = ({ title, items, fields, onAdd, onChange, onRemove }) => (
  <div className="admin-editor-block full">
    <div className="admin-block-header">
      <h3>{title}</h3>
      <button className="admin-small-btn" type="button" onClick={onAdd}>
        <FiPlus /> Add
      </button>
    </div>

    <div className="admin-item-list">
      {items.map((item, index) => (
        <div className="admin-row-card" key={item.id || index}>
          <div className="admin-row-grid two">
            {fields.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                value={field.lines ? joinLines(item[field.key]) : item[field.key]}
                textarea={field.textarea || field.lines}
                rows={field.rows || (field.textarea || field.lines ? 4 : undefined)}
                onChange={(value) =>
                  onChange(index, field.key, field.lines ? splitLines(value) : value)
                }
              />
            ))}
          </div>
          <button className="admin-icon-danger" type="button" onClick={() => onRemove(index)}>
            <FiTrash2 /> Remove
          </button>
        </div>
      ))}
    </div>
  </div>
)

/* ─────────────────────────────────────────────
   CV EDITOR
   ───────────────────────────────────────────── */
const CVEditor = ({ draft, updateDraft, setStatus, uploadingId, setUploadingId }) => {
  const [cvLocale, setCvLocale] = useState('en')
  const cv = draft.cv || {}
  const data = cv[cvLocale] || {}
  const contact = cv.contact || {}

  const [fullCvInput, setFullCvInput] = useState(cv.fullCvUrl?.startsWith('data:') ? '' : (cv.fullCvUrl || ''))
  const [atsCvInput, setAtsCvInput] = useState(cv.atsCvUrl?.startsWith('data:') ? '' : (cv.atsCvUrl || ''))

  useEffect(() => {
    if (!cv.fullCvUrl?.startsWith('data:')) {
      setFullCvInput(cv.fullCvUrl || '')
    }
  }, [cv.fullCvUrl])

  useEffect(() => {
    if (!cv.atsCvUrl?.startsWith('data:')) {
      setAtsCvInput(cv.atsCvUrl || '')
    }
  }, [cv.atsCvUrl])

  const updateCvFile = (field, value) => {
    updateDraft((next) => {
      if (!next.cv) next.cv = {}
      next.cv[field] = value
    })
  }

  const handlePdfUpload = (field, uploadKey, files, event) => {
    const file = files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setStatus?.({ type: 'error', text: 'Please select a valid PDF file (.pdf)' })
      return
    }
    if (file.size > 800 * 1024) {
      setStatus?.({
        type: 'warning',
        text: 'File size is larger than 800KB. If it fails to save, paste a Google Drive public PDF link instead.',
      })
    }
    setUploadingId?.(uploadKey)
    setStatus?.({ type: 'info', text: `Attaching PDF file (${(file.size / 1024).toFixed(1)} KB)...` })

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      updateCvFile(field, dataUrl)
      if (field === 'fullCvUrl') setFullCvInput('')
      if (field === 'atsCvUrl') setAtsCvInput('')
      setUploadingId?.('')
      setStatus?.({ type: 'success', text: 'PDF attached! Click Save at the top right to publish changes.' })
      if (event?.target) event.target.value = ''
    }
    reader.onerror = () => {
      setUploadingId?.('')
      setStatus?.({ type: 'error', text: 'Could not read the PDF file from your device.' })
    }
    reader.readAsDataURL(file)
  }

  const updateLocaleField = (field, value) => {
    updateDraft((next) => {
      next.cv[cvLocale][field] = value
    })
  }

  const updateContactField = (field, value) => {
    updateDraft((next) => {
      next.cv.contact[field] = value
    })
  }

  const addCvListItem = (listKey, item) => {
    updateDraft((next) => {
      next.cv[cvLocale][listKey].push(item)
    })
  }

  const updateCvListItem = (listKey, index, field, value) => {
    updateDraft((next) => {
      next.cv[cvLocale][listKey][index][field] = value
    })
  }

  const removeCvListItem = (listKey, index) => {
    updateDraft((next) => {
      next.cv[cvLocale][listKey].splice(index, 1)
    })
  }

  const cvLists = [
    {
      title: 'Education',
      key: 'educationList',
      create: () => ({ id: createId('education'), degree: '', school: '', period: '', desc: '' }),
      fields: [
        { key: 'degree', label: 'Degree' },
        { key: 'school', label: 'School' },
        { key: 'period', label: 'Period' },
        { key: 'desc', label: 'Description', textarea: true, rows: 3 },
      ],
    },
    {
      title: 'CV Skill Groups',
      key: 'skillsList',
      create: () => ({ id: createId('cv-skills'), category: '', items: [] }),
      fields: [
        { key: 'category', label: 'Category' },
        { key: 'items', label: 'Items (one per line)', lines: true, rows: 5 },
      ],
    },
    {
      title: 'Key Projects',
      key: 'projectsList',
      create: () => ({ id: createId('cv-project'), title: '', tech: '', desc: '' }),
      fields: [
        { key: 'title', label: 'Project title' },
        { key: 'tech', label: 'Technologies' },
        { key: 'desc', label: 'Description', textarea: true, rows: 3 },
      ],
    },
    {
      title: 'Certifications',
      key: 'certsList',
      create: () => ({ id: createId('cv-cert'), title: '', issuer: '', date: '' }),
      fields: [
        { key: 'title', label: 'Title' },
        { key: 'issuer', label: 'Issuer' },
        { key: 'date', label: 'Date' },
      ],
    },
    {
      title: 'Achievements',
      key: 'achievementsList',
      create: () => ({ id: createId('cv-achievement'), title: '', desc: '' }),
      fields: [
        { key: 'title', label: 'Title' },
        { key: 'desc', label: 'Description', textarea: true, rows: 3 },
      ],
    },
  ]

  return (
    <div className="admin-stack">
      {/* ── CV PDF Files Management (Exact match to Screenshot 1) ── */}
      <div className="admin-cv-files-grid">
        {/* Full PDF CV */}
        <div className="admin-cv-file-card">
          <div className="admin-cv-file-header">
            <div className="admin-cv-file-icon">
              <FiFileText />
            </div>
            <div>
              <h4>Full PDF CV</h4>
              <p>Primary downloadable CV</p>
            </div>
          </div>

          <div className="admin-cv-upload-block">
            <span className="admin-cv-upload-label">UPLOAD FILE (PDF)</span>
            <div className="admin-cv-file-input-wrapper">
              <label className={`admin-cv-custom-file-btn ${uploadingId === 'cv-full' ? 'uploading' : ''}`}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handlePdfUpload('fullCvUrl', 'cv-full', e.target.files, e)}
                  disabled={uploadingId === 'cv-full'}
                />
                <FiUploadCloud /> {uploadingId === 'cv-full' ? 'Uploading...' : 'اختيار ملف / Choose File'}
              </label>
              <span className="admin-cv-filename">
                {cv.fullCvUrl ? (
                  cv.fullCvUrl.startsWith('data:') ? '✅ PDF Attached (Direct File)' : cv.fullCvUrl.slice(0, 26) + '...'
                ) : (
                  'لم يتم اختيار ملف'
                )}
              </span>
              {cv.fullCvUrl && (
                <button
                  type="button"
                  className="admin-cv-remove-file-btn"
                  title="Remove CV File"
                  onClick={() => {
                    updateCvFile('fullCvUrl', '')
                    setFullCvInput('')
                    setStatus?.({ type: 'info', text: 'CV file removed. Click Save at the top.' })
                  }}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>

          <div className="admin-cv-url-block">
            <label>Or paste direct public link / Google Drive PDF link:</label>
            <div className="admin-cv-url-input-row">
              <input
                type="url"
                placeholder="https://..."
                value={fullCvInput}
                onChange={(e) => setFullCvInput(e.target.value)}
              />
              <button
                type="button"
                className="admin-cv-save-link-btn"
                onClick={() => {
                  updateCvFile('fullCvUrl', fullCvInput.trim())
                  setStatus?.({ type: 'success', text: 'Full PDF link set! Remember to Save at the top.' })
                }}
              >
                <FiLink /> Save
              </button>
            </div>
          </div>
        </div>

        {/* ATS-Friendly Resume */}
        <div className="admin-cv-file-card">
          <div className="admin-cv-file-header">
            <div className="admin-cv-file-icon ats">
              <FiAward />
            </div>
            <div>
              <h4>ATS-Friendly Resume</h4>
              <p>Optimized for applicant tracking systems</p>
            </div>
          </div>

          <div className="admin-cv-upload-block">
            <span className="admin-cv-upload-label">UPLOAD FILE (PDF)</span>
            <div className="admin-cv-file-input-wrapper">
              <label className={`admin-cv-custom-file-btn ${uploadingId === 'cv-ats' ? 'uploading' : ''}`}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handlePdfUpload('atsCvUrl', 'cv-ats', e.target.files, e)}
                  disabled={uploadingId === 'cv-ats'}
                />
                <FiUploadCloud /> {uploadingId === 'cv-ats' ? 'Uploading...' : 'اختيار ملف / Choose File'}
              </label>
              <span className="admin-cv-filename">
                {cv.atsCvUrl ? (
                  cv.atsCvUrl.startsWith('data:') ? '✅ ATS PDF Attached (Direct File)' : cv.atsCvUrl.slice(0, 26) + '...'
                ) : (
                  'لم يتم اختيار ملف'
                )}
              </span>
              {cv.atsCvUrl && (
                <button
                  type="button"
                  className="admin-cv-remove-file-btn"
                  title="Remove ATS File"
                  onClick={() => {
                    updateCvFile('atsCvUrl', '')
                    setAtsCvInput('')
                    setStatus?.({ type: 'info', text: 'ATS file removed. Click Save at the top.' })
                  }}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>

          <div className="admin-cv-url-block">
            <label>Or paste direct public link / Google Drive PDF link:</label>
            <div className="admin-cv-url-input-row">
              <input
                type="url"
                placeholder="https://..."
                value={atsCvInput}
                onChange={(e) => setAtsCvInput(e.target.value)}
              />
              <button
                type="button"
                className="admin-cv-save-link-btn"
                onClick={() => {
                  updateCvFile('atsCvUrl', atsCvInput.trim())
                  setStatus?.({ type: 'success', text: 'ATS Resume link set! Remember to Save at the top.' })
                }}
              >
                <FiLink /> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-language-switch">
        <button
          type="button"
          className={cvLocale === 'en' ? 'active' : ''}
          onClick={() => setCvLocale('en')}
        >
          English
        </button>
        <button
          type="button"
          className={cvLocale === 'ar' ? 'active' : ''}
          onClick={() => setCvLocale('ar')}
        >
          Arabic
        </button>
      </div>

      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>CV Text</h3>
        </div>
        <div className="admin-row-grid two">
          <Field label="Name" value={data.name} onChange={(value) => updateLocaleField('name', value)} />
          <Field label="Download button text" value={data.downloadText} onChange={(value) => updateLocaleField('downloadText', value)} />
          <Field label="Subtitle" value={data.subtitle} onChange={(value) => updateLocaleField('subtitle', value)} />
          <Field label="Summary title" value={data.summaryTitle} onChange={(value) => updateLocaleField('summaryTitle', value)} />
          <Field className="wide" label="Summary text" textarea rows="5" value={data.summaryText} onChange={(value) => updateLocaleField('summaryText', value)} />
          <Field label="Education title" value={data.educationTitle} onChange={(value) => updateLocaleField('educationTitle', value)} />
          <Field label="Skills title" value={data.skillsTitle} onChange={(value) => updateLocaleField('skillsTitle', value)} />
          <Field label="Projects title" value={data.projectsTitle} onChange={(value) => updateLocaleField('projectsTitle', value)} />
          <Field label="Certifications title" value={data.certsTitle} onChange={(value) => updateLocaleField('certsTitle', value)} />
          <Field label="Achievements title" value={data.achievementsTitle} onChange={(value) => updateLocaleField('achievementsTitle', value)} />
        </div>
      </div>

      <div className="admin-editor-block full">
        <div className="admin-block-header">
          <h3>Contact Info</h3>
        </div>
        <div className="admin-row-grid two">
          <Field label="Email" value={contact.email} onChange={(value) => updateContactField('email', value)} />
          <Field label="Phone" value={contact.phone} onChange={(value) => updateContactField('phone', value)} />
          <Field label="Phone link" value={contact.phoneHref} onChange={(value) => updateContactField('phoneHref', value)} />
          <Field label="Location EN" value={contact.location_en} onChange={(value) => updateContactField('location_en', value)} />
          <Field label="Location AR" value={contact.location_ar} onChange={(value) => updateContactField('location_ar', value)} />
          <Field label="LinkedIn label" value={contact.linkedinLabel} onChange={(value) => updateContactField('linkedinLabel', value)} />
          <Field label="LinkedIn URL" value={contact.linkedin} onChange={(value) => updateContactField('linkedin', value)} />
          <Field label="GitHub label" value={contact.githubLabel} onChange={(value) => updateContactField('githubLabel', value)} />
          <Field label="GitHub URL" value={contact.github} onChange={(value) => updateContactField('github', value)} />
        </div>
      </div>

      {cvLists.map((list) => (
        <CvListEditor
          key={list.key}
          title={list.title}
          items={data[list.key] || []}
          fields={list.fields}
          onAdd={() => addCvListItem(list.key, list.create())}
          onChange={(index, field, value) => updateCvListItem(list.key, index, field, value)}
          onRemove={(index) => removeCvListItem(list.key, index)}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   ACHIEVEMENTS EDITOR (Stats & Timeline)
   ───────────────────────────────────────────── */
const iconOptions = [
  { value: 'award', label: '🏆 Award' },
  { value: 'folder', label: '📁 Folder' },
  { value: 'target', label: '🎯 Target' },
  { value: 'clock', label: '⏰ Clock' },
  { value: 'star', label: '⭐ Star' },
  { value: 'trending-up', label: '📈 Trending Up' },
  { value: 'users', label: '👥 Users' },
  { value: 'heart', label: '❤️ Heart' },
]

const AchievementsEditor = ({ draft, updateDraft }) => {
  const achievements = draft.achievements || { stats: [], items: [] }
  const stats = achievements.stats || []
  const items = achievements.items || []

  const updateStat = (index, field, value) => {
    updateDraft((next) => {
      if (!next.achievements) next.achievements = { stats: [], items: [] }
      if (!next.achievements.stats) next.achievements.stats = []
      next.achievements.stats[index][field] = value
    })
  }

  const addStat = () => {
    updateDraft((next) => {
      if (!next.achievements) next.achievements = { stats: [], items: [] }
      if (!next.achievements.stats) next.achievements.stats = []
      next.achievements.stats.push({
        id: createId('stat'),
        label_en: '',
        label_ar: '',
        value: 0,
        suffix: '+',
        icon: 'award',
      })
    })
  }

  const removeStat = (index) => {
    updateDraft((next) => {
      next.achievements.stats.splice(index, 1)
    })
  }

  const updateItem = (index, field, value) => {
    updateDraft((next) => {
      if (!next.achievements) next.achievements = { stats: [], items: [] }
      if (!next.achievements.items) next.achievements.items = []
      next.achievements.items[index][field] = value
    })
  }

  const addItem = () => {
    updateDraft((next) => {
      if (!next.achievements) next.achievements = { stats: [], items: [] }
      if (!next.achievements.items) next.achievements.items = []
      next.achievements.items.push({
        id: createId('ach'),
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        year: new Date().getFullYear().toString(),
        icon: 'star',
      })
    })
  }

  const removeItem = (index) => {
    updateDraft((next) => {
      next.achievements.items.splice(index, 1)
    })
  }

  return (
    <div className="admin-stack">
      {/* ── Stats Counters ── */}
      <div className="admin-block-header top">
        <h2><FiTrendingUp /> Stats Counters</h2>
        <button className="admin-primary-btn small" type="button" onClick={addStat}>
          <FiPlus /> Add Counter
        </button>
      </div>
      <p className="admin-helper-text">These are the animated number counters shown at the top of the Achievements section (e.g. &ldquo;5+ Awards&rdquo;).</p>

      <div className="admin-card-list">
        {stats.map((stat, index) => (
          <div className="admin-card-editor" key={stat.id || index}>
            <div className="admin-card-editor-header">
              <div>
                <span className="admin-card-index">#{index + 1}</span>
                <h3>{stat.label_en || 'New counter'}</h3>
              </div>
              <button className="admin-icon-danger" type="button" onClick={() => removeStat(index)}>
                <FiTrash2 /> Remove
              </button>
            </div>
            <div className="admin-row-grid two">
              <Field label="Label EN" value={stat.label_en} onChange={(v) => updateStat(index, 'label_en', v)} />
              <Field label="Label AR" value={stat.label_ar} onChange={(v) => updateStat(index, 'label_ar', v)} />
              <Field label="Value (number)" type="number" value={stat.value} onChange={(v) => updateStat(index, 'value', Number(v))} />
              <Field label="Suffix (e.g. +)" value={stat.suffix} onChange={(v) => updateStat(index, 'suffix', v)} />
              <label className="admin-field">
                <span>Icon</span>
                <select
                  value={stat.icon || 'award'}
                  onChange={(e) => updateStat(index, 'icon', e.target.value)}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* ── Timeline Achievements ── */}
      <div className="admin-block-header" style={{ marginTop: '40px' }}>
        <h2><FiStar /> Timeline Achievements</h2>
        <button className="admin-primary-btn small" type="button" onClick={addItem}>
          <FiPlus /> Add Achievement
        </button>
      </div>
      <p className="admin-helper-text">These appear as cards on the timeline in the Achievements section.</p>

      <div className="admin-card-list">
        {items.map((item, index) => (
          <div className="admin-card-editor" key={item.id || index}>
            <div className="admin-card-editor-header">
              <div>
                <span className="admin-card-index">#{index + 1}</span>
                <h3>{item.title_en || 'New achievement'}</h3>
              </div>
              <button className="admin-icon-danger" type="button" onClick={() => removeItem(index)}>
                <FiTrash2 /> Remove
              </button>
            </div>
            <div className="admin-row-grid two">
              <Field label="Title EN" value={item.title_en} onChange={(v) => updateItem(index, 'title_en', v)} />
              <Field label="Title AR" value={item.title_ar} onChange={(v) => updateItem(index, 'title_ar', v)} />
              <Field label="Year" value={item.year} onChange={(v) => updateItem(index, 'year', v)} />
              <label className="admin-field">
                <span>Icon</span>
                <select
                  value={item.icon || 'star'}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
              <Field
                className="wide"
                label="Description EN"
                textarea
                rows="3"
                value={item.description_en}
                onChange={(v) => updateItem(index, 'description_en', v)}
              />
              <Field
                className="wide"
                label="Description AR"
                textarea
                rows="3"
                value={item.description_ar}
                onChange={(v) => updateItem(index, 'description_ar', v)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CARD COLLECTION EDITOR (Projects/Events/Certs)
   Split Layout: Form (left) + List (right)
   ───────────────────────────────────────────── */
const CardCollectionEditor = ({
  draft,
  updateDraft,
  sectionKey,
  title,
  setStatus,
  uploadingId,
  setUploadingId,
}) => {
  const items = draft[sectionKey] || []
  const isCertifications = sectionKey === 'certifications'
  
  // null means "Add Mode"
  const [editingIndex, setEditingIndex] = useState(null)
  
  // local form state
  const [formState, setFormState] = useState(() => createCardItem(sectionKey))
  const [urlInput, setUrlInput] = useState('')
  const [uploadMode, setUploadMode] = useState('file')
  const [isDragging, setIsDragging] = useState(false)

  // Reset form when sectionKey changes
  useEffect(() => {
    setEditingIndex(null)
    setFormState(createCardItem(sectionKey))
    setUrlInput('')
  }, [sectionKey])

  // Sync formState when editingIndex changes
  useEffect(() => {
    if (editingIndex !== null && items[editingIndex]) {
      setFormState(clone(items[editingIndex]))
    } else {
      setFormState(createCardItem(sectionKey))
    }
  }, [editingIndex, items])

  const updateFormField = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateFormSocial = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      socials: {
        ...(prev.socials || createSocials()),
        [field]: value,
      },
    }))
  }

  const removeFormImage = (imgIndex) => {
    setFormState((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== imgIndex),
    }))
  }

  const handleAddUrl = (e) => {
    e.preventDefault()
    const targetUrl = urlInput.trim()
    if (!targetUrl) return
    setUrlInput('')

    setFormState((prev) => ({
      ...prev,
      images: [...(prev.images || []), targetUrl],
    }))
    setStatus({
      type: 'success',
      text: 'Image link added. Click Add/Update below, then Save at the top.',
    })
  }

  const handleUpload = async (files, event) => {
    const selectedFiles = Array.from(files || [])
    if (selectedFiles.length === 0) return

    if (!isFirebaseConfigured) {
      setStatus({ type: 'warning', text: 'Configure Firebase first to upload images.' })
      return
    }

    const itemId = formState.id || createId(sectionKey)
    setUploadingId(itemId)
    setStatus({
      type: 'info',
      text: `Compressing and uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`,
    })

    try {
      const uploadedUrls = []
      for (const file of selectedFiles) {
        const url = await uploadPortfolioImage(sectionKey, itemId, file)
        uploadedUrls.push(url)
      }

      setFormState((prev) => ({
        ...prev,
        id: itemId,
        images: [...(prev.images || []), ...uploadedUrls],
      }))

      setStatus({ type: 'success', text: 'Images uploaded! Click Add/Update below to save changes.' })
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Image upload failed.' })
    } finally {
      setUploadingId('')
      if (event?.target) event.target.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }

  const getSectionKicker = () => {
    if (sectionKey === 'certifications') return 'CERTIFICATE SCREENSHOTS'
    if (sectionKey === 'events') return 'EVENT SCREENSHOTS'
    return 'PROJECT SCREENSHOTS'
  }

  const removeItem = (index) => {
    if (editingIndex === index) {
      setEditingIndex(null)
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1)
    }
    updateDraft((next) => {
      next[sectionKey].splice(index, 1)
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    const titleVal = isCertifications ? formState.title : formState.title_en
    if (!titleVal || !titleVal.trim()) {
      setStatus({ type: 'error', text: 'Please enter a title.' })
      return
    }

    if (editingIndex === null) {
      // Add Mode
      updateDraft((next) => {
        next[sectionKey].push(clone(formState))
      })
      setFormState(createCardItem(sectionKey))
      setStatus({ type: 'success', text: 'Item added successfully! Remember to save at the top.' })
    } else {
      // Edit Mode
      updateDraft((next) => {
        next[sectionKey][editingIndex] = clone(formState)
      })
      setEditingIndex(null)
      setStatus({ type: 'success', text: 'Item updated successfully! Remember to save at the top.' })
    }
  }

  const isEditing = editingIndex !== null
  const formTitle = isEditing
    ? `Edit: ${isCertifications ? formState.title || 'Untitled' : formState.title_en || 'Untitled'}`
    : `Add New ${isCertifications ? 'Certificate' : sectionKey === 'events' ? 'Event' : 'Project'}`

  return (
    <div className="admin-stack">
      <div className="admin-block-header top">
        <h2>{title}</h2>
        <span className="admin-image-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="admin-split-layout">
        {/* ── Form Panel (Left) ── */}
        <form className="admin-split-form" onSubmit={handleFormSubmit}>
          <div className="admin-split-form-header">
            <h3>{formTitle}</h3>
            {isEditing && (
              <button className="admin-split-new-btn" type="button" onClick={() => setEditingIndex(null)}>
                <FiPlus /> New
              </button>
            )}
          </div>
          <p className="admin-helper-text">
            {isEditing ? 'Make your edits and click Update.' : 'Fill out the details below and click Add.'}
          </p>

          {/* Fields */}
          {isCertifications ? (
            <>
              <Field label="Title" value={formState.title || ''} onChange={(v) => updateFormField('title', v)} />
              <Field label="Issuer" value={formState.issuer || ''} onChange={(v) => updateFormField('issuer', v)} />
              <label className="admin-field">
                <span>Certificate Orientation (اتجاه الشهادة)</span>
                <select
                  value={formState.orientation || 'landscape'}
                  onChange={(e) => updateFormField('orientation', e.target.value)}
                >
                  <option value="landscape">Landscape (بالعرض)</option>
                  <option value="portrait">Portrait (بالطول)</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <Field label="Title EN" value={formState.title_en || ''} onChange={(v) => updateFormField('title_en', v)} />
              <Field label="Title AR" value={formState.title_ar || ''} onChange={(v) => updateFormField('title_ar', v)} />
            </>
          )}

          <Field label="Date" type="date" value={formState.date || ''} onChange={(v) => updateFormField('date', v)} />

          <Field
            label="Description EN"
            textarea
            rows="3"
            value={formState.description_en || ''}
            onChange={(v) => updateFormField('description_en', v)}
          />
          <Field
            label="Description AR"
            textarea
            rows="3"
            value={formState.description_ar || ''}
            onChange={(v) => updateFormField('description_ar', v)}
          />

          {/* Project-specific fields */}
          {sectionKey === 'projects' && (
            <>
              <Field
                label="Category (e.g. React, Web, Mobile)"
                value={formState.category || ''}
                onChange={(v) => updateFormField('category', v)}
              />
              <Field
                label="Tech Tags (comma-separated, e.g. React, JavaScript, Firebase)"
                value={Array.isArray(formState.tags) ? formState.tags.join(', ') : (formState.tags || '')}
                onChange={(v) => updateFormField('tags', v.split(',').map(t => t.trim()).filter(Boolean))}
              />
            </>
          )}

          {/* Images Section — Exact custom design from screenshot */}
          <div className="admin-img-uploader-container">
            {/* Header: Title on Left, Mode Pills on Right */}
            <div className="admin-img-uploader-header">
              <div className="admin-img-uploader-title-group">
                <div className="admin-img-uploader-title">
                  <FiImage />
                  <span>Images</span>
                </div>
                <span className="admin-img-uploader-kicker">{getSectionKicker()}</span>
              </div>

              <div className="admin-img-mode-pills">
                <button
                  type="button"
                  className={`admin-img-pill ${uploadMode === 'file' ? 'active' : ''}`}
                  onClick={() => setUploadMode('file')}
                >
                  <FiUploadCloud /> Upload File
                </button>
                <button
                  type="button"
                  className={`admin-img-pill ${uploadMode === 'url' ? 'active' : ''}`}
                  onClick={() => setUploadMode('url')}
                >
                  <FiLink /> Image URL
                </button>
              </div>
            </div>

            {/* Upload Area based on Mode */}
            {uploadMode === 'file' ? (
              <label
                className={`admin-img-dropzone-box ${isDragging ? 'dragging' : ''} ${
                  uploadingId === (formState.id || 'new') ? 'uploading' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUpload(e.target.files, e)}
                  disabled={uploadingId === (formState.id || 'new')}
                />
                <div className="admin-img-dropzone-icon-circle">
                  <FiUploadCloud />
                </div>
                <div className="admin-img-dropzone-prompt">
                  {uploadingId === (formState.id || 'new') ? (
                    <span>
                      <FiRefreshCw style={{ animation: 'adminPulse 1s ease infinite' }} /> Uploading & compressing...
                    </span>
                  ) : (
                    <>
                      Drop image here or <span className="admin-img-browse-highlight">click to browse</span>
                    </>
                  )}
                </div>
                <div className="admin-img-dropzone-sub">
                  JPG, PNG, WebP, GIF • Free Cloud Firestore
                </div>
              </label>
            ) : (
              <div className="admin-img-url-box">
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="admin-url-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddUrl(e)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!urlInput.trim()}
                  className="admin-url-add-btn"
                >
                  <FiPlus /> Add
                </button>
              </div>
            )}

            {/* Thumbnail Previews Grid */}
            {(formState.images || []).length > 0 && (
              <div className="admin-img-previews-grid">
                {formState.images.map((url, imgIndex) => (
                  <div className="admin-img-preview-card" key={`${url}-${imgIndex}`}>
                    <img src={url} alt={`Screenshot ${imgIndex + 1}`} loading="lazy" />
                    <span className="admin-img-preview-badge">#{imgIndex + 1}</span>
                    <button
                      className="admin-img-preview-remove"
                      type="button"
                      title="Delete image"
                      onClick={() => removeFormImage(imgIndex)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social & Project Links — ALWAYS visible! */}
          <div className="admin-split-socials">
            <h4><FiLink /> Social Links</h4>
            {sectionKey === 'projects' && (
              <Field
                label="Live Demo URL"
                value={formState.liveDemo || ''}
                onChange={(v) => updateFormField('liveDemo', v)}
              />
            )}
            <Field label="GitHub URL" value={formState.socials?.github || ''} onChange={(v) => updateFormSocial('github', v)} />
            <Field label="LinkedIn URL" value={formState.socials?.linkedin || ''} onChange={(v) => updateFormSocial('linkedin', v)} />
            <Field label="Facebook URL" value={formState.socials?.facebook || ''} onChange={(v) => updateFormSocial('facebook', v)} />
            <Field label="Instagram URL" value={formState.socials?.instagram || ''} onChange={(v) => updateFormSocial('instagram', v)} />
          </div>

          <button className="admin-primary-btn" type="submit" style={{ marginTop: '12px' }}>
            {isEditing ? (
              <>Update {isCertifications ? 'Certificate' : sectionKey === 'events' ? 'Event' : 'Project'}</>
            ) : (
              <>+ Add {isCertifications ? 'Certificate' : sectionKey === 'events' ? 'Event' : 'Project'}</>
            )}
          </button>
        </form>

        {/* ── List Panel (Right) ── */}
        <div className="admin-split-list">
          {items.length === 0 && (
            <div className="admin-split-list-empty">
              <FiGrid />
              <p>No items yet</p>
              <span>Use the form to add your first item</span>
            </div>
          )}
          {items.map((item, index) => {
            const itemTitle = isCertifications ? item.title : item.title_en
            const desc = item.description_en || ''
            const images = Array.isArray(item.images) ? item.images.filter(Boolean) : []
            const firstImage = images[0]
            const isActive = editingIndex === index

            return (
              <div className={`admin-split-card ${isActive ? 'active' : ''}`} key={item.id || index}>
                {/* Thumbnail */}
                <div className="admin-split-card-thumb">
                  {firstImage ? (
                    <img src={firstImage} alt={itemTitle || ''} loading="lazy" />
                  ) : (
                    <div className="admin-split-card-thumb-placeholder">
                      <FiImage />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="admin-split-card-info">
                  <div className="admin-split-card-top">
                    <h4>{itemTitle || 'Untitled'}</h4>
                    {item.date && <span className="admin-split-card-badge">{item.date}</span>}
                  </div>
                  {desc && <p className="admin-split-card-desc">{desc.length > 120 ? desc.slice(0, 120) + '...' : desc}</p>}
                  <div className="admin-split-card-meta">
                    {item.date && <span><FiCalendar /> {item.date}</span>}
                    {isCertifications && item.issuer && <span><FiMapPin /> {item.issuer}</span>}
                    {images.length > 0 && <span><FiImage /> {images.length}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-split-card-actions">
                  <button
                    className={`admin-split-card-edit ${isActive ? 'active' : ''}`}
                    type="button"
                    title="Edit"
                    onClick={() => setEditingIndex(isActive ? null : index)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="admin-split-card-delete"
                    type="button"
                    title="Delete"
                    onClick={() => removeItem(index)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN ADMIN PANEL
   ═══════════════════════════════════════════════ */
const AdminPanel = () => {
  const { content, error: contentError } = usePortfolioContent()
  const [draft, setDraft] = useState(() => cloneDefaultContent())
  const [activeTab, setActiveTab] = useState('home')
  const [status, setStatus] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured)
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [uploadingId, setUploadingId] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setDraft(clone(content))
  }, [content])

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthReady(true)
      return undefined
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthReady(true)
    })
  }, [])

  const updateDraft = (updater) => {
    setDraft((prev) => {
      const next = clone(prev)
      updater(next)
      return next
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!auth) return

    setIsSigningIn(true)
    setStatus(null)

    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Could not sign in.' })
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    if (auth) await signOut(auth)
  }

  const handleSave = async () => {
    if (!isFirebaseConfigured) {
      setStatus({ type: 'warning', text: 'Add Firebase env variables before saving.' })
      return
    }

    setIsSaving(true)
    setStatus(null)
    setSaveSuccess(false)

    try {
      await savePortfolioContent(draft)
      setStatus({ type: 'success', text: 'Saved to Firestore successfully!' })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Save failed.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadDefaults = () => {
    setDraft(cloneDefaultContent())
    setStatus({ type: 'info', text: 'Default content loaded in the editor. Press Save to publish it.' })
  }

  const renderEditor = () => {
    if (activeTab === 'home') {
      return (
        <HomeEditor
          draft={draft}
          updateDraft={updateDraft}
          setStatus={setStatus}
          uploadingId={uploadingId}
          setUploadingId={setUploadingId}
        />
      )
    }

    if (activeTab === 'about') {
      return <AboutEditor draft={draft} updateDraft={updateDraft} />
    }


    if (activeTab === 'cv') {
      return (
        <CVEditor
          draft={draft}
          updateDraft={updateDraft}
          setStatus={setStatus}
          uploadingId={uploadingId}
          setUploadingId={setUploadingId}
        />
      )
    }

    if (activeTab === 'achievements') {
      return <AchievementsEditor draft={draft} updateDraft={updateDraft} />
    }

    const collectionConfig = {
      projects: { title: 'Projects' },
      events: { title: 'Events' },
      certifications: { title: 'Certifications' },
    }[activeTab]

    return (
      <CardCollectionEditor
        draft={draft}
        updateDraft={updateDraft}
        sectionKey={activeTab}
        title={collectionConfig.title}
        setStatus={setStatus}
        uploadingId={uploadingId}
        setUploadingId={setUploadingId}
      />
    )
  }

  /* Compute stats for sidebar */
  const sectionCounts = {
    home: 1,
    about: (draft.about?.timeline || []).length,
    cv: 1,
    achievements: (draft.achievements?.stats || []).length + (draft.achievements?.items || []).length,
    projects: (draft.projects || []).length,
    events: (draft.events || []).length,
    certifications: (draft.certifications || []).length,
  }

  if (isFirebaseConfigured && !authReady) {
    return (
      <section className="admin-page section">
        <div className="container">
          <div className="admin-loading glass-card">
            <FiRefreshCw style={{ animation: 'adminPulse 1.5s ease infinite', fontSize: '1.5rem', marginBottom: '12px' }} />
            <div>Loading admin panel...</div>
          </div>
        </div>
      </section>
    )
  }

  if (isFirebaseConfigured && !user) {
    return (
      <LoginPanel
        credentials={credentials}
        setCredentials={setCredentials}
        onSubmit={handleLogin}
        status={status}
        isSubmitting={isSigningIn}
      />
    )
  }

  const currentTabConfig = adminTabs.find((t) => t.key === activeTab)

  return (
    <section className="admin-page section">
      <div className="container">
        {/* Header */}
        <div className="admin-hero">
          <div>
            <span className="admin-kicker">
              <FiShield /> Admin Panel
            </span>
            <h1>Portfolio Control Center</h1>
            <p>Edit your site content, upload images, and publish to Firebase in real-time.</p>
          </div>

          <div className="admin-hero-actions">
            {user?.email && <span className="admin-user">{user.email}</span>}
            {user && (
              <button className="admin-secondary-btn" type="button" onClick={handleSignOut}>
                <FiLogOut /> Sign out
              </button>
            )}
          </div>
        </div>

        {/* Notices */}
        {!isFirebaseConfigured && <SetupNotice />}
        {contentError && (
          <div className="admin-notice error">
            <FiAlertCircle />
            <div>
              <h3>Could not read Firestore</h3>
              <p>{contentError.message}</p>
            </div>
          </div>
        )}

        {/* Main Dashboard – Sidebar + Content */}
        <div className="admin-dashboard">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
              <FiShield />
              <span>Admin Panel</span>
            </div>

            <nav className="admin-sidebar-nav">
              {adminTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`admin-sidebar-nav-item ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Icon className="admin-sidebar-nav-icon" />
                    <span className="admin-sidebar-nav-label">{tab.label}</span>
                    {sectionCounts[tab.key] > 0 && (
                      <span className="admin-sidebar-nav-badge">{sectionCounts[tab.key]}</span>
                    )}
                  </button>
                )
              })}
            </nav>

            <div className="admin-sidebar-stats">
              <div className="admin-sidebar-stats-title">Quick Stats</div>
              <div className="admin-sidebar-stats-grid">
                <div className="admin-stat-item">
                  <span className="admin-stat-value">{(draft.projects || []).length}</span>
                  <span className="admin-stat-label">Projects</span>
                </div>
                <div className="admin-stat-item">
                  <span className="admin-stat-value">{(draft.events || []).length}</span>
                  <span className="admin-stat-label">Events</span>
                </div>
                <div className="admin-stat-item">
                  <span className="admin-stat-value">{(draft.certifications || []).length}</span>
                  <span className="admin-stat-label">Certs</span>
                </div>
                <div className="admin-stat-item">
                  <span className="admin-stat-value">
                    {(draft.achievements?.stats || []).length + (draft.achievements?.items || []).length}
                  </span>
                  <span className="admin-stat-label">Achieve</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="admin-content">
            {/* Content Header */}
            <div className="admin-content-header">
              <div className="admin-breadcrumb">
                <span>Admin</span>
                <span className="admin-breadcrumb-sep">/</span>
                <span className="admin-breadcrumb-current">{currentTabConfig?.label}</span>
              </div>
              <div className="admin-content-title-row">
                <div>
                  <h2 className="admin-content-title">{currentTabConfig?.label}</h2>
                  <p className="admin-content-desc">{currentTabConfig?.desc}</p>
                </div>
                <div className="admin-actions">
                  <button className="admin-secondary-btn" type="button" onClick={handleLoadDefaults}>
                    <FiRefreshCw /> Defaults
                  </button>
                  <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <><FiRefreshCw style={{ animation: 'adminPulse 1s ease infinite' }} /> Saving...</>
                    ) : saveSuccess ? (
                      <><FiCheck /> Saved!</>
                    ) : (
                      <><FiSave /> Save</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <StatusMessage status={status} />

            {/* Editor Content */}
            <div className="admin-editor" key={activeTab}>
              {renderEditor()}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminPanel
