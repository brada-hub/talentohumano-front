import { getFileSizeError, isFileUnder1Mb, MAX_FILE_SIZE_BYTES } from 'src/shared/utils/formValidators'

type OptimizationResult = {
  file: File | null
  error: string | null
  optimized: boolean
}

const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const MAX_DIMENSION = 1800
const INITIAL_QUALITY = 0.85
const MIN_QUALITY = 0.5

const readImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo procesar la imagen seleccionada.'))
    }

    image.src = url
  })

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('No se pudo comprimir la imagen seleccionada.'))
        return
      }

      resolve(blob)
    }, 'image/jpeg', quality)
  })

const buildCanvas = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const ratio = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height))

  canvas.width = Math.max(1, Math.round(image.width * ratio))
  canvas.height = Math.max(1, Math.round(image.height * ratio))

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('No se pudo inicializar la compresion de la imagen.')
  }

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return canvas
}

const optimizeImageFile = async (file: File): Promise<File> => {
  const image = await readImage(file)
  const canvas = buildCanvas(image)
  const baseName = file.name.replace(/\.[^.]+$/, '')

  for (let quality = INITIAL_QUALITY; quality >= MIN_QUALITY; quality -= 0.1) {
    const blob = await canvasToBlob(canvas, Number(quality.toFixed(2)))
    const optimizedFile = new File([blob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })

    if (optimizedFile.size <= MAX_FILE_SIZE_BYTES) {
      return optimizedFile
    }
  }

  const blob = await canvasToBlob(canvas, MIN_QUALITY)
  return new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

export const optimizeUploadFile = async (file: File | null): Promise<OptimizationResult> => {
  if (!file) {
    return { file: null, error: null, optimized: false }
  }

  if (isFileUnder1Mb(file)) {
    return { file, error: null, optimized: false }
  }

  if (!IMAGE_TYPES.has(file.type)) {
    return { file: null, error: getFileSizeError(file), optimized: false }
  }

  try {
    const optimizedFile = await optimizeImageFile(file)
    const error = getFileSizeError(optimizedFile)

    if (error) {
      return { file: null, error, optimized: true }
    }

    return { file: optimizedFile, error: null, optimized: true }
  } catch (error) {
    return {
      file: null,
      error: error instanceof Error ? error.message : 'No se pudo optimizar la imagen seleccionada.',
      optimized: false,
    }
  }
}
