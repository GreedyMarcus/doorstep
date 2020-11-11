import TYPES from '../config/types'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { UserRepositoryInterface } from '../repositories/user'

/**
 * Custom middleware that verifies if the authorized user has a set of permissions,
 * that is specified in the parameters.
 * - Sends a 403 Forbidden error if permission missing.
 */
export default (permissions: UserPermissionType[]) => async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = container.get<UserRepositoryInterface>(TYPES.UserRepository)
  const userPermissions = await userRepository.getPermissionsForUser(res.locals.userId)

  if (!userPermissions || !permissions.every(permission => userPermissions.includes(permission))) {
    return next(Boom.forbidden('User does not have the required permissions for this operation'))
  }
  next()
}
