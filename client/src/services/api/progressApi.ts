import type { ApiResponse } from '@/types/api'
import { baseApi } from './baseApi'

interface Progress {
  progressId: string
  userId: string
  lessonId: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

interface UpdateProgressRequest {
  lessonId: string
}

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy tiến độ học tập theo courseId
    getProgressByCourse: builder.query<ApiResponse<Progress[]>, string>({
      query: (courseId) => `/progress/course/${courseId}`,
      providesTags: ['Progress']
    }),

    // Cập nhật tiến độ bài học
    updateProgress: builder.mutation<ApiResponse<{ progress: Progress }>, UpdateProgressRequest>({
      query: (body) => ({
        url: '/progress',
        method: 'POST',
        body
      }),
      // Invalidate Progress cache sau khi cập nhật
      invalidatesTags: ['Progress']
    })
  })
})

export const { useGetProgressByCourseQuery, useUpdateProgressMutation } = progressApi
