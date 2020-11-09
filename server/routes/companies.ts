import express from 'express'
import container from '../config/inversify.config'
import CompaniesController from '../controllers/CompaniesController'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import validationMiddleware from '../middlewares/validationMiddleware'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { CompanyUpdateSchema } from '../data/validationSchemas/CompanySchema'

const companiesRouter = express.Router()
const companiesController = container.resolve(CompaniesController)

companiesRouter.put(
  '/:companyId',
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_COMPANIES, UserPermissionType.CREATE_COMPANY_ADMINS]),
  validationMiddleware(CompanyUpdateSchema),
  companiesController.updateCompany
)

companiesRouter.get(
  '/:companyId/visits',
  checkValidToken,
  hasPermission([UserPermissionType.READ_VISITS]),
  companiesController.getVisits
)

export default companiesRouter
