import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import authAPI from '../services/authAPI'
import type { LoginInput, RegisterInput } from '@/types/auth'

interface User {
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'admin' | 'student'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null
}

// Async thunks
export const register = createAsyncThunk('auth/register', async (userData: RegisterInput, { rejectWithValue }) => {
  try {
    const user = await authAPI.register(userData)
    return user
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại'
    return rejectWithValue(errorMessage)
  }
})

export const login = createAsyncThunk('auth/login', async (credentials: LoginInput, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials)
    console.log('first response:', response)

    // Save to localStorage
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại'
    return rejectWithValue(errorMessage)
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout()
    return null
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Đăng xuất thất bại'
    return rejectWithValue(errorMessage)
  }
})

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
      }>
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false

      // Also clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false
        // Registration successful, but the user isn't logged in yet
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.data.user
        state.accessToken = action.payload.data.accessToken
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

// Export actions and reducer
export const { setCredentials, clearCredentials, setError, clearError } = authSlice.actions

export default authSlice.reducer
