import TYPES from '../config/types'
import ERROR from '../utils/error'
import Boom from '@hapi/boom'
import container from '../config/inversify.config'
import { Request, Response, NextFunction } from 'express'
import { CompanyRepositoryInterface } from '../repositories/company'

/**
 * Custom middleware that verifies if the user has association with the specified company.
 * - Sends a 404 Not Found error if the specified company does not exist.
 * - Sends a 403 Forbidden error if user has no association with the company.
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const companyRepository = container.get<CompanyRepositoryInterface>(TYPES.CompanyRepository)
  const company = await companyRepository.findCompanyById(Number(req.params.companyId))

  if (!company) {
    return next(Boom.notFound(ERROR.COMPANY_DOES_NOT_EXIST))
  }

  // User is the admin of the building associated with company
  if (company.officeBuilding.admin.id === res.locals.userId) {
    return next()
  }

  // User is an employee of the company
  if (company.employees.findIndex(user => user.id === res.locals.userId) !== -1) {
    return next()
  }

  next(Boom.forbidden(ERROR.USER_DOES_NOT_BELONG_TO_THE_COMPANY))
}
