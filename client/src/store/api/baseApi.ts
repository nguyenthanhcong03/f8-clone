import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import { logout, setToken } from '../features/auth/authSlice'
import type { RootState } from '../store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]> // dùng cho lỗi field validation
}

// Base query với token từ localStorage
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken || localStorage.getItem('accessToken')
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
  credentials: 'include' // Để gửi cookie refresh token
})

// Custom baseQuery có retry refresh token
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (args, api, extraOptions) => {
  // Gọi query gốc
  let result = await baseQuery(args, api, extraOptions)
  // Nếu lỗi 401 - thử refresh token
  if (result.error && 'status' in result.error && result.error.status === 401) {
    console.warn('🔄 Access token hết hạn, đang refresh...')
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
      const { accessToken } = refreshResult.data as { accessToken: string }
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
  if (result.error) {
    const err = result.error as FetchBaseQueryError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = err.data as any
    // Chuẩn hóa về dạng thống nhất
    const normalizedError: ApiError = {
      status: typeof err.status === 'number' ? err.status : 500,
      message: data?.message || ('error' in err ? err.error : undefined) || 'Có lỗi xảy ra, vui lòng thử lại.',
      errors: data?.errors || undefined
    }
    return { error: normalizedError }
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
// import {
//   createApi,
//   fetchBaseQuery,
//   type BaseQueryFn,
//   type FetchArgs,
//   type FetchBaseQueryError
// } from '@reduxjs/toolkit/query/react'
// import { logout, setToken } from '../features/auth/authSlice'
// import type { RootState } from '../store'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// /** 🔹 Kiểu lỗi thống nhất trong toàn dự án */
// export interface ApiError {
//   status: number
//   message: string
//   /** lỗi từ field validation (Laravel, NestJS, v.v...) */
//   errors?: Record<string, string[]>
// }

// /** 🔹 Base query gốc, có attach token */
// const rawBaseQuery = fetchBaseQuery({
//   baseUrl: API_URL,
//   credentials: 'include',
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.accessToken || localStorage.getItem('accessToken')
//     if (token) headers.set('authorization', `Bearer ${token}`)
//     return headers
//   }
// })

// /** 🔹 Base query có tự refresh token + normalize error */
// export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
//   args,
//   api,
//   extraOptions
// ) => {
//   // 1️⃣ Gọi request gốc
//   let result = await rawBaseQuery(args, api, extraOptions)

//   // 2️⃣ Nếu bị 401 → thử refresh token
//   if (result.error && 'status' in result.error && result.error.status === 401) {
//     if (import.meta.env.DEV) console.warn('🔄 Access token hết hạn, đang refresh...')

//     const refreshResult = await rawBaseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions)

//     if (refreshResult.data) {
//       const { accessToken } = refreshResult.data as { accessToken: string }

//       // Cập nhật token vào localStorage & Redux
//       localStorage.setItem('accessToken', accessToken)
//       api.dispatch(setToken(accessToken))

//       // 🔁 Retry request ban đầu
//       result = await rawBaseQuery(args, api, extraOptions)
//     } else {
//       console.error('❌ Refresh token thất bại, đang logout...')
//       localStorage.removeItem('accessToken')
//       api.dispatch(logout())
//     }
//   }

//   // 3️⃣ Chuẩn hóa lỗi
//   if (result.error) {
//     const err = result.error as FetchBaseQueryError
//     let normalized: ApiError

//     if ('status' in err) {
//       const data = err.data as any
//       normalized = {
//         status: typeof err.status === 'number' ? err.status : 500,
//         message: data?.message || (typeof data === 'string' ? data : 'Đã có lỗi xảy ra, vui lòng thử lại.'),
//         errors: data?.errors
//       }
//     } else {
//       normalized = {
//         status: 0,
//         message: 'Không thể kết nối tới máy chủ. Kiểm tra lại internet.'
//       }
//     }

//     if (import.meta.env.DEV) {
//       console.error('❌ RTK Query normalized error:', normalized)
//     }

//     return { error: normalized }
//   }

//   // ✅ Thành công
//   return result
// }

// /** 🔹 Tạo API root, dùng cho toàn app */
// export const baseApi = createApi({
//   reducerPath: 'api',
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ['User', 'Course', 'Section', 'Lesson', 'Enrollment', 'Progress'],

//   // 🧠 Cache config — cân bằng hiệu suất và UX
//   keepUnusedDataFor: 300, // 5 phút giữ cache
//   refetchOnReconnect: true, // tự refetch khi mất mạng rồi reconnect
//   refetchOnFocus: false, // tránh refetch mỗi khi focus lại tab
//   refetchOnMountOrArgChange: 30, // refetch nếu cache cũ hơn 30s

//   endpoints: () => ({})
// })
