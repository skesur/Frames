export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500
  const message    = err.message    || 'Internal Server Error'

  console.error(`[${req.method}] ${req.path} → ${statusCode}: ${message}`)

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}