import axiosInstance from '../config/axios'

const API_ENDPOINT = '/enrollments'

export const enrollCourse = async (courseId: string) => {
  const response = await axiosInstance.post(API_ENDPOINT, { courseId })
  return response
}

export const getUserEnrollments = async () => {
  const response = await axiosInstance.get(API_ENDPOINT)
  return response
}

export const checkEnrollment = async (slug: string) => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/check/${slug}`)
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
