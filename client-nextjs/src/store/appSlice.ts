import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    globalLoading: false,
    activeTab: 'info'
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    }
  }
})

export const { setGlobalLoading, setActiveTab } = appSlice.actions

export default appSlice.reducer
