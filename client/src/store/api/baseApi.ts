import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.example.com', // thay bằng API thực tế
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

// Custom baseQuery có retry refresh token
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    console.warn('Access token hết hạn, đang refresh...')
    // Gọi API refresh token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken: (api.getState() as RootState).auth.refreshToken }
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).accessToken
      const newRefreshToken = (refreshResult.data as any).refreshToken

      // Lưu token mới vào Redux
      api.dispatch({
        type: 'auth/setTokens',
        payload: { accessToken: newAccessToken, refreshToken: newRefreshToken }
      })

      // Retry request ban đầu
      result = await baseQuery(args, api, extraOptions)
    } else {
      console.error('Refresh token thất bại → logout')
      api.dispatch({ type: 'auth/logout' })
    }
  }

  return result
}

// Tạo baseApi
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Course', 'User'],
  endpoints: () => ({})
})
