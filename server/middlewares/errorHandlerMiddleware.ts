import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'

export default (err, req: Request, res: Response, next: NextFunction) => {
  // Convert errors to Boom errors
  const boomError = Boom.isBoom(err) ? err : Boom.internal(err.message)
  return res.status(boomError.output.statusCode).json(boomError.output.payload)
}
