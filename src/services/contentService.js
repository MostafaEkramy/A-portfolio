import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { cloneDefaultContent } from '../data/defaultContent'
import { auth, db, isFirebaseConfigured, storage } from '../lib/firebase'
import { compressImageFile } from '../utils/imageUtils'

const CONTENT_COLLECTION = 'portfolioContent'
const CONTENT_DOCUMENT = 'main'

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
  skills: content.skills,
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

  const contentRef = doc(db, CONTENT_COLLECTION, CONTENT_DOCUMENT)

  await setDoc(
    contentRef,
    {
      ...pickContentFields(content),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

const sanitizeFileName = (fileName) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const formatUploadError = (error) => {
  const message = error?.message || 'Image upload failed.'
  const code = error?.code || ''

  if (code === 'storage/unauthorized' || message.includes('unauthorized')) {
    return 'Upload blocked by Firebase Storage rules. Sign in as admin and allow authenticated writes to portfolio/.'
  }

  if (
    message.includes('CORS') ||
    message.includes('preflight') ||
    code === 'storage/unknown'
  ) {
    return 'Firebase Storage CORS is not configured. Run: gsutil cors set cors.json gs://YOUR_BUCKET_NAME'
  }

  return message
}

export const uploadPortfolioImage = async (section, itemId, file) => {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Firebase Storage is not configured.')
  }

  if (!auth?.currentUser) {
    throw new Error('Please sign in before uploading images.')
  }

  try {
    const optimizedFile = await compressImageFile(file)
    const safeName = sanitizeFileName(optimizedFile.name) || 'image.jpg'
    const imageRef = storageRef(
      storage,
      `portfolio/${section}/${itemId}/${Date.now()}-${safeName}`,
    )

    const result = await uploadBytes(imageRef, optimizedFile, {
      contentType: optimizedFile.type || 'image/jpeg',
    })

    return getDownloadURL(result.ref)
  } catch (error) {
    throw new Error(formatUploadError(error))
  }
}
