import type { ApiResponse } from '@/types/api'
import type { Section } from '@/types/course'
import { baseApi } from './baseApi'

export const sectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy các phần trong một khóa học
    getCourseSections: builder.query<Section[], string>({
      query: (courseId) => `/sections/${courseId}`,
      transformResponse: (response: ApiResponse<Section[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ section_id }) => ({ type: 'Section' as const, id: section_id })),
              { type: 'Section', id: 'LIST' }
            ]
          : [{ type: 'Section', id: 'LIST' }]
    }),

    // Tạo phần mới
    createSection: builder.mutation<ApiResponse<Section>, { title: string; course_id: string }>({
      query: (sectionData) => ({
        url: '/sections',
        method: 'POST',
        body: sectionData
      }),
      invalidatesTags: (_result, _error, { course_id }) => [
        { type: 'Section', id: 'LIST' },
        { type: 'Course', id: course_id }
      ]
    }),

    // Cập nhật phần
    updateSection: builder.mutation<ApiResponse<Section>, { sectionId: string; title: string }>({
      query: ({ sectionId, title }) => ({
        url: `/sections/${sectionId}`,
        method: 'PUT',
        body: { title }
      }),
      invalidatesTags: (_result, _error, { sectionId }) => [{ type: 'Section', id: sectionId }]
    }),

    // Xóa phần
    deleteSection: builder.mutation<ApiResponse<Section>, string>({
      query: (sectionId) => ({
        url: `/sections/${sectionId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, sectionId) => [
        { type: 'Section', id: sectionId },
        { type: 'Section', id: 'LIST' }
      ]
    }),

    // Cập nhật thứ tự các phần
    updateSectionOrder: builder.mutation<ApiResponse<Section[]>, { courseId: string; sectionIds: string[] }>({
      query: ({ courseId, sectionIds }) => ({
        url: `/sections/${courseId}/reorder`,
        method: 'PUT',
        body: { sectionIds }
      }),
      invalidatesTags: [
        { type: 'Section', id: 'LIST' },
        { type: 'Course', id: 'LIST' }
      ]
    })
  })
})

// Export hooks
export const {
  useGetCourseSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useUpdateSectionOrderMutation
} = sectionApi
