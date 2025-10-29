import type { ApiResponse } from '@/types/api'
import type { Lesson } from '@/types/course'
import { baseApi } from './baseApi'

interface CreateLessonRequest {
  courseId: string
  sectionId: string
  title: string
  content?: string
  video_url?: string
  videoFile?: File
}

interface UpdateLessonRequest {
  lessonId: string
  data: {
    title?: string
    content?: string
    video_url?: string
    videoFile?: File
  }
}

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy bài học theo ID
    getLessonById: builder.query<Lesson, string>({
      query: (lessonId) => `/lessons/${lessonId}`,
      transformResponse: (response: ApiResponse<Lesson>) => response.data,
      providesTags: (_result, _error, lessonId) => [{ type: 'Lesson', id: lessonId }]
    }),

    // Lấy tất cả bài học trong một phần
    getSectionLessons: builder.query<Lesson[], string>({
      query: (sectionId) => `/sections/${sectionId}/lessons`,
      transformResponse: (response: ApiResponse<Lesson[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ lessonId }) => ({ type: 'Lesson' as const, id: lessonId })),
              { type: 'Lesson', id: 'LIST' }
            ]
          : [{ type: 'Lesson', id: 'LIST' }]
    }),

    // Tạo bài học mới
    createLesson: builder.mutation<ApiResponse<Lesson>, CreateLessonRequest>({
      query: (lessonData) => {
        const formData = new FormData()
        formData.append('courseId', lessonData.courseId)
        formData.append('sectionId', lessonData.sectionId)
        formData.append('title', lessonData.title)

        if (lessonData.content) {
          formData.append('content', lessonData.content)
        }

        if (lessonData.videoFile) {
          formData.append('videoFile', lessonData.videoFile)
        }

        return {
          url: '/lessons',
          method: 'POST',
          body: formData,
          formData: true
        }
      },
      invalidatesTags: (_result, _error, { sectionId }) => [
        { type: 'Lesson', id: 'LIST' },
        { type: 'Section', id: sectionId }
      ]
    }),

    // Cập nhật bài học
    updateLesson: builder.mutation<ApiResponse<Lesson>, UpdateLessonRequest>({
      query: ({ lessonId, data }) => {
        const formData = new FormData()

        if (data.title) {
          formData.append('title', data.title)
        }

        if (data.content) {
          formData.append('content', data.content)
        }

        if (data.video_url) {
          formData.append('video_url', data.video_url)
        }

        if (data.videoFile) {
          formData.append('videoFile', data.videoFile)
        }

        return {
          url: `/lessons/${lessonId}`,
          method: 'PUT',
          body: formData,
          formData: true
        }
      },
      invalidatesTags: (_result, _error, { lessonId }) => [{ type: 'Lesson', id: lessonId }]
    }),

    // Xóa bài học
    deleteLesson: builder.mutation<ApiResponse<unknown>, string>({
      query: (lessonId) => ({
        url: `/lessons/${lessonId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Lesson', id: 'LIST' }]
    }),

    // Cập nhật thứ tự bài học
    updateLessonOrder: builder.mutation<ApiResponse<Lesson[]>, { sectionId: string; lessonIds: string[] }>({
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
  useGetLessonByIdQuery,
  useGetSectionLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useUpdateLessonOrderMutation
} = lessonApi
