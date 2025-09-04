import axiosInstance from '../config/axios'
import type { ApiResponse } from '@/types/api'
import type { Course, Section, Lesson } from '@/types/course'
import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'

const API_ENDPOINT = '/enrollments'

export const enrollCourse = async (id: number) => {
  const response = await axiosInstance.post(API_ENDPOINT, { id })
  return response
}

export const getUserEnrollments = async () => {
  const response = await axiosInstance.get(API_ENDPOINT)
  return response
}

export const checkEnrollment = async (id: number) => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/check/${id}`)
  return response
}

export const unenrollCourse = async (id: number) => {
  const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`)
  return response
}

const enrollmentAPI = {
  enrollCourse,
  getUserEnrollments,
  checkEnrollment,
  unenrollCourse
}

export default enrollmentAPI
