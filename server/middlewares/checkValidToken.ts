import Boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import config from '../config'
import { Request, Response, NextFunction } from 'express'

/**
 * Custom middleware that verifies if the user is authenticated.
 * - Sends a 401 Unauthorized error if JWT token is missing or expired.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  // Access JWT token from the request headers
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.replace('Bearer ', '')

  if (!token) {
    return next(Boom.unauthorized())
  }

  try {
    const data = jwt.verify(token, config.auth.tokenSecret)
    res.locals.userId = data['user']
    return next()
  } catch (err) {
    return next(Boom.unauthorized())
  }
}
