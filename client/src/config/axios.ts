// api.ts
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // để gửi cookie refresh token
})

// Thêm access token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
  (response) => response.data,
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
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true
      console.log('refreshing token...')
      try {
        const res = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true })
        console.log('Refresh token response:', res.data)
        // Điều chỉnh cách truy cập token từ response theo đúng cấu trúc server trả về
        const newAccessToken = res.data.data?.accessToken

        if (!newAccessToken) {
          console.error('No access token returned from refresh token request')
          throw new Error('No access token in response')
        }

        localStorage.setItem('accessToken', newAccessToken)

        // Cập nhật token cho request hiện tại
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        // Cập nhật token mặc định cho các request tiếp theo
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        localStorage.removeItem('accessToken')
        // Optionally: redirect to login
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
export default api
