import { type FetchBaseQueryError } from '@reduxjs/toolkit/query'

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error != null && 'message' in error && typeof (error as any).message === 'string'
}

// export const getErrorMessage = (err: unknown): string => {
//   if (isFetchBaseQueryError(err)) {
//     const errMsg = 'error' in err ? err.error : err.data.message
//     return errMsg
//   } else if (isErrorWithMessage(err)) {
//     return err.message
//   }
//   return 'Lỗi không xác định'
// }

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    if (typeof error.data === 'object' && error.data && 'message' in error.data) {
      return (error.data as any).message
    }

    return `HTTP Error: ${error.status}`
  }

  if (isErrorWithMessage(error)) {
    return error.message
  }

  return 'Lỗi không xác định'
}
