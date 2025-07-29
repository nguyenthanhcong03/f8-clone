import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import courseAPI from '@/services/courseAPI'
import type { Course } from '@/types/course'
import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'

interface CourseState {
  courses: Course[]
  loading: boolean
  error: string | null
  selectedCourse: Course | null
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
  selectedCourse: null
}

// Async thunks
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, { rejectWithValue }) => {
  try {
    const response = await courseAPI.getAllCourses()
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch courses'
    return rejectWithValue(message)
  }
})

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData: CreateCourseInput, { rejectWithValue }) => {
    try {
      const response = await courseAPI.createCourse(courseData)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create course'
      return rejectWithValue(message)
    }
  }
)

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }: { id: number; data: UpdateCourseInput }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.updateCourse(id, data)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update course'
      return rejectWithValue(message)
    }
  }
)

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id: number, { rejectWithValue }) => {
  try {
    await courseAPI.deleteCourse(id)
    return id
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete course'
    return rejectWithValue(message)
  }
})

export const uploadThumbnail = createAsyncThunk(
  'courses/uploadThumbnail',
  async ({ id, file }: { id: number; file: File }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.uploadThumbnail(id, file)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upload thumbnail'
      return rejectWithValue(message)
    }
  }
)

export const deleteThumbnail = createAsyncThunk('courses/deleteThumbnail', async (id: number, { rejectWithValue }) => {
  try {
    const response = await courseAPI.deleteThumbnail(id)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete thumbnail'
    return rejectWithValue(message)
  }
})

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
      state.selectedCourse = action.payload
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null
    }
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create course
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false
        state.courses.push(action.payload)
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update course
    builder
      .addCase(updateCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false
        const index = state.courses.findIndex((course) => course.id === action.payload.id)
        if (index !== -1) {
          state.courses[index] = action.payload
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Delete course
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false
        state.courses = state.courses.filter((course) => course.id !== action.payload)
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Upload thumbnail
    builder
      .addCase(uploadThumbnail.fulfilled, (state, action) => {
        const index = state.courses.findIndex((course) => course.id === action.payload.id)
        if (index !== -1) {
          state.courses[index] = action.payload
        }
      })
      .addCase(uploadThumbnail.rejected, (state, action) => {
        state.error = action.payload as string
      })

    // Delete thumbnail
    builder
      .addCase(deleteThumbnail.fulfilled, (state, action) => {
        const index = state.courses.findIndex((course) => course.id === action.payload.id)
        if (index !== -1) {
          state.courses[index] = action.payload
        }
      })
      .addCase(deleteThumbnail.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const { clearError, setSelectedCourse, clearSelectedCourse } = courseSlice.actions
export default courseSlice.reducer
