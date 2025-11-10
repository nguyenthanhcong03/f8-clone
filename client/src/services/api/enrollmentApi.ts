import type { ApiResponse } from '@/types/api'
import { baseApi } from './baseApi'

interface Enrollment {
  id: number
  userId: string
  courseId: string
  course_title?: string
  course_thumbnail?: string
  created_at: string
  updated_at: string
}

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy tất cả đăng ký khóa học của user
    getUserEnrollments: builder.query<Enrollment[], void>({
      query: () => '/enrollments',
      transformResponse: (response: ApiResponse<Enrollment[]>) => response.data!,
      providesTags: ['Enrollment']
    }),

    // Kiểm tra đăng ký của user cho một khóa học
    checkEnrollment: builder.query<{ isEnrolled: boolean }, string>({
      query: (slug) => `/enrollments/check/${slug}`,
      transformResponse: (response: ApiResponse<{ isEnrolled: boolean }>) => response.data!,
      providesTags: (_result, _error, slug) => [{ type: 'Enrollment', id: slug }]
    }),

    // Đăng ký khóa học
    enrollCourse: builder.mutation<ApiResponse<Enrollment>, string>({
      query: (courseId) => ({
        url: '/enrollments',
        method: 'POST',
        body: { courseId }
      }),
      invalidatesTags: ['Enrollment', 'Course']
    }),

    // Hủy đăng ký khóa học
    unenrollCourse: builder.mutation<ApiResponse<unknown>, number>({
      query: (id) => ({
        url: `/enrollments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Enrollment', 'Course']
    })
  })
})

// Export hooks
export const {
  useGetUserEnrollmentsQuery,
  useCheckEnrollmentQuery,
  useEnrollCourseMutation,
  useUnenrollCourseMutation
} = enrollmentApi
