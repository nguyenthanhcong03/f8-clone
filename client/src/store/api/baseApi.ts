import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Auth state từ RootState
interface AuthState {
  accessToken?: string | null
}

// Base query với token từ localStorage
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // Lấy state và cast nó sang dạng có thuộc tính auth
    const state = getState() as { auth: AuthState }
    // Ưu tiên lấy token từ Redux store
    const token = state.auth?.accessToken || localStorage.getItem('accessToken')

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
  credentials: 'include' // Để gửi cookie refresh token
})

// Enhance query với logging và error handling
const enhancedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Log request (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.info('🚀 RTK Query request:', typeof args === 'string' ? { url: args } : args)
  }

  return baseQuery(args, api, extraOptions)
}

// Custom baseQuery có retry refresh token
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Gọi query gốc
  const result = await enhancedBaseQuery(args, api, extraOptions)

  // Xử lý refresh token khi bị 401 Unauthorized
  if (result.error && 'status' in result.error && result.error.status === 401) {
    console.warn('🔄 Access token hết hạn, đang refresh...')

    // Lưu trữ request đang chờ xử lý
    const originalRequest = typeof args === 'string' ? { url: args } : { ...args }

    // Gọi API refresh token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST'
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // Type cho refresh token response
      interface RefreshResponse {
        accessToken: string
      }

      const refreshData = refreshResult.data as RefreshResponse
      const newAccessToken = refreshData.accessToken

      // Lưu token mới vào localStorage
      localStorage.setItem('accessToken', newAccessToken)

      // Cập nhật token trong Redux store
      api.dispatch({
        type: 'auth/setTokens',
        payload: {
          accessToken: newAccessToken
        }
      })

      // Retry request ban đầu với token mới
      return baseQuery(originalRequest, api, extraOptions)
    } else {
      console.error('❌ Refresh token thất bại, đang logout...')

      // Xóa tokens
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      // Dispatch logout action
      api.dispatch({ type: 'auth/logout' })
    }
  }

  // Log errors (chỉ trong development)
  if (process.env.NODE_ENV === 'development' && result.error) {
    console.error('❌ RTK Query error:', result.error)
  }

  return result
}

// Tạo baseApi
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Course', 'User', 'Section', 'Lesson', 'Enrollment', 'Progress'],
  // Cấu hình caching
  keepUnusedDataFor: 300, // giữ cache trong 5 phút
  refetchOnMountOrArgChange: 30, // refetch nếu đã cache quá 30 giây
  refetchOnFocus: false, // không refetch khi focus lại tab
  refetchOnReconnect: true, // refetch khi kết nối lại internet
  endpoints: () => ({})
})
