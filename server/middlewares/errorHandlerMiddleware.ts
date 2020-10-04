import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'

export default async (err: Boom.Boom, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.output.statusCode).json(err.output.payload)
}
