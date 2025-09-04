import progressAPI from '@/services/progressAPI'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { is } from 'zod/v4/locales'

interface LessonState {
  loading: boolean
  error: string | null
  success: boolean
  isCompleted: boolean
}

const initialState: LessonState = {
  loading: false,
  error: null,
  success: false,
  isCompleted: false
}

export const saveProgress = createAsyncThunk(
  'progress/saveProgress',
  async (
    {
      lessonId,
      isCompleted
    }: {
      lessonId: number
      isCompleted: boolean
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await progressAPI.saveProgress(lessonId, isCompleted)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save progress'
      return rejectWithValue(message)
    }
  }
)

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create lesson
    builder
      .addCase(saveProgress.pending, (state) => {
        state.loading = true
      })
      .addCase(saveProgress.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.isCompleted = true
      })
      .addCase(saveProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
  }
})

// export const {} = progressSlice.actions
export default progressSlice.reducer
