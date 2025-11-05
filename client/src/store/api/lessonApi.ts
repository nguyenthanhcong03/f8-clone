import type { ApiResponse } from '@/types/api'
import type { Lesson } from '@/types/course'
import { baseApi } from './baseApi'

interface CreateLessonRequest {
  sectionId: string
  title: string
  content?: string
  video_url?: string
  videoFile?: File
}

interface UpdateLessonRequest {
  lessonId: string
  title?: string
  content?: string
  video_url?: string
  videoFile?: File
}

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy bài học theo ID
    getLessonById: builder.query<ApiResponse<Lesson>, string>({
      query: (lessonId) => `/lessons/${lessonId}`,
      providesTags: (_result, _error, lessonId) => [{ type: 'Lesson', id: lessonId }]
    }),

    // Lấy tất cả bài học trong một chương
    getSectionLessons: builder.query<Lesson[], string>({
      query: (sectionId) => `/sections/${sectionId}/lessons`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ lessonId }) => ({ type: 'Lesson' as const, id: lessonId })),
              { type: 'Lesson', id: 'LIST' }
            ]
          : [{ type: 'Lesson', id: 'LIST' }]
    }),

    // Tạo bài học mới
    createLesson: builder.mutation<ApiResponse<Lesson>, { courseId: string; lessonData: CreateLessonRequest }>({
      query: ({ courseId, lessonData }) => {
        const formData = new FormData()
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
      invalidatesTags: (_result, _error, { courseId }) => [{ type: 'Course', id: courseId }]
    }),

    // Cập nhật bài học
    updateLesson: builder.mutation<ApiResponse<Lesson>, { courseId: string; lessonData: UpdateLessonRequest }>({
      query: ({ courseId, lessonData }) => {
        const formData = new FormData()

        if (lessonData.title) {
          formData.append('title', lessonData.title)
        }

        if (lessonData.content) {
          formData.append('content', lessonData.content)
        }

        if (lessonData.video_url) {
          formData.append('videoUrl', lessonData.video_url)
        }

        if (lessonData.videoFile) {
          formData.append('videoFile', lessonData.videoFile)
        }

        return {
          url: `/lessons/${lessonData.lessonId}`,
          method: 'PUT',
          body: formData,
          formData: true
        }
      },
      invalidatesTags: (_result, _error, { courseId, lessonData }) => [
        { type: 'Course', id: courseId },
        { type: 'Lesson', id: lessonData.lessonId }
      ]
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

export const {
  useGetLessonByIdQuery,
  useGetSectionLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useUpdateLessonOrderMutation
} = lessonApi
