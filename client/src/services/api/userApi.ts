import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/user'
import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy tất cả users
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => '/users',
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ userId }) => ({ type: 'User' as const, id: userId })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }]
    }),

    // Lấy user theo ID
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result) => (result?.data ? [{ type: 'User', id: result.data.userId }] : [])
    })
  })
})

// Export hooks
export const { useGetAllUsersQuery, useGetUserByIdQuery } = userApi
