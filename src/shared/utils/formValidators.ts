export const MAX_FILE_SIZE_BYTES = 1024 * 1024

const LETTERS_REGEX = /[^A-ZÁÉÍÓÚÑÜ\s]/gi
const NUMBERS_REGEX = /[^\d]/g
const ALPHANUMERIC_REGEX = /[^A-Z0-9\s\-./]/gi

export const sanitizeLetters = (value?: string | null): string =>
  (value || '').replace(LETTERS_REGEX, '').replace(/\s+/g, ' ').trimStart()

export const sanitizeNumbers = (value?: string | null): string =>
  (value || '').replace(NUMBERS_REGEX, '')

export const sanitizeAlphanumeric = (value?: string | null): string =>
  (value || '').replace(ALPHANUMERIC_REGEX, '').replace(/\s+/g, ' ').trimStart()

export const isFileUnder1Mb = (file?: File | null): boolean =>
  !file || file.size <= MAX_FILE_SIZE_BYTES

export const getFileSizeError = (file?: File | null): string | null =>
  isFileUnder1Mb(file) ? null : 'El archivo no debe superar 1 MB.'

export const validateOnlyLetters = (value?: string | null): true | string =>
  !value || sanitizeLetters(value) === value ? true : 'Solo se permiten letras.'

export const validateOnlyNumbers = (value?: string | null): true | string =>
  !value || sanitizeNumbers(value) === value ? true : 'Solo se permiten numeros.'

export const validateAlphaNumeric = (value?: string | null): true | string =>
  !value || sanitizeAlphanumeric(value) === value ? true : 'Solo se permiten letras, numeros y separadores basicos.'
