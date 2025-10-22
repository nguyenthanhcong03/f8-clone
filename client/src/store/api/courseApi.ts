import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'
import type { ApiResponse } from '@/types/api'
import type { Course } from '@/types/course'
import { baseApi } from './baseApi'

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy tất cả khóa học
    getAllCourses: builder.query<Course[], void>({
      query: () => '/courses',
      transformResponse: (response: ApiResponse<Course[]>) => response.data!,

      // response.data có hiệu lực ở đây
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ course_id }) => ({ type: 'Course' as const, id: course_id })),
              { type: 'Course', id: 'LIST' }
            ]
          : [{ type: 'Course', id: 'LIST' }]
    }),

    // Lấy khóa học theo ID
    getCourseById: builder.query<{ course: Course }, string>({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: (_result, _error, courseId) => [{ type: 'Course', id: courseId }]
    }),

    // Lấy khóa học theo slug
    getCourseBySlug: builder.query<Course, string>({
      query: (slug) => `/courses/slug/${slug}`,
      transformResponse: (response: ApiResponse<Course>) => response.data!,
      providesTags: (result) => (result ? [{ type: 'Course', id: result.course_id }] : [])
    }),

    // Tạo khóa học=> mới
    createCourse: builder.mutation<ApiResponse<Course>, CreateCourseInput>({
      query: (courseData) => {
        const formData = new FormData()

        formData.append('title', courseData.title)

        if (courseData.slug) {
          formData.append('slug', courseData.slug)
        }

        if (courseData.description) {
          formData.append('description', courseData.description)
        }

        if (courseData.level) {
          formData.append('level', courseData.level)
        }

        formData.append('is_paid', courseData.is_paid.toString())

        if (courseData.price) {
          formData.append('price', courseData.price.toString())
        }

        if (courseData.thumbnail instanceof File) {
          formData.append('thumbnail', courseData.thumbnail)
        }

        return {
          url: '/courses',
          method: 'POST',
          body: formData,
          formData: true // Thông báo cho RTK Query đây là FormData
        }
      },
      invalidatesTags: [{ type: 'Course', id: 'LIST' }]
    }),

    // Cập nhật khóa học
    updateCourse: builder.mutation<ApiResponse<Course>, { id: string; data: UpdateCourseInput | FormData }>({
      query: ({ id, data }) => {
        // Xử lý trường hợp data là FormData
        if (data instanceof FormData) {
          return {
            url: `/courses/${id}`,
            method: 'PUT',
            body: data,
            formData: true
          }
        }

        // Xử lý trường hợp data là đối tượng thông thường
        return {
          url: `/courses/${id}`,
          method: 'PUT',
          body: data
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
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateLessonOrderMutation
} = courseApi
