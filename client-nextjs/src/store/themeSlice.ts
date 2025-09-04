import { createSlice } from '@reduxjs/toolkit'

interface ThemeState {
  mode: 'light' | 'dark'
}

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  }
  return 'light'
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode)
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode)
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
