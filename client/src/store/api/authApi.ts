import { baseApi } from './baseApi'
import { setCredentials, setToken } from '../features/auth/authSlice'
import type { User } from '@/types/user'
import type { ApiResponse } from '@/types/api'

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
          } catch (error) {
            console.log(error)
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
        })
      }),
      getCurrentUser: builder.query<User, void>({
        query: () => '/auth/me',
        transformResponse: (response: ApiResponse<User>) => response.data!,
        async onQueryStarted(args, { queryFulfilled, dispatch }) {
          try {
            const result = await queryFulfilled
            dispatch(setCredentials(result.data))
          } catch (error) {
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
      updateUser: builder.mutation({
        query: (body) => ({
          url: '/auth/profile',
          method: 'PUT',
          body
        }),
        invalidatesTags: ['User']
      })
    }
  }
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useGetProfileQuery
} = authApi
