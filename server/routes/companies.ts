import express from 'express'
import container from '../config/inversify.config'
import CompaniesController from '../controllers/CompaniesController'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import validationMiddleware from '../middlewares/validationMiddleware'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { CompanyRegistrationSchema } from '../data/validationSchemas/CompanySchema'

const companiesRouter = express.Router()
const companiesController = container.resolve(CompaniesController)

companiesRouter.get('/', checkValidToken, hasPermission([UserPermissionType.CREATE_COMPANIES]), companiesController.getCompanies)
companiesRouter.post(
  '/',
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_COMPANIES, UserPermissionType.CREATE_COMPANY_ADMINS]),
  validationMiddleware(CompanyRegistrationSchema),
  companiesController.registerCompany
)

export default companiesRouter
