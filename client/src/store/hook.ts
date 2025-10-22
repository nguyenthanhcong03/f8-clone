import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { skipToken } from '@reduxjs/toolkit/query/react'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

// RTK Query tiện ích
export const isLoading = (status: QueryStatus) => status === QueryStatus.pending
export const isSuccess = (status: QueryStatus) => status === QueryStatus.fulfilled
export const isError = (status: QueryStatus) => status === QueryStatus.rejected
export const isUninitialized = (status: QueryStatus) => status === QueryStatus.uninitialized

// Re-export skipToken để sử dụng dễ dàng hơn
export { skipToken }
