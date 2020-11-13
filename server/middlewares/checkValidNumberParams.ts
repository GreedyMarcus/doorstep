import Boom from '@hapi/boom'
import { Request, Response, NextFunction } from 'express'

/**
 * Custom middleware that verifies if all of the request parameters are valid numbers.
 * - Sends a 400 Bad Request error if any of the parameters is not a number.
 */
export default (params: string[]) => (req: Request, res: Response, next: NextFunction) => {
  params.forEach(param => {
    const parsedParam = Number(req.params[param])
    if (!parsedParam) {
      return next(Boom.badRequest(`Invalid ${param} parameter: '${req.params[param]}'`))
    }
  })
  next()
}
