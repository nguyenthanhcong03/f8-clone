import type { ApiResponse } from '@/types/api'
import type { Section } from '@/types/course'
import { baseApi } from './baseApi'

export const sectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy các chương trong một khóa học
    getCourseSections: builder.query<Section[], string>({
      query: (courseId) => `/sections/${courseId}`,
      transformResponse: (response: ApiResponse<Section[]>) => response.data!,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ sectionId }) => ({ type: 'Section' as const, id: sectionId })),
              { type: 'Section', id: 'LIST' }
            ]
          : [{ type: 'Section', id: 'LIST' }]
    }),

    // Tạo chương mới
    createSection: builder.mutation<ApiResponse<Section>, { title: string; courseId: string }>({
      query: (sectionData) => ({
        url: '/sections',
        method: 'POST',
        body: sectionData
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: 'Section', id: 'LIST' },
        { type: 'Course', id: courseId }
      ]
    }),

    // Cập nhật chương
    updateSection: builder.mutation<ApiResponse<Section>, { sectionId: string; title: string }>({
      query: ({ sectionId, title }) => ({
        url: `/sections/${sectionId}`,
        method: 'PUT',
        body: { title }
      }),
      invalidatesTags: (_result, _error, { sectionId }) => [
        { type: 'Section', id: sectionId },
        { type: 'Section', id: 'LIST' },
        { type: 'Course', id: _result?.data?.courseId }
      ]
    }),

    // Xóa chương
    deleteSection: builder.mutation<ApiResponse<Section>, string>({
      query: (sectionId) => ({
        url: `/sections/${sectionId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, sectionId) => [
        { type: 'Section', id: sectionId },
        { type: 'Section', id: 'LIST' },
        { type: 'Course', id: _result?.data?.courseId }
      ]
    }),

    // Cập nhật thứ tự các chương
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

export const {
  useGetCourseSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useUpdateSectionOrderMutation
} = sectionApi
