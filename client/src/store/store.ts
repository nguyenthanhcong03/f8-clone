import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import appReducer from './appSlice'
import authReducer from './features/auth/authSlice'
import themeReducer from './features/theme/themeSlice'
import snackbarReducer from './snackbarSlice'

export const store = configureStore({
  reducer: {
    // API reducers
    [baseApi.reducerPath]: baseApi.reducer,

    // Application state
    theme: themeReducer,
    app: appReducer,
    snackbar: snackbarReducer,

    // Authentication
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các trường không serializable trong FormData
        ignoredActions: ['courseApi/executeMutation', 'lessonApi/executeMutation'],
        ignoredPaths: ['courses.formData']
      }
    }).concat(baseApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
