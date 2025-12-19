import { baseApi } from '@/services/api/baseApi'
import { configureStore } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import authReducer from './features/auth/authSlice'
import themeReducer from './features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    // API reducers
    [baseApi.reducerPath]: baseApi.reducer,

    // Application state
    theme: themeReducer,
    app: appReducer,

    // Authentication
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
})

// // Thay vì gọi getCurrentUser trong App.tsx, ta có thể gọi nó ngay khi khởi tạo store
// const initializeApp = async () => {
//   const data = await store.dispatch(authApi.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }))
//   console.log('👉check: ', data)
// }
// initializeApp()

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
