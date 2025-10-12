import authAPI from '@/services/authAPI'
import type { RegisterInput } from '@/types/auth'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface AuthState {
  user: any | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: false,
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

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ email, password })
      localStorage.setItem('accessToken', response.data.accessToken)
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại'
      return rejectWithValue(errorMessage)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout()
    return null
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Đăng xuất thất bại'
    return rejectWithValue(errorMessage)
  }
})

// GET CURRENT USER
export const getCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await authAPI.getCurrentUser()
    return res.data
  } catch (err: any) {
    return rejectWithValue('Failed to fetch user')
  }
})

// REFRESH
export const refreshToken = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/refresh')
    return res.data // { accessToken }
  } catch (err: any) {
    return rejectWithValue('Refresh failed')
  }
})
// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(login.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
    })
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // // GET CURRENT USER
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.isLoading = false
      state.user = null
      state.isAuthenticated = false
      state.error = action.payload as string
    })

    // // REFRESH
    // builder.addCase(refreshToken.fulfilled, (state, action) => {
    //   state.accessToken = action.payload.accessToken;
    //   localStorage.setItem("accessToken", action.payload.accessToken);
    // });

    // LOGOUT
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      localStorage.removeItem('accessToken')
    })
  }
})

// export const {} = authSlice.actions
export default authSlice.reducer
