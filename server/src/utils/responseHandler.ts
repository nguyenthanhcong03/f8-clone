import { Response } from 'express'

export const responseHandler = (res: Response, statusCode: number, message: string, data?: any) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data: data || null
  })
}
