import Joi from 'joi'
import Boom from '@hapi/boom'
import { Request, Response, NextFunction } from 'express'

/**
 * Custom middleware that verifies if the request object matches the expected object schema,
 * that is specified in the parameters.
 * - Sends a 400 Bad Request error if schema does not match.
 */
export default (validationSchema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const validationResult = validationSchema.validate(req.body)
  if (validationResult.error) {
    return next(Boom.badRequest(validationResult.error.details[0].message))
  }
  next()
}
