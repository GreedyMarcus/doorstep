import TYPES from '../config/types'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { UserRepositoryInterface } from '../repositories/user'

export default (permissions: UserPermissionType[]) => async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = container.get<UserRepositoryInterface>(TYPES.UserRepository)
  const userPermissions = await userRepository.getPermissionsForUser(res.locals.userId)

  if (!userPermissions || !permissions.every(perm => userPermissions.includes(perm))) {
    return next(Boom.forbidden())
  }
  next()
}
