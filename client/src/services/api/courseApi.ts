import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'
import type { ApiResponse, PaginationResponse } from '@/types/api'
import type { Course } from '@/types/course'
import { baseApi } from './baseApi'

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy tất cả khóa học
    getAllPublishedCourses: builder.query<
      ApiResponse<PaginationResponse<Course>>,
      { page: number; limit: number; sort: string; order: string }
    >({
      query: (params: { page: number; limit: number; sort: string; order: string }) => {
        return { url: '/courses', method: 'GET', params: params }
      }
    }),

    // Lấy khóa học theo slug
    getCourseBySlug: builder.query<ApiResponse<Course>, string>({
      query: (slug) => `/courses/slug/${slug}`,
      // transformResponse: (response: ApiResponse<Course>) => response.data!,
      providesTags: (result) => (result?.data ? [{ type: 'Course', id: result.data.courseId }] : [])
    }),

    // ADMIN

    // Lấy tất cả khóa học
    getAllCoursesAdmin: builder.query<
      ApiResponse<PaginationResponse<Course>>,
      {
        page: number
        limit: number
        sort: string
        order: string
        search?: string
        level?: string
        isPaid?: string
        isPublished?: string
        minPrice?: number
        maxPrice?: number
      }
    >({
      query: (params) => {
        return { url: '/courses/admin', method: 'GET', params: params }
      },
      // transformResponse: (response: ApiResponse<PaginationResponse<Course>>) => response.data?.data ?? [],

      // transformResponse có hiệu lực ở đây
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ courseId }) => ({ type: 'Course' as const, id: courseId })),
              { type: 'Course', id: 'LIST' }
            ]
          : [{ type: 'Course', id: 'LIST' }]
    }),

    // Lấy khóa học theo ID
    getCourseById: builder.query<ApiResponse<Course>, string>({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: (result) => (result?.data ? [{ type: 'Course', id: result.data.courseId }] : [])
    }),

    // Tạo khóa học=> mới
    createCourse: builder.mutation<ApiResponse<Course>, CreateCourseInput | FormData>({
      query: (courseData) => {
        return {
          url: '/courses',
          method: 'POST',
          body: courseData,
          formData: true // Thông báo cho RTK Query đây là FormData
        }
      },
      invalidatesTags: [{ type: 'Course', id: 'LIST' }]
    }),

    // Cập nhật khóa học
    updateCourse: builder.mutation<ApiResponse<Course>, { id: string; data: UpdateCourseInput | FormData }>({
      query: ({ id, data }) => {
        return {
          url: `/courses/${id}`,
          method: 'PUT',
          body: data
          // formData: true
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Course', id },
        { type: 'Course', id: 'LIST' }
      ]
    }),

    // Xóa khóa học
    deleteCourse: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Course', id: 'LIST' }]
    }),

    // Cập nhật thứ tự bài học trong một phần
    updateLessonOrder: builder.mutation<ApiResponse<unknown>, { sectionId: string; lessonIds: string[] }>({
      query: ({ sectionId, lessonIds }) => ({
        url: `/sections/${sectionId}/lessons/reorder`,
        method: 'PUT',
        body: { lessonIds }
      }),
      invalidatesTags: (_result, _error, { sectionId }) => [
        { type: 'Section', id: sectionId },
        { type: 'Lesson', id: 'LIST' }
      ]
    })
  })
})

// Export hooks
export const {
  useGetAllPublishedCoursesQuery,
  useGetAllCoursesAdminQuery,
  useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateLessonOrderMutation
} = courseApi
