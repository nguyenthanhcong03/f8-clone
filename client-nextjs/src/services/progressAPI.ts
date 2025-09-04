import axiosInstance from '../config/axios'

const API_ENDPOINT = '/progress'

const saveProgress = async (lessonId: number, isCompleted: boolean) => {
  const response = await axiosInstance.post(`${API_ENDPOINT}`, {
    lessonId,
    isCompleted
  })
  return response
}

export default {
  saveProgress
}
