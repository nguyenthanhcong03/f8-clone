import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import enrollmentAPI from '@/services/enrollmetAPI'

interface EnrollmentState {
  loading: boolean
  checkingEnrollment: boolean
  enrolled: boolean
  error: string | null
}

const initialState: EnrollmentState = {
  loading: false,
  checkingEnrollment: false,
  enrolled: false,
  error: null
}

// Async thunks
export const enrollCourse = createAsyncThunk('enrollment/enrollCourse', async (id: number, { rejectWithValue }) => {
  try {
    const response = await enrollmentAPI.enrollCourse(id)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng ký khóa học'
    return rejectWithValue(message)
  }
})

export const checkEnrollment = createAsyncThunk(
  'enrollment/checkEnrollment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.checkEnrollment(id)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi kiểm tra đăng ký khóa học'
      return rejectWithValue(message)
    }
  }
)

// export const getUserEnrollments = createAsyncThunk('enrollment/getUserEnrollments', async (_, { rejectWithValue }) => {
//   try {
//     await courseAPI.deleteCourse(id)
//     return id
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : 'Failed to delete course'
//     return rejectWithValue(message)
//   }
// })

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Enroll courses
    builder
      .addCase(enrollCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.loading = false
        state.enrolled = true
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Check enrollment
      .addCase(checkEnrollment.pending, (state) => {
        state.checkingEnrollment = true
        state.error = null
      })
      .addCase(checkEnrollment.fulfilled, (state, action) => {
        state.checkingEnrollment = false
        state.enrolled = action.payload.enrolled
      })
      .addCase(checkEnrollment.rejected, (state, action) => {
        state.checkingEnrollment = false
        state.error = action.payload as string
      })
  }
})

// export const {} = enrollmentSlice.actions
export default enrollmentSlice.reducer
