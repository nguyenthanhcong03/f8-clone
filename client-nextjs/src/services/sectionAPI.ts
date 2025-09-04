import type { ApiResponse } from '@/types/api'
import type { Section } from '@/types/course'
import axiosInstance from '../config/axios'

const API_ENDPOINT = '/sections'

export const getCourseSections = async (courseId: number) => {
  const response = await axiosInstance.get<ApiResponse<Section[]>>(`${API_ENDPOINT}/${courseId}`)
  return response
}

export const createSection = async (sectionData: { title: string; course_id: number }) => {
  const response = await axiosInstance.post<ApiResponse<Section>>(API_ENDPOINT, sectionData)
  return response
}

export const updateSection = async (sectionId: number, sectionData: { title: string }) => {
  const response = await axiosInstance.put<ApiResponse<Section>>(`${API_ENDPOINT}/${sectionId}`, sectionData)
  return response
}

export const deleteSection = async (sectionId: number) => {
  const response = await axiosInstance.delete<ApiResponse<Section>>(`${API_ENDPOINT}/${sectionId}`)
  return response
}

export const updateSectionOrder = async (courseId: number, sectionIds: number[]) => {
  const response = await axiosInstance.put<ApiResponse<Section[]>>(`${API_ENDPOINT}/${courseId}/reorder`, {
    sectionIds
  })
  return response
}

// export const getSectionLessons = async (sectionId: number) => {
//   const response = await axiosInstance.get<ApiResponse<Lesson[]>>(`/${sectionId}/lessons`)
//   return response
// }

export default {
  getCourseSections,
  createSection,
  updateSection,
  deleteSection,
  updateSectionOrder
}
