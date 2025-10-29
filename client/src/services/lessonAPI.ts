import type { ApiResponse } from '@/types/api'
import type { Lesson } from '@/types/course'
import axiosInstance from '../config/axios'

const API_ENDPOINT = '/lessons'

export const getLessonById = async (lessonId: string) => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/${lessonId}`)
  return response
}

export const getSectionLessons = async (sectionId: string) => {
  const response = await axiosInstance.get(`/sections/${sectionId}/lessons`)
  return response
}

export const createLesson = async (lessonData: {
  courseId: string
  sectionId: string
  title: string
  content?: string
  video_url?: string
  videoFile?: File
}) => {
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

  const response = await axiosInstance.post(API_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const updateLesson = async (
  lessonId: string,
  lessonData: {
    title?: string
    content?: string
    video_url?: string
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

  if (lessonData.video_url) {
    formData.append('video_url', lessonData.video_url)
  }

  if (lessonData.videoFile) {
    formData.append('videoFile', lessonData.videoFile)
  }

  const response = await axiosInstance.put(`${API_ENDPOINT}/${lessonId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const deleteLesson = async (lessonId: string) => {
  const response = await axiosInstance.delete(`${API_ENDPOINT}/${lessonId}`)
  return response
}

export const updateLessonOrder = async (sectionId: string, lessonIds: string[]) => {
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
