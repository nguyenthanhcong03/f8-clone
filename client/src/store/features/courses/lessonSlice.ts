import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import lessonAPI from '@/services/lessonAPI'
import type { Lesson } from '@/types/course'

interface LessonState {
  currentLesson: Lesson | null
  loading: boolean
  error: string | null
}

const initialState: LessonState = {
  currentLesson: null,
  loading: false,
  error: null
}

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchLessonById',
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.getLessonById(lessonId)
      console.log(response)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to fetch lesson ${lessonId}`
      return rejectWithValue(message)
    }
  }
)

export const fetchSectionLessons = createAsyncThunk(
  'lessons/fetchSectionLessons',
  async (sectionId: string, { rejectWithValue }) => {
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
      courseId,
      sectionId,
      title,
      content,
      video_url,
      videoFile
    }: {
      courseId: string
      sectionId: string
      title: string
      content?: string
      video_url?: string
      video_publicId?: string
      videoFile?: File
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await lessonAPI.createLesson({
        courseId,
        sectionId,
        title,
        content,
        video_url,
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
      videoFile
    }: {
      lessonId: string
      title?: string
      content?: string
      video_url?: string
      videoFile?: File
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await lessonAPI.updateLesson(lessonId, {
        title,
        content,
        video_url,
        videoFile
      })
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update lesson'
      return rejectWithValue(message)
    }
  }
)

export const deleteLesson = createAsyncThunk('lessons/deleteLesson', async (lessonId: string, { rejectWithValue }) => {
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
    clearerror: (state) => {
      state.error = null
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null
    }
  },
  extraReducers: (builder) => {
    // Fetch lesson by ID
    builder
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false
        state.currentLesson = action.payload
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create lesson
    builder
      .addCase(createLesson.pending, (state) => {
        state.loading = true
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false
        // state.lessons.push(action.payload)
        state.currentLesson = action.payload
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update lesson
    builder
      .addCase(updateLesson.pending, (state) => {
        state.loading = true
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false
        const updatedLesson = action.payload.data
        const index = state.lessons.findIndex((lesson) => lesson.id === updatedLesson.id)
        if (index !== -1) {
          state.lessons[index] = updatedLesson
        }
        state.currentLesson = updatedLesson
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
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

export const { clearerror, clearCurrentLesson } = lessonSlice.actions
export default lessonSlice.reducer
