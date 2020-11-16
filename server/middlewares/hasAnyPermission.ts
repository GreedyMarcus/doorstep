import TYPES from '../config/types'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { UserRepositoryInterface } from '../repositories/user'

/**
 * Custom middleware that verifies if the authorized user has any of the required permissions,
 * that is specified in the parameters.
 * - Sends a 403 Forbidden error if all of the permissions are missing.
 */
export default (permissions: UserPermissionType[]) => async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = container.get<UserRepositoryInterface>(TYPES.UserRepository)
  const userPermissions = await userRepository.getPermissionsForUser(res.locals.userId)

  if (!userPermissions || !permissions.some(permission => userPermissions.includes(permission))) {
    return next(Boom.forbidden('User does not have any of the required permissions for this operation'))
  }
  next()
}
