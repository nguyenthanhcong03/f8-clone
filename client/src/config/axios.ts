import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL: API_URL,
  // timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const axiosInstanceWithCredentials = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true
})

// Request interceptor - KHÔNG CẦN THÊM TOKEN VÀO HEADER
axiosInstance.interceptors.request.use(
  (config) => {
    // Cookie sẽ tự động được gửi với withCredentials: true
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor cho httpOnly cookies
axiosInstance.interceptors.response.use(
  (response) => {
    return response?.data || response
  },
  async (error) => {
    const originalRequest = error.config

    // Xử lý 401 với httpOnly cookies
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Kiểm tra xem có phải lỗi do access token hết hạn không
      const errorMessage = error.response?.data?.message || ''
      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        try {
          // Thử refresh token (cookie sẽ tự động được gửi)
          await axiosInstanceWithCredentials.post(`${API_URL}/api/auth/refresh-token`)
          // Refresh thành công, retry request gốc
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh thất bại - token thực sự hết hạn
          handleSessionExpired()
          return Promise.reject(refreshError)
        }
      } else {
        // 401 nhưng không phải do token hết hạn (user chưa đăng nhập)
        redirectToLoginIfNeeded()
      }
    }

    return Promise.reject(error)
  }
)

// Xử lý session hết hạn
const handleSessionExpired = () => {
  console.log('Session expired, redirecting to login...')
  logoutAndRedirect()
}

const logoutAndRedirect = async () => {
  try {
    // Gọi logout API để xóa httpOnly cookies
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // window.location.href = '/login';
  }
}

const redirectToLoginIfNeeded = () => {
  const currentPath = window.location.pathname
  const publicPaths = ['/login', '/register', '/forgot-password', '/']

  if (!publicPaths.includes(currentPath)) {
    // window.location.href = '/login';
  }
}

export default axiosInstance
