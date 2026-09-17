import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { cloneDefaultContent } from '../data/defaultContent'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'
import { compressImageToBase64 } from '../utils/imageUtils'

/* ── Firestore Collection Names ──────────────────────────── */
const DATA_COLLECTION = 'portfolioData'       // Main content (text, links, etc.)
const DATA_DOCUMENT = 'main'
const IMAGES_COLLECTION = 'portfolioImages'   // Base64 images (split from main doc)
const CV_FILES_COLLECTION = 'cvFiles'         // CV PDF files
const CV_FULL_DOC = 'full_cv'
const CV_ATS_DOC = 'ats_cv'

/* ── Local Cache ─────────────────────────────────────────── */
const CACHE_KEY = 'portfolio_content_cache'
const CACHE_TS_KEY = 'portfolio_cache_ts'
const CACHE_MAX_AGE = 10 * 60 * 1000 // 10 minutes

const getLocalCache = () => {
  try {
    const ts = Number(localStorage.getItem(CACHE_TS_KEY) || 0)
    if (Date.now() - ts > CACHE_MAX_AGE) return null
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const setLocalCache = (content) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content))
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()))
  } catch {
    // Quota exceeded — silently ignore
  }
}

/* ── Helpers ─────────────────────────────────────────────── */
const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const deepMerge = (base, override) => {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base
  }

  if (!isPlainObject(base)) {
    return override ?? base
  }

  const result = {}
  Object.keys(base).forEach((key) => {
    result[key] = deepMerge(base[key], override?.[key])
  })

  return result
}

export const normalizePortfolioContent = (content = {}) =>
  deepMerge(cloneDefaultContent(), content)

/* ── Extract & Restore Base64 Images ─────────────────────── */

/**
 * Extracts base64 images from content and stores them in separate
 * Firestore documents to avoid the 1MB document size limit.
 * Replaces base64 data URLs with Firestore reference keys.
 */
const extractBase64Images = (content) => {
  const images = {}
  const cleaned = JSON.parse(JSON.stringify(content))
  let imageIndex = 0

  const processValue = (obj, path) => {
    if (typeof obj === 'string' && (obj.startsWith('data:image/') || obj.startsWith('data:application/pdf') || obj.startsWith('data:'))) {
      const key = `img_${Date.now()}_${imageIndex++}`
      images[key] = obj
      return `{{img:${key}}}`
    }
    if (Array.isArray(obj)) {
      return obj.map((item, i) => processValue(item, `${path}[${i}]`))
    }
    if (isPlainObject(obj)) {
      const result = {}
      for (const [k, v] of Object.entries(obj)) {
        result[k] = processValue(v, `${path}.${k}`)
      }
      return result
    }
    return obj
  }

  const processedContent = processValue(cleaned, 'root')
  return { processedContent, images }
}

/**
 * Restores base64 images from Firestore image documents
 * back into the content object. Fetches in parallel for speed.
 */
const restoreBase64Images = async (content) => {
  if (!db) return content

  const contentStr = JSON.stringify(content)
  const matches = contentStr.match(/\{\{img:(img_\d+_\d+)\}\}/g)
  if (!matches || matches.length === 0) return content

  // Get unique image keys
  const keys = [...new Set(matches.map((m) => m.replace('{{img:', '').replace('}}', '')))]

  // Fetch all image documents in PARALLEL (much faster than sequential)
  const fetchResults = await Promise.allSettled(
    keys.map(async (key) => {
      const imgDoc = await getDoc(doc(db, IMAGES_COLLECTION, key))
      return { key, dataUrl: imgDoc.exists() ? imgDoc.data().dataUrl : null }
    }),
  )

  let restoredStr = contentStr
  for (const result of fetchResults) {
    if (result.status === 'fulfilled' && result.value.dataUrl) {
      restoredStr = restoredStr.replaceAll(
        `{{img:${result.value.key}}}`,
        result.value.dataUrl,
      )
    }
  }

  return JSON.parse(restoredStr)
}

/* ── CV File Helpers ─────────────────────────────────────── */

/**
 * Extracts CV file data (fullCvUrl, atsCvUrl) from content
 * and stores them in the cvFiles collection separately.
 */
const extractCvFiles = (content) => {
  const cvFiles = {}
  const cleaned = JSON.parse(JSON.stringify(content))

  if (cleaned.cv?.fullCvUrl && cleaned.cv.fullCvUrl.startsWith('data:')) {
    cvFiles[CV_FULL_DOC] = cleaned.cv.fullCvUrl
    cleaned.cv.fullCvUrl = '{{cvFile:full_cv}}'
  }

  if (cleaned.cv?.atsCvUrl && cleaned.cv.atsCvUrl.startsWith('data:')) {
    cvFiles[CV_ATS_DOC] = cleaned.cv.atsCvUrl
    cleaned.cv.atsCvUrl = '{{cvFile:ats_cv}}'
  }

  return { cleanedContent: cleaned, cvFiles }
}

/**
 * Restores CV file data from the cvFiles collection.
 */
