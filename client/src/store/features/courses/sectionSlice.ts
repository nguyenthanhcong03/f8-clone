import sectionAPI, { createSection, getCourseSections, updateSection, deleteSection } from '@/services/sectionAPI'
import type { Section } from '@/types/course'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface SectionState {
  sections: Section[]
  sectionsLoading: boolean
  sectionsError: string | null
}

const initialState: SectionState = {
  sections: [],
  sectionsLoading: false,
  sectionsError: null
}

export const fetchCourseSections = createAsyncThunk(
  'courses/fetchCourseSections',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await getCourseSections(courseId)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to fetch sections for course ${courseId}`
      return rejectWithValue(message)
    }
  }
)

export const addSection = createAsyncThunk(
  'sections/addSection',
  async ({ title, courseId }: { title: string; courseId: string }, { rejectWithValue }) => {
    try {
      const response = await createSection({ title, courseId })
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create section'
      return rejectWithValue(message)
    }
  }
)

export const editSection = createAsyncThunk(
  'sections/editSection',
  async ({ sectionId, title }: { sectionId: string; title: string }, { rejectWithValue }) => {
    try {
      const response = await updateSection(sectionId, { title })
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update section'
      return rejectWithValue(message)
    }
  }
)

export const removeSection = createAsyncThunk(
  'sections/removeSection',
  async (sectionId: string, { rejectWithValue }) => {
    try {
      const response = await deleteSection(sectionId)
      return { sectionId, data: response.data }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete section'
      return rejectWithValue(message)
    }
  }
)

export const updateSectionOrder = createAsyncThunk(
  'courses/updateSectionOrder',
  async ({ courseId, sectionIds }: { courseId: string; sectionIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await sectionAPI.updateSectionOrder(courseId, sectionIds)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update section order'
      return rejectWithValue(message)
    }
  }
)

const sectionSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.sectionsError = null
    },
    setItems: (state, action) => {
      state.sections = action.payload
    }
  },
  extraReducers: (builder) => {
    // Fetch sections
    builder
      .addCase(fetchCourseSections.pending, (state) => {
        state.sectionsLoading = true
        state.sectionsError = null
      })
      .addCase(fetchCourseSections.fulfilled, (state, action) => {
        console.log('action.payload', action.payload)
        state.sectionsLoading = false
        state.sections = action.payload
      })
      .addCase(fetchCourseSections.rejected, (state, action) => {
        state.sectionsLoading = false
        state.sectionsError = action.payload as string
      })

    // Add new section
    builder
      .addCase(addSection.pending, (state) => {
        state.sectionsLoading = true
      })
      .addCase(addSection.fulfilled, (state, action) => {
        state.sectionsLoading = false
        state.sections.push(action.payload.data)
      })
      .addCase(addSection.rejected, (state, action) => {
        state.sectionsLoading = false
        state.sectionsError = action.payload as string
      })

    // Edit section
    builder
      .addCase(editSection.pending, (state) => {
        state.sectionsLoading = true
      })
      .addCase(editSection.fulfilled, (state, action) => {
        state.sectionsLoading = false
        const index = state.sections.findIndex((section) => section.id === action.payload.data.id)
        if (index !== -1) {
          state.sections[index] = action.payload.data
        }
      })
      .addCase(editSection.rejected, (state, action) => {
        state.sectionsLoading = false
        state.sectionsError = action.payload as string
      })

    // Remove section
    builder
      .addCase(removeSection.pending, (state) => {
        state.sectionsLoading = true
      })
      .addCase(removeSection.fulfilled, (state, action) => {
        state.sectionsLoading = false
        state.sections = state.sections.filter((section) => section.id !== action.payload.sectionId)
      })
      .addCase(removeSection.rejected, (state, action) => {
        state.sectionsLoading = false
        state.sectionsError = action.payload as string
      })

    // // Update section order
    // builder
    //   .addCase(updateSectionOrder.pending, (state) => {
    //     state.sectionsLoading = true
    //   })
    //   .addCase(updateSectionOrder.fulfilled, (state, action) => {
    //     state.sectionsLoading = false
    //     state.sections = action.payload
    //   })
    //   .addCase(updateSectionOrder.rejected, (state, action) => {
    //     state.sectionsLoading = false
    //     state.sectionsError = action.payload as string
    //   })
  }
})

export const { clearError, setItems } = sectionSlice.actions
export default sectionSlice.reducer
