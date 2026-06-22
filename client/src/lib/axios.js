import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export function getApiErrorMessage(err) {
  if (err.response?.data?.message) {
    return err.response.data.message
  }

  if (!err.response || err.code === 'ERR_NETWORK') {
    return `Backend not reachable at ${API_ORIGIN}. Start the server with "npm run dev" from the project root.`
  }

  return 'Something went wrong. Please try again.'
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('frames_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle expired/invalid token globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const url = originalRequest?.url || ''
    const isAuthRequest = ['/auth/login', '/auth/register', '/auth/refresh'].some((path) =>
      url.includes(path)
    )

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRequest) {
      originalRequest._retry = true

      try {
        const res = await api.post('/auth/refresh')
        localStorage.setItem('frames_token', res.data.token)
        originalRequest.headers.Authorization = `Bearer ${res.data.token}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('frames_token')
        window.location.href = '/login'
      }
    }

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('frames_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
