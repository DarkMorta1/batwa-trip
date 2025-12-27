const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function authHeaders() {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export { API }

export async function apiRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...options.headers
  }

  const response = await fetch(`${API}${url}`, {
    ...options,
    headers
  })

  if (response.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
    throw new Error('Unauthorized')
  }

  // Check if response is JSON
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')

  if (!response.ok) {
    if (isJson) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    } else {
      const text = await response.text().catch(() => 'Request failed')
      throw new Error(`Server error: ${response.status} ${response.statusText}`)
    }
  }

  if (!isJson) {
    const text = await response.text()
    return text
  }

  return response.json()
}

