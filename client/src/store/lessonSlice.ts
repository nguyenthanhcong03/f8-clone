import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import lessonAPI from '@/services/lessonAPI'
import type { Lesson } from '@/types/course'

interface LessonState {
  currentLesson: Lesson | null
  lessonLoading: boolean
  lessonError: string | null
}

const initialState: LessonState = {
  currentLesson: null,
  lessonLoading: false,
  lessonError: null
}

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchLessonById',
  async (lessonId: number, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.getLessonById(lessonId)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to fetch lesson ${lessonId}`
      return rejectWithValue(message)
    }
  }
)

export const fetchSectionLessons = createAsyncThunk(
  'lessons/fetchSectionLessons',
  async (sectionId: number, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.getSectionLessons(sectionId)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to fetch lessons for section ${sectionId}`
      return rejectWithValue(message)
    }
  }
)

export const createLesson = createAsyncThunk(
  'lessons/createLesson',
  async (
    {
      section_id,
      title,
      content,
      video_url,
      video_public_id,
      videoFile
    }: {
      section_id: number
      title: string
      content?: string
      video_url?: string
      video_public_id?: string
      videoFile?: File
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await lessonAPI.createLesson({
        section_id,
        title,
        content,
        video_url,
        video_public_id,
        videoFile
      })
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create lesson'
      return rejectWithValue(message)
    }
  }
)

export const updateLesson = createAsyncThunk(
  'lessons/updateLesson',
  async (
    {
      lessonId,
      title,
      content,
      video_url,
      video_public_id,
      videoFile
    }: {
      lessonId: number
      title?: string
      content?: string
      video_url?: string
      video_public_id?: string
      videoFile?: File
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await lessonAPI.updateLesson(lessonId, {
        title,
        content,
        video_url,
        video_public_id,
        videoFile
      })
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update lesson'
      return rejectWithValue(message)
    }
  }
)

export const deleteLesson = createAsyncThunk('lessons/deleteLesson', async (lessonId: number, { rejectWithValue }) => {
  try {
    const response = await lessonAPI.deleteLesson(lessonId)
    return { lessonId, data: response.data }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete lesson'
    return rejectWithValue(message)
  }
})

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearLessonError: (state) => {
      state.lessonError = null
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null
    }
  },
  extraReducers: (builder) => {
    // Fetch lesson by ID
    builder
      .addCase(fetchLessonById.pending, (state) => {
        state.lessonLoading = true
        state.lessonError = null
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.lessonLoading = false
        state.currentLesson = action.payload
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.lessonLoading = false
        state.lessonError = action.payload as string
      })

    // Create lesson
    builder
      .addCase(createLesson.pending, (state) => {
        state.lessonLoading = true
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.lessonLoading = false
        state.lessons.push(action.payload.data)
        state.currentLesson = action.payload.data
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.lessonLoading = false
        state.lessonError = action.payload as string
      })

    // Update lesson
    builder
      .addCase(updateLesson.pending, (state) => {
        state.lessonLoading = true
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.lessonLoading = false
        const updatedLesson = action.payload.data
        const index = state.lessons.findIndex((lesson) => lesson.id === updatedLesson.id)
        if (index !== -1) {
          state.lessons[index] = updatedLesson
        }
        state.currentLesson = updatedLesson
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.lessonLoading = false
        state.lessonError = action.payload as string
      })

    // Delete lesson
    builder
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false
        state.lessons = state.lessons.filter((lesson) => lesson.id !== action.payload.lessonId)
        if (state.currentLesson && state.currentLesson.id === action.payload.lessonId) {
          state.currentLesson = null
        }
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearLessonError, clearCurrentLesson } = lessonSlice.actions
export default lessonSlice.reducer
