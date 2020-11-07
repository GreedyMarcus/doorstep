import { Request, Response } from 'express'
import Boom from '@hapi/boom'

export default (err, req: Request, res: Response) => {
  // Convert errors to Boom errors
  const boomError = Boom.isBoom(err) ? err : Boom.internal(err.message)
  return res.status(boomError.output.statusCode).json(boomError.output.payload)
}
