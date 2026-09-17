const DEFAULT_OPTIONS = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  skipBelowBytes: 350 * 1024,
}

/* Options for base64 images stored in Firestore (more aggressive compression) */
const BASE64_OPTIONS = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.6,
}

const loadImageFromFile = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read the selected image.'))
    }

    image.src = objectUrl
  })

const canvasToJpegFile = (canvas, fileName, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image compression failed.'))
          return
        }

        const baseName = fileName.replace(/\.[^.]+$/, '') || 'image'
        resolve(
          new File([blob], `${baseName}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }),
        )
      },
      'image/jpeg',
      quality,
    )
  })

const canvasToBase64 = (canvas, quality) =>
  canvas.toDataURL('image/jpeg', quality)

const resizeImage = (image, maxWidth, maxHeight) => {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not prepare image for upload.')
  }

  context.drawImage(image, 0, 0, width, height)
  return canvas
}

export const compressImageFile = async (file, options = {}) => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose a valid image file.')
  }

  const settings = { ...DEFAULT_OPTIONS, ...options }

  if (file.size <= settings.skipBelowBytes && file.type === 'image/jpeg') {
    return file
  }

  const image = await loadImageFromFile(file)
  const canvas = resizeImage(image, settings.maxWidth, settings.maxHeight)

  return canvasToJpegFile(canvas, file.name, settings.quality)
}

/**
 * Compress an image file and return a base64 data URL.
 * This is used for FREE image storage directly in Firestore
 * (no Firebase Storage / Blaze plan needed).
 *
 * Images are compressed aggressively (800×800, quality 0.6)
 * to keep Firestore document sizes manageable.
 */
export const compressImageToBase64 = async (file, options = {}) => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose a valid image file.')
  }

  const settings = { ...BASE64_OPTIONS, ...options }
  const image = await loadImageFromFile(file)
  const canvas = resizeImage(image, settings.maxWidth, settings.maxHeight)
  const dataUrl = canvasToBase64(canvas, settings.quality)

  // Check that the base64 string isn't too large for Firestore
  // Firestore max doc = 1 MB, but we share the doc with other fields
  const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024)
  if (sizeKB > 500) {
    // Re-compress at lower quality if too large
    const lowerCanvas = resizeImage(image, 600, 600)
    return canvasToBase64(lowerCanvas, 0.4)
  }

  return dataUrl
}

export const isExternalImageUrl = (url) =>
  typeof url === 'string' &&
  url.startsWith('http') &&
  !url.includes('firebasestorage.googleapis.com')

export const isBase64Image = (url) =>
  typeof url === 'string' && url.startsWith('data:image/')
