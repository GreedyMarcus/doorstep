import TYPES from '../config/types'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { VisitRepositoryInterface } from '../repositories/visit'
import { UserRepositoryInterface } from '../repositories/user'
import { UserRoleType } from '../data/enums/UserRoleType'

/**
 * Custom middleware that verifies if the user has association with the specified visit.
 * - Sends a 404 Not Found error if the specified visit does not exist.
 * - Sends a 403 Forbidden error if user has no association with the visit.
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const visitRepository = container.get<VisitRepositoryInterface>(TYPES.VisitRepository)
  const userRepository = container.get<UserRepositoryInterface>(TYPES.UserRepository)

  const visit = await visitRepository.findVisitById(Number(req.params.visitId))
  if (!visit) {
    return next(Boom.notFound('Visit does not exist.'))
  }

  const user = await userRepository.findUserById(res.locals.userId)
  if (user.role.name === UserRoleType.RECEPTIONIST) {
    return next()
  }

  if (!user || user.company.id !== visit.company.id) {
    return next(Boom.forbidden('User does not belong to the visit.'))
  }
  next()
}
