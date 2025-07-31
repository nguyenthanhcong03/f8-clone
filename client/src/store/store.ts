import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import authReducer from './authSlice'
import courseReducer from './courseSlice'
import sectionReducer from './sectionSlice'
import lessonReducer from './lessonSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    courses: courseReducer,
    sections: sectionReducer,
    lessons: lessonReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
