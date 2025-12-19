import { logout, setToken } from '@/store/features/auth/authSlice'
import type { RootState } from '@/store/store'
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'

const API_URL = import.meta.env.VITE_API_URL

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]> // dùng cho lỗi field validation
}

// Base query với token từ localStorage
const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api/v1`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken || localStorage.getItem('accessToken')
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
  credentials: 'include' // Để gửi cookie refresh token
})

// Custom baseQuery có retry refresh token
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Gọi query gốc
  let result = await baseQuery(args, api, extraOptions)
  // Nếu lỗi 401 - thử refresh token
  if (result.error && 'status' in result.error && result.error.status === 401) {
    console.warn('🔄 Access token hết hạn, đang refresh...')
    // Gọi API refresh token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST'
      },
      api,
      extraOptions
    )
    if (refreshResult.data) {
      const { accessToken } = refreshResult.data.data as { accessToken: string }
      // Cập nhật token vào localStorage và Redux
      localStorage.setItem('accessToken', accessToken)
      api.dispatch(setToken(accessToken))

      // Retry request ban đầu với token mới
      result = await baseQuery(args, api, extraOptions)
    } else {
      console.error('❌ Refresh token thất bại, đang logout...')
      // Xóa token khỏi localStorage
      localStorage.removeItem('accessToken')
      // Dispatch logout action
      api.dispatch(logout())
    }
  }

  // Log errors (chỉ trong development)
  if (import.meta.env.NODE_ENV === 'development' && result.error) {
    console.error('❌ RTK Query error:', result.error)
  }
  // if (result.error) {
  //   const err = result.error as FetchBaseQueryError
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const data = err.data as any
  //   // Chuẩn hóa về dạng thống nhất
  //   const normalizedError: ApiError = {
  //     status: typeof err.status === 'number' ? err.status : 500,
  //     message: data?.message || ('error' in err ? err.error : undefined) || 'Có lỗi xảy ra, vui lòng thử lại.',
  //     errors: data?.errors || undefined
  //   }

  //   return { error: normalizedError }
  // }

  return result
}

// Tạo baseApi
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Course', 'User', 'Section', 'Lesson', 'Enrollment', 'Progress', 'Blog', 'BlogCategory'],
  // Cấu hình caching
  keepUnusedDataFor: 300, // giữ cache trong 5 phút
  refetchOnMountOrArgChange: 30, // refetch nếu đã cache quá 30 giây
  refetchOnFocus: false, // không refetch khi focus lại tab
  refetchOnReconnect: true, // refetch khi kết nối lại internet
  endpoints: () => ({})
})
