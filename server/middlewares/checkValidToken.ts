import { Request, Response, NextFunction } from 'express'
import Boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import config from '../config'

export default (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.replace('Bearer ', '')
  if (!token) {
    return next(Boom.unauthorized())
  }

  try {
    const user = jwt.verify(token, config.auth.tokenSecret)
    res.locals.user = user
    return next()
  } catch (err) {
    return next(Boom.forbidden())
  }
}
