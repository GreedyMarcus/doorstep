import express from 'express'
import container from '../config/inversify.config'
import CompaniesController from '../controllers/CompaniesController'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import validationMiddleware from '../middlewares/validationMiddleware'
import belongsToCompany from '../middlewares/belongsToCompany'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { CompanyUpdateSchema } from '../data/validationSchemas/CompanySchema'

const companiesRouter = express.Router()
const companiesController = container.resolve(CompaniesController)

/**
 * PUT - Updates the specified company.
 */
companiesRouter.put(
  '/:companyId',
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_COMPANIES, UserPermissionType.CREATE_COMPANY_ADMINS]),
  belongsToCompany,
  validationMiddleware(CompanyUpdateSchema),
  companiesController.updateCompany
)

/**
 * GET - Returns all the visits belong to the company.
 */
companiesRouter.get(
  '/:companyId/visits',
  checkValidToken,
  hasPermission([UserPermissionType.READ_VISITS]),
  belongsToCompany,
  companiesController.getVisits
)

/**
 * GET - Returns all the business hosts employed by the company.
 */
companiesRouter.get(
  '/:companyId/business-hosts',
  checkValidToken,
  hasPermission([UserPermissionType.READ_VISITS]),
  belongsToCompany,
  companiesController.getBusinessHosts
)

export default companiesRouter
