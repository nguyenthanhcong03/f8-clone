import type { ApiResponse } from '@/types/api'
import type { Lesson } from '@/types/course'
import axiosInstance from '../config/axios'

const API_ENDPOINT = '/lessons'

export const getLessonById = async (lessonId: number) => {
  const response = await axiosInstance.get<ApiResponse<Lesson>>(`${API_ENDPOINT}/${lessonId}`)
  return response
}

export const getSectionLessons = async (sectionId: number) => {
  const response = await axiosInstance.get<ApiResponse<Lesson[]>>(`/sections/${sectionId}/lessons`)
  return response
}

export const createLesson = async (lessonData: {
  section_id: number
  title: string
  content?: string
  videoFile?: File
}) => {
  const formData = new FormData()

  // Add text fields to FormData
  formData.append('section_id', lessonData.section_id.toString())
  formData.append('title', lessonData.title)

  if (lessonData.content) {
    formData.append('content', lessonData.content)
  }

  // Add video file if present
  if (lessonData.videoFile) {
    formData.append('videoFile', lessonData.videoFile)
  }

  const response = await axiosInstance.post<ApiResponse<Lesson>>(API_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const updateLesson = async (
  lessonId: number,
  lessonData: {
    title?: string
    content?: string
    videoFile?: File
  }
) => {
  const formData = new FormData()

  // Add text fields to FormData
  if (lessonData.title) {
    formData.append('title', lessonData.title)
  }

  if (lessonData.content) {
    formData.append('content', lessonData.content)
  }

  // Add video file if present
  if (lessonData.videoFile) {
    formData.append('videoFile', lessonData.videoFile)
  }

  const response = await axiosInstance.put<ApiResponse<Lesson>>(`${API_ENDPOINT}/${lessonId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const deleteLesson = async (lessonId: number) => {
  const response = await axiosInstance.delete<ApiResponse<Lesson>>(`${API_ENDPOINT}/${lessonId}`)
  return response
}

export const updateLessonOrder = async (sectionId: number, lessonIds: number[]) => {
  const response = await axiosInstance.put<ApiResponse<Lesson[]>>(`/sections/${sectionId}/lessons/reorder`, {
    lessonIds
  })
  return response
}

export default {
  getLessonById,
  getSectionLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  updateLessonOrder
}
