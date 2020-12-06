import Boom from '@hapi/boom'
import { Request, Response, NextFunction } from 'express'

/**
 * Custom middleware for error handling in the application.
 * It sends the specified error as Boom error in the response.
 */
export default (err, req: Request, res: Response, next: NextFunction) => {
  // Convert error to Boom error
  const boomError = Boom.isBoom(err) ? err : Boom.internal(err.message)
  return res.status(boomError.output.statusCode).json(boomError.output.payload)
}
