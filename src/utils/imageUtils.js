const DEFAULT_OPTIONS = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  skipBelowBytes: 350 * 1024,
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

export const compressImageFile = async (file, options = {}) => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose a valid image file.')
  }

  const settings = { ...DEFAULT_OPTIONS, ...options }

  if (file.size <= settings.skipBelowBytes && file.type === 'image/jpeg') {
    return file
  }

  const image = await loadImageFromFile(file)
  const scale = Math.min(
    settings.maxWidth / image.width,
    settings.maxHeight / image.height,
    1,
  )

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

  return canvasToJpegFile(canvas, file.name, settings.quality)
}

export const isExternalImageUrl = (url) =>
  typeof url === 'string' &&
  url.startsWith('http') &&
  !url.includes('firebasestorage.googleapis.com')
