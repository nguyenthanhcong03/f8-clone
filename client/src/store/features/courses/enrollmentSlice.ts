import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import enrollmentAPI from '@/services/enrollmetAPI'

interface EnrollmentState {
  enrolled: boolean
  loading: boolean
  error: string | null
}

const initialState: EnrollmentState = {
  enrolled: false,
  loading: false,
  error: null
}

// Async thunks
export const enrollCourse = createAsyncThunk(
  'enrollment/enrollCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.enrollCourse(courseId)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng ký khóa học'
      return rejectWithValue(message)
    }
  }
)

export const checkEnrollment = createAsyncThunk(
  'enrollment/checkEnrollment',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.checkEnrollment(slug)
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
      .addCase(enrollCourse.fulfilled, (state) => {
        state.enrolled = true
        state.loading = false
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Check enrollment
      .addCase(checkEnrollment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkEnrollment.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(checkEnrollment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

// export const {} = enrollmentSlice.actions
export default enrollmentSlice.reducer
