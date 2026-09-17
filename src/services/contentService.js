import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { cloneDefaultContent } from '../data/defaultContent'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'
import { compressImageToBase64 } from '../utils/imageUtils'

const CONTENT_COLLECTION = 'portfolioContent'
const CONTENT_DOCUMENT = 'main'
const IMAGES_COLLECTION = 'portfolioImages'

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

export const subscribePortfolioContent = (onContent, onError) => {
  if (!isFirebaseConfigured || !db) {
    onContent(cloneDefaultContent())
    return () => {}
  }

  const contentRef = doc(db, CONTENT_COLLECTION, CONTENT_DOCUMENT)

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

const pickContentFields = (content) => ({
  hero: content.hero,
  about: content.about,
  cv: content.cv,
  achievements: content.achievements,
  projects: content.projects,
  events: content.events,
  certifications: content.certifications,
})

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
 * back into the content object.
 */
const restoreBase64Images = async (content) => {
  if (!db) return content

  const contentStr = JSON.stringify(content)
  const matches = contentStr.match(/\{\{img:(img_\d+_\d+)\}\}/g)
  if (!matches || matches.length === 0) return content

  // Get unique image keys
  const keys = [...new Set(matches.map((m) => m.replace('{{img:', '').replace('}}', '')))]

  // Fetch image documents
  let restoredStr = contentStr
  for (const key of keys) {
    try {
      const imgDoc = await getDoc(doc(db, IMAGES_COLLECTION, key))
      if (imgDoc.exists()) {
        const data = imgDoc.data()
        restoredStr = restoredStr.replaceAll(`{{img:${key}}}`, data.dataUrl || '')
      }
    } catch {
      // If image doc not found, leave the placeholder
    }
  }

  return JSON.parse(restoredStr)
}

export const savePortfolioContent = async (content) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Add your Vite Firebase env variables first.')
  }

  const fields = pickContentFields(content)
  const { processedContent, images } = extractBase64Images(fields)

  // Save base64 images to separate documents
  const imageEntries = Object.entries(images)
  for (const [key, dataUrl] of imageEntries) {
    const imgRef = doc(db, IMAGES_COLLECTION, key)
    await setDoc(imgRef, {
      dataUrl,
      createdAt: serverTimestamp(),
    })
  }

  // Save main content (with image references instead of base64)
  const contentRef = doc(db, CONTENT_COLLECTION, CONTENT_DOCUMENT)
  await setDoc(
    contentRef,
    {
      ...processedContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const subscribePortfolioContentWithImages = (onContent, onError) => {
  if (!isFirebaseConfigured || !db) {
    onContent(cloneDefaultContent())
    return () => {}
  }

  const contentRef = doc(db, CONTENT_COLLECTION, CONTENT_DOCUMENT)

  return onSnapshot(
    contentRef,
    async (snapshot) => {
      let nextContent = snapshot.exists()
        ? normalizePortfolioContent(snapshot.data())
        : cloneDefaultContent()

      // Restore base64 images from Firestore
      try {
        nextContent = await restoreBase64Images(nextContent)
      } catch {
        // If image restoration fails, content still works without images
      }

      onContent(nextContent)
    },
    (error) => {
      onError?.(error)
      onContent(cloneDefaultContent())
    },
  )
}

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
