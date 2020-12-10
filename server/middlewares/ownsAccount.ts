import TYPES from '../config/types'
import ERROR from '../utils/error'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { UserRepositoryInterface } from '../repositories/user'

/**
 * Custom middleware that verifies if the user owns the specified account.
 * - Sends a 404 Not Found error if the specified user does not exist.
 * - Sends a 403 Forbidden error if user does not own the account.
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = container.get<UserRepositoryInterface>(TYPES.UserRepository)
  const user = await userRepository.findUserById(Number(req.params.userId))
  if (!user) {
    return next(Boom.notFound(ERROR.USER_DOES_NOT_EXIST))
  }

  if (user.id !== res.locals.userId) {
    return next(Boom.forbidden(ERROR.USER_DOES_NOT_OWN_THE_ACCOUNT))
  }
  next()
}
