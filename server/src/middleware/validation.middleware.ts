import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    })
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessages
      })
    }
    // return res.status(500).json({
    //   success: false,
    //   error: 'Internal server error'
    // })
    next(error)
  }
}
