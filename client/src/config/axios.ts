import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true // để gửi cookie refresh token
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Xử lý khi accessToken hết hạn
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => {
    return res?.data || res
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // const res: any = await store.dispatch(refreshToken())
        const res = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, {}, { withCredentials: true })
        // const newAccessToken = res.payload.accessToken
        const newAccessToken = res.data.accessToken

        processQueue(null, newAccessToken)
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