const restoreCvFiles = async (content) => {
  if (!db) return content

  const contentStr = JSON.stringify(content)
  if (!contentStr.includes('{{cvFile:')) return content

  let restoredStr = contentStr

  const fetchJobs = []
  if (contentStr.includes('{{cvFile:full_cv}}')) {
    fetchJobs.push(
      getDoc(doc(db, CV_FILES_COLLECTION, CV_FULL_DOC)).then((snap) => ({
        placeholder: '{{cvFile:full_cv}}',
        dataUrl: snap.exists() ? snap.data().dataUrl : '',
      })),
    )
  }
  if (contentStr.includes('{{cvFile:ats_cv}}')) {
    fetchJobs.push(
      getDoc(doc(db, CV_FILES_COLLECTION, CV_ATS_DOC)).then((snap) => ({
        placeholder: '{{cvFile:ats_cv}}',
        dataUrl: snap.exists() ? snap.data().dataUrl : '',
      })),
    )
  }

  const results = await Promise.allSettled(fetchJobs)
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.dataUrl) {
      restoredStr = restoredStr.replaceAll(r.value.placeholder, r.value.dataUrl)
    }
  }

  return JSON.parse(restoredStr)
}

/* ── Public: Subscribe to Content ────────────────────────── */

export const subscribePortfolioContent = (onContent, onError) => {
  if (!isFirebaseConfigured || !db) {
    onContent(cloneDefaultContent())
    return () => {}
  }

  const contentRef = doc(db, DATA_COLLECTION, DATA_DOCUMENT)

  return onSnapshot(
    contentRef,
    (snapshot) => {
      const nextContent = snapshot.exists()
        ? normalizePortfolioContent(snapshot.data())
        : cloneDefaultContent()

      onContent(nextContent)
    },
    (error) => {
      onError?.(error)
      onContent(cloneDefaultContent())
    },
  )
}

export const subscribePortfolioContentWithImages = (onContent, onError) => {
  if (!isFirebaseConfigured || !db) {
    onContent(cloneDefaultContent())
    return () => {}
  }

  // Serve cached content IMMEDIATELY for instant page load
  const cached = getLocalCache()
  if (cached) {
    onContent(normalizePortfolioContent(cached))
  }

  const contentRef = doc(db, DATA_COLLECTION, DATA_DOCUMENT)

  return onSnapshot(
    contentRef,
    async (snapshot) => {
      let nextContent = snapshot.exists()
        ? normalizePortfolioContent(snapshot.data())
        : cloneDefaultContent()

      // Restore base64 images & CV files from Firestore in parallel
      try {
        const [withImages, _] = await Promise.all([
          restoreBase64Images(nextContent),
          Promise.resolve(), // placeholder for future parallel work
        ])
        nextContent = withImages
        nextContent = await restoreCvFiles(nextContent)
      } catch {
        // If restoration fails, content still works without images
      }

      // Update local cache
      setLocalCache(nextContent)

      onContent(nextContent)
    },
    (error) => {
      onError?.(error)
      // Fall back to cache or default
      if (cached) {
        onContent(normalizePortfolioContent(cached))
      } else {
        onContent(cloneDefaultContent())
      }
    },
  )
}

/* ── Public: Save Content ────────────────────────────────── */

const pickContentFields = (content) => ({
  hero: content.hero,
  about: content.about,
  cv: content.cv,
  achievements: content.achievements,
  projects: content.projects,
  events: content.events,
  certifications: content.certifications,
})

export const savePortfolioContent = async (content) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Add your Vite Firebase env variables first.')
  }

  const fields = pickContentFields(content)

  // 1. Extract CV files first (before image extraction)
  const { cleanedContent, cvFiles } = extractCvFiles(fields)

  // 2. Extract base64 images
  const { processedContent, images } = extractBase64Images(cleanedContent)

  // 3. Save CV files to cvFiles collection
  const cvEntries = Object.entries(cvFiles)
  for (const [docId, dataUrl] of cvEntries) {
    await setDoc(doc(db, CV_FILES_COLLECTION, docId), {
      dataUrl,
      updatedAt: serverTimestamp(),
    })
    console.log(
      `%c📄 CV file saved → cvFiles/${docId} (~${Math.round((dataUrl.length * 3) / 4 / 1024)}KB)`,
      'color: #00B4D8; font-weight: bold;',
    )
  }

  // 4. Save base64 images to separate documents
  const imageEntries = Object.entries(images)
  for (const [key, dataUrl] of imageEntries) {
    const imgRef = doc(db, IMAGES_COLLECTION, key)
    await setDoc(imgRef, {
      dataUrl,
      createdAt: serverTimestamp(),
    })
    console.log(
      `%c🖼️ Image saved → portfolioImages/${key} (~${Math.round((dataUrl.length * 3) / 4 / 1024)}KB)`,
      'color: #00B4D8; font-weight: bold;',
    )
  }

  // 5. Save main content (with image/cv references instead of base64)
  const contentRef = doc(db, DATA_COLLECTION, DATA_DOCUMENT)
  await setDoc(
    contentRef,
    {
      ...processedContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  console.log(
    `%c🚀 Content saved to Firestore → portfolioData/main (${imageEntries.length} images, ${cvEntries.length} CV files)`,
    'color: #48cae4; font-weight: bold; font-size: 13px;',
  )

  // 6. Invalidate local cache so next load gets fresh data
  try {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TS_KEY)
  } catch {
    // ignore
  }
}

/* ── Public: Upload Image ────────────────────────────────── */

/**
 * Compress an image from the user's desktop and return a base64 data URL.
 * This is stored directly in Firestore — NO Firebase Storage needed.
 * Completely FREE on the Spark plan!
 */
export const uploadPortfolioImage = async (_section, _itemId, file) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.')
  }

  if (!auth?.currentUser) {
    throw new Error('Please sign in before uploading images.')
  }

  try {
    const base64Url = await compressImageToBase64(file)
    return base64Url
  } catch (error) {
    throw new Error(error.message || 'Image compression failed.')
  }
}
