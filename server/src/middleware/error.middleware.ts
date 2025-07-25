import { Request, Response, NextFunction } from 'express'
import ApiError from '@/utils/ApiError'

interface CustomError extends Error {
  statusCode?: number
  errors?: any
}

export const errorConverter = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  let error = err

  // Tạo object ánh xạ mã trạng thái HTTP
  const statusText: Record<number, string> = {
    400: 'Bad Request',
    500: 'Internal Server Error'
    // Có thể thêm các mã khác nếu cần
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500
    const message = error.message || statusText[statusCode] || 'Unknown Error'

    error = new ApiError(statusCode, message, null, false, err.stack)
  }

  next(error)
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  // console.error(err.stack)

  console.log('ERROR LOG ', new Date().toLocaleString())
  console.log('Request:', req.method, req.originalUrl)
  console.log('Params:', req.params)
  console.log('Body:', req.body)
  console.log('Query:', req.query)
  console.log('Error: ', err)
  // console.log('Error stack: ', err.stack)
  console.log('--------------------------------------------------------------------------------------')
  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Internal server error',
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  })
}
