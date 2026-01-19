/**
 * Environment configuration with fallbacks
 * Ensures NEXTAUTH_URL is always set correctly
 */

export const getEnvUrl = (path: string) => {
  let baseUrl = process.env.NEXTAUTH_URL || ''
  
  // Remove trailing slash if present
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1)
  }
  
  // Ensure protocol
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    console.warn(`NEXTAUTH_URL missing protocol for path: ${path}, using current hostname`)
    if (typeof window !== 'undefined') {
      baseUrl = window.location.origin
    } else {
      baseUrl = 'http://localhost:3000'
    }
  }
  
  return baseUrl
}

export const API_BASE = getEnvUrl('')
export const AUTH_BASE = getEnvUrl('/api/auth')
