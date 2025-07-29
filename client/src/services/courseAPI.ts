import axiosInstance from '../config/axios'
import type { ApiResponse } from '@/types/api'
import type { Course } from '@/types/course'
import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'

const API_ENDPOINT = '/courses'

export const getAllCourses = async () => {
  const response = await axiosInstance.get<ApiResponse<Course[]>>(API_ENDPOINT)
  return response
}

export const getCourseById = async (id: number) => {
  const response = await axiosInstance.get<ApiResponse<Course>>(`${API_ENDPOINT}/${id}`)
  return response
}

export const createCourse = async (courseData: CreateCourseInput) => {
  const formData = new FormData()

  // Append all form fields
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

  // Append thumbnail file if exists
  if (courseData.thumbnail instanceof File) {
    formData.append('thumbnail', courseData.thumbnail)
  }

  const response = await axiosInstance.post<ApiResponse<Course>>(API_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const updateCourse = async (id: number, courseData: UpdateCourseInput) => {
  const response = await axiosInstance.put<ApiResponse<Course>>(`${API_ENDPOINT}/${id}`, courseData)
  return response
}

export const deleteCourse = async (id: number) => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`${API_ENDPOINT}/${id}`)
  return response
}

export const uploadThumbnail = async (id: number, thumbnailFile: File) => {
  const formData = new FormData()
  formData.append('thumbnail', thumbnailFile)

  const response = await axiosInstance.post<ApiResponse<Course>>(`${API_ENDPOINT}/${id}/thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const deleteThumbnail = async (id: number) => {
  const response = await axiosInstance.delete<ApiResponse<Course>>(`${API_ENDPOINT}/${id}/thumbnail`)
  return response
}

const courseAPI = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadThumbnail,
  deleteThumbnail
}

export default courseAPI
