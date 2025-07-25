class ApiError extends Error {
  statusCode: number
  errors: unknown | null
  isOperational: boolean

  constructor(
    statusCode: number,
    message: string,
    errors: unknown | null = null,
    isOperational: boolean = true,
    stack: string = ''
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = isOperational

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApiError
