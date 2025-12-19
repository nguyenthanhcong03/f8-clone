import { isLoading } from './../../hook'
import type { User } from '@/types/user'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
}

const initialUser = (() => {
  try {
    const data = localStorage.getItem('user')
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
})()

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: false,
  isLoading: true,
  accessToken: localStorage.getItem('accessToken')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User | null>) => {
      state.isAuthenticated = true
      if (action.payload) localStorage.setItem('user', JSON.stringify(action.payload))
      else localStorage.removeItem('user')
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    setIsAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    logout: (state) => {
      state.accessToken = null
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
    }
  }
})

export const { setCredentials, setToken, logout, setIsAuthLoading } = authSlice.actions
export default authSlice.reducer
