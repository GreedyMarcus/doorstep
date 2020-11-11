import TYPES from '../config/types'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { CompanyRepositoryInterface } from '../repositories/company'

/**
 * Custom middleware that verifies if the user has association with the specified company.
 * - Sends a 400 Bad Request error if the specified company does not exist.
 * - Sends a 403 Forbidden error if user has no association with the company.
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const companyRepository = container.get<CompanyRepositoryInterface>(TYPES.CompanyRepository)
  const company = await companyRepository.findCompanyById(Number(req.params.companyId))

  if (!company) {
    return next(Boom.badRequest('Company does not exist'))
  }

  // User is the admin of the building associated with company
  if (company.officeBuilding.admin.id === res.locals.userId) {
    next()
  }

  // User is an employee of the company
  if (company.employees.findIndex(user => user.id === res.locals.userId) !== -1) {
    next()
  }

  next(Boom.forbidden('User does not belong to the company'))
}
