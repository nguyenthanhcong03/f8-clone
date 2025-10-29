import axiosInstance from '../config/axios'
import type { ApiResponse } from '@/types/api'
import type { Course, Section, Lesson } from '@/types/course'
import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'

const API_ENDPOINT = '/courses'

export const getAllCourses = async () => {
  const response = await axiosInstance.get(API_ENDPOINT)
  return response
}

export const getCourseById = async (courseId: string) => {
  console.log('courseID', courseId)
  const response = await axiosInstance.get(`${API_ENDPOINT}/${courseId}`)
  return response
}

export const getCourseBySlug = async (slug: string) => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/slug/${slug}`)
  return response
}

export const createCourse = async (courseData: CreateCourseInput) => {
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

  const response = await axiosInstance.post<ApiResponse<Course>>(API_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const updateCourse = async (id: number, courseData: UpdateCourseInput | FormData) => {
  let response

  if (courseData instanceof FormData) {
    response = await axiosInstance.put<ApiResponse<Course>>(`${API_ENDPOINT}/${id}`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } else {
    response = await axiosInstance.put<ApiResponse<Course>>(`${API_ENDPOINT}/${id}`, courseData)
  }

  return response
}

export const deleteCourse = async (id: string) => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`${API_ENDPOINT}/${id}`)
  return response
}

export const updateLessonOrder = async (sectionId: string, lessonIds: string[]) => {
  const response = await axiosInstance.put<ApiResponse<Lesson[]>>(`/sections/${sectionId}/lessons/reorder`, {
    lessonIds
  })
  return response
}

const courseAPI = {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  updateLessonOrder
}

export default courseAPI
