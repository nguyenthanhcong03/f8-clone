import type { CreateCourseInput, UpdateCourseInput } from '@/schemas/course.schema'
import courseAPI from '@/services/courseAPI'
import { getCourseSections } from '@/services/sectionAPI'
import type { Course, Section } from '@/types/course'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface CourseState {
  courses: Course[]
  loading: boolean
  error: string | null
  currentCourse: Course | null
  totalSections: number
  totalLessons: number
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
  currentCourse: null,
  totalSections: 0,
  totalLessons: 0
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

export const fetchCourseById = createAsyncThunk('courses/fetchCourseById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await courseAPI.getCourseById(id)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : `Failed to fetch course with ID ${id}`
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

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id: number, { rejectWithValue }) => {
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
  async ({ sectionId, lessonIds }: { sectionId: number; lessonIds: number[] }, { rejectWithValue }) => {
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
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null
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

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload.course
        state.totalSections = action.payload.totalSections
        state.totalLessons = action.payload.totalLessons
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
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

    // // Update lesson order
    // builder
    //   .addCase(updateLessonOrder.pending, (state) => {
    //     state.lessonsLoading = true
    //   })
    //   .addCase(updateLessonOrder.fulfilled, (state, action) => {
    //     state.lessonsLoading = false
    //     const { sectionId, lessons } = action.payload
    //     const sectionIndex = state.sections.findIndex((section) => section.id === sectionId)
    //     if (sectionIndex !== -1) {
    //       state.sections[sectionIndex].lessons = lessons.data
    //     }
    //   })
    //   .addCase(updateLessonOrder.rejected, (state, action) => {
    //     state.lessonsLoading = false
    //     state.lessonsError = action.payload as string
    //   })
  }
})

export const { clearError, clearCurrentCourse } = courseSlice.actions
export default courseSlice.reducer
