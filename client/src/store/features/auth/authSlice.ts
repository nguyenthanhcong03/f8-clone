import type { User } from '@/types/user'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: localStorage.getItem('accessToken')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User | null>) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    logout: (state) => {
      state.accessToken = null
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('accessToken')
    }
  }
})

export const { setCredentials, setToken, logout } = authSlice.actions
export default authSlice.reducer
