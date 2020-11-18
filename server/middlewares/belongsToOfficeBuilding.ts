import TYPES from '../config/types'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { OfficeBuildingRepositoryInterface } from '../repositories/officeBuilding'

/**
 * Custom middleware that verifies if the user is working in the specified office building.
 * - Sends a 404 Not Found error if the specified office building does not exist.
 * - Sends a 403 Forbidden error if user does not belong to the office building.
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const buildingRepository = container.get<OfficeBuildingRepositoryInterface>(TYPES.OfficeBuildingRepository)
  const building = await buildingRepository.findBuildingById(Number(req.params.buildingId))

  if (!building) {
    return next(Boom.notFound('Office building does not exist.'))
  }

  if (building.admin.id === res.locals.userId) {
    return next()
  }

  if (building.employees.findIndex(user => user.id === res.locals.userId) !== -1) {
    return next()
  }

  next(Boom.forbidden('User does not belong to the office building.'))
}
