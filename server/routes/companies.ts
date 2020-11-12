import express from 'express'
import container from '../config/inversify.config'
import CompaniesController from '../controllers/CompaniesController'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import validationMiddleware from '../middlewares/validationMiddleware'
import belongsToCompany from '../middlewares/belongsToCompany'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { CompanyUpdateSchema, CompanyConfigSchema } from '../data/validationSchemas/CompanySchema'
import { UserRegisterSchema, UserUpdateSchema } from '../data/validationSchemas/UserSchema'
import { ConsentFormCreateSchema } from '../data/validationSchemas/ConsentFormSchema'

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
  hasPermission([UserPermissionType.CREATE_BUSINESS_HOSTS]),
  belongsToCompany,
  companiesController.getBusinessHosts
)

/**
 * POST - Creates a new business host for the company.
 */
companiesRouter.post(
  '/:companyId/business-hosts',
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_BUSINESS_HOSTS]),
  belongsToCompany,
  validationMiddleware(UserRegisterSchema),
  companiesController.createBusinessHost
)

/**
 * PUT - Updates the specified business host.
 */
companiesRouter.put(
  '/:companyId/business-hosts/:businessHostId',
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_BUSINESS_HOSTS]),
  belongsToCompany,
  validationMiddleware(UserUpdateSchema),
  companiesController.updateBusinessHost
)

/**
 * GET - Returns all the visits belong to the company.
 */
companiesRouter.get(
  '/:companyId/consent-forms',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_LOCAL_CONSENT_FORMS]),
  belongsToCompany,
  companiesController.getConsentForms
)

/**
 * POST - Creates a new consent form for the company.
 */
companiesRouter.post(
  '/:companyId/consent-forms',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_LOCAL_CONSENT_FORMS]),
  belongsToCompany,
  validationMiddleware(ConsentFormCreateSchema),
  companiesController.createConsentForm
)

/**
 * GET - Returns the register config information that belongs to the company.
 */
companiesRouter.get(
  '/:companyId/config',
  checkValidToken,
  hasPermission([UserPermissionType.EDIT_COMPANY_REGISTER_CONFIG]),
  belongsToCompany,
  companiesController.getCompanyConfig
)

/**
 * PUT - Updates the register config information that belongs to the company.
 */
companiesRouter.put(
  '/:companyId/config',
  checkValidToken,
  hasPermission([UserPermissionType.EDIT_COMPANY_REGISTER_CONFIG]),
  belongsToCompany,
  validationMiddleware(CompanyConfigSchema),
  companiesController.updateCompanyConfig
)

export default companiesRouter
