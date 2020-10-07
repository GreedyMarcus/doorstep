import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import Boom from '@hapi/boom'

export default (validationSchema: Joi.ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationResult = validationSchema.validate(req.body)
  if (validationResult.error) {
    return next(Boom.badRequest(validationResult.error.details[0].message))
  }
  next()
}
