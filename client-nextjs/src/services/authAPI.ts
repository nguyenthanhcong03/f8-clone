import type { LoginInput, RegisterInput } from '@/types/auth'
import axiosInstance from '../config/axios'

const API_ENDPOINT = '/auth'

export const register = async (userData: RegisterInput) => {
  const response = await axiosInstance.post(`${API_ENDPOINT}/register`, userData)
  console.log('response', response)
  return response
}

export const login = async (credentials: LoginInput) => {
  const response = await axiosInstance.post(`${API_ENDPOINT}/login`, credentials)
  return response
}

export const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {
  const response = await axiosInstance.patch(`${API_ENDPOINT}/${userId}/change-password`, {
    currentPassword,
    newPassword
  })
  return response.data
}

export const logout = async (): Promise<void> => {
  // If your backend has a logout endpoint to invalidate tokens
  // await axiosInstance.post(`${API_ENDPOINT}/logout`);

  // For client-side logout (remove tokens from local storage)
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

export const refreshToken = async () => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/refresh-token`)
  return response.data
}

const authAPI = {
  register,
  login,
  changePassword,
  logout
}

export default authAPI
