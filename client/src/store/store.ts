import { configureStore } from '@reduxjs/toolkit'
import courseReducer from './features/courses/courseSlice'
import themeReducer from './features/theme/themeSlice'
import authReducer from './features/auth/authSlice'
import sectionReducer from './features/courses/sectionSlice'
import lessonReducer from './features/courses/lessonSlice'
import enrollmentReducer from './features/courses/enrollmentSlice'
import appReducer from './appSlice'
import snackbarReducer from './snackbarSlice'
import progressReducer from './features/courses/progressSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    app: appReducer,
    snackbar: snackbarReducer,
    courses: courseReducer,
    auth: authReducer,
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
