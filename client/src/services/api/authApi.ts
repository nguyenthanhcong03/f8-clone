import { baseApi } from './baseApi'
import type { User } from '@/types/user'
import type { ApiResponse } from '@/types/api'
import { logout, setCredentials, setIsAuthLoading, setToken } from '@/store/features/auth/authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      login: builder.mutation<{ user: User; accessToken: string }, { email: string; password: string }>({
        query: (body) => ({
          url: '/auth/login',
          method: 'POST',
          body
        }),
        transformResponse: (response: ApiResponse<{ user: User; accessToken: string }>) => response.data!, // Chỉ hiệu lực khi lấy data khi gọi
        async onQueryStarted(args, { queryFulfilled, dispatch }) {
          try {
            // response.data Không hiệu lực ở đây
            const result = await queryFulfilled

            dispatch(setCredentials(result.data.user))
            dispatch(setToken(result.data.accessToken))

            dispatch(baseApi.util.invalidateTags(['Course']))
          } catch (error) {
            console.log('Đăng nhập thất bại:', error)
          }
        }
      }),
      register: builder.mutation({
        query: (body) => ({
          url: '/auth/register',
          method: 'POST',
          body: body
        })
      }),
      logout: builder.mutation({
        query: () => ({
          url: '/auth/logout',
          method: 'POST'
        }),
        async onQueryStarted(args, { queryFulfilled, dispatch }) {
          // Xoá thông tin user khỏi store
          dispatch(logout())
        }
      }),
      getCurrentUser: builder.query<User, void>({
        query: () => '/auth/me',
        transformResponse: (response: ApiResponse<User>) => response.data!,
        async onQueryStarted(args, { queryFulfilled, dispatch }) {
          try {
            const result = await queryFulfilled
            dispatch(setIsAuthLoading(false))
            dispatch(setCredentials(result.data))
          } catch (error) {
            dispatch(setIsAuthLoading(false))
            console.log(error)
          }
        }
      }),
      getProfile: builder.query<User, void>({
        query: () => ({
          url: '/auth/profile',
          method: 'GET'
        }),
        transformResponse: (response: ApiResponse<User>) => response.data!
      }),
      updateProfile: builder.mutation<User, { fullName?: string; username?: string; phone?: string; avatar?: File }>({
        query: (data) => {
          const formData = new FormData()

          if (data.fullName) formData.append('fullName', data.fullName)
          if (data.username) formData.append('username', data.username)
          if (data.phone) formData.append('phone', data.phone)
          if (data.avatar) formData.append('avatar', data.avatar)
          return {
            url: '/auth/profile',
            method: 'PUT',
            body: formData
          }
        },
        invalidatesTags: ['User'],
        async onQueryStarted(args, { queryFulfilled, dispatch }) {
          try {
            const result = await queryFulfilled
            console.log('result :>> ', result)
            // Cập nhật user trong store sau khi update thành công
            dispatch(setCredentials(result.data.data))
          } catch (error) {
            console.error('Update profile failed:', error)
          }
        }
      }),
      // Lấy thông tin user theo username
      getPublicProfileByUsername: builder.query({
        query: (username) => `/auth/public-profile/${username}`,
        providesTags: (result) => (result?.data ? [{ type: 'User', id: result.data.userId }] : [])
      })
    }
  }
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useGetPublicProfileByUsernameQuery
} = authApi
