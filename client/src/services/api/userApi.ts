import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/user'
import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy thông tin user theo username
    getPublicProfileByUsername: builder.query({
      query: (username) => `/users/public-profile/${username}`,
      providesTags: (result) => (result?.data ? [{ type: 'User', id: result.data.userId }] : [])
    }),

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
    }),

    // Upload avatar
    uploadAvatar: builder.mutation<ApiResponse<User>, { userId: string; file: File }>({
      query: ({ userId, file }) => {
        const formData = new FormData()
        formData.append('avatar', file)
        return {
          url: `/users/${userId}/avatar`,
          method: 'POST',
          body: formData
        }
      },
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }]
    }),

    // Xóa avatar
    deleteAvatar: builder.mutation<ApiResponse<User>, string>({
      query: (userId) => ({
        url: `/users/${userId}/avatar`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, userId) => [{ type: 'User', id: userId }]
    })
  })
})

// Export hooks
export const {
  useGetPublicProfileByUsernameQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUploadAvatarMutation,
  useDeleteAvatarMutation
} = userApi
