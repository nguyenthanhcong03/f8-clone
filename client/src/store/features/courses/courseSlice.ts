import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'
import courseAPI from '@/services/courseAPI'
import type { Course } from '@/types/course'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface CourseState {
  courses: Course[]
  loading: boolean
  error: string | null
  currentCourse: Course | null
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
  currentCourse: null
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

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await courseAPI.getCourseById(courseId)
      console.log('response.data', response.data)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to fetch course with ID ${courseId}`
      return rejectWithValue(message)
    }
  }
)

export const fetchCourseBySlug = createAsyncThunk(
  'courses/fetchCourseBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await courseAPI.getCourseBySlug(slug)
      console.log(response.data)

      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to fetch course with ID ${slug}`
      return rejectWithValue(message)
    }
  }
)

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
  async ({ id, data }: { id: number; data: FormData | UpdateCourseInput }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.updateCourse(id, data)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update course'
      return rejectWithValue(message)
    }
  }
)

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id: string, { rejectWithValue }) => {
  try {
    await courseAPI.deleteCourse(id)
    return id
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete course'
    return rejectWithValue(message)
  }
})

export const updateLessonOrder = createAsyncThunk(
  'courses/updateLessonOrder',
  async ({ sectionId, lessonIds }: { sectionId: string; lessonIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.updateLessonOrder(sectionId, lessonIds)
      return { sectionId, lessons: response.data }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update lesson order'
      return rejectWithValue(message)
    }
  }
)

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
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
        state.courses = action.payload.courses
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch course by id
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload.course
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch course by slug
    builder
      .addCase(fetchCourseBySlug.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload.course
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
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
        state.courses.push(action.payload.data)
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
        const index = state.courses.findIndex((course) => course.id === action.payload.data.id)
        if (index !== -1) {
          state.courses[index] = action.payload.data
          state.currentCourse = action.payload.data
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
        state.courses = state.courses.filter((course) => course.id !== action.meta.arg)
        if (state.currentCourse && state.currentCourse.id === action.meta.arg) {
          state.currentCourse = null
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError } = courseSlice.actions
export default courseSlice.reducer
