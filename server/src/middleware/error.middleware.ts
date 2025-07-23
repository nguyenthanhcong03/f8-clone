import { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  })
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  })
}
