import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import authReducer from './authSlice'
import courseReducer from './courseSlice'
import sectionReducer from './sectionSlice'
import lessonReducer from './lessonSlice'
import enrollmentReducer from './enrollmentSlice'
import appReducer from './appSlice'
import snackbarReducer from './snackbarSlice'
import progressReducer from './progressSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    app: appReducer,
    snackbar: snackbarReducer,
    auth: authReducer,
    courses: courseReducer,
    sections: sectionReducer,
    lessons: lessonReducer,
    enrollment: enrollmentReducer,
    progress: progressReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
