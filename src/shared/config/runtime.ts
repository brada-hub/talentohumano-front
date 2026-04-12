const cleanUrl = (value?: string | null) => String(value || '').trim().replace(/\/+$/, '')

const viteEnv =
  typeof import.meta !== 'undefined'
    ? ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env || {})
    : {}

export const SIGETH_API_BASE_URL = cleanUrl(viteEnv.VITE_SIGETH_BACK_URL)

export const getSigethPublicBaseUrl = () => {
  if (SIGETH_API_BASE_URL) {
    return SIGETH_API_BASE_URL
  }

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`
  }

  return ''
}

export const buildSigethPortalFileUrl = (rawPath?: string | null) => {
  let value = String(rawPath || '').trim().replace(/\\/g, '/')

  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      value = new URL(value).pathname
    } catch {
      value = value.replace(/^https?:\/\/[^/]+\//i, '')
    }
  }

  value = value
    .replace(/^\/+api\/v1\/portal\/archivo\//i, '')
    .replace(/^\/+api\/portal\/archivo\//i, '')
    .replace(/^\/+storage\//i, '')
    .replace(/^storage\//i, '')
    .replace(/^\/+/, '')

  if (!value) {
    return ''
  }

  return `${getSigethPublicBaseUrl().replace(/\/+$/, '')}/api/portal/archivo/${value}`
}
