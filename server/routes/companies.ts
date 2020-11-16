import express from 'express'
import container from '../config/inversify.config'
import CompaniesController from '../controllers/CompaniesController'
import checkValidNumberParams from '../middlewares/checkValidNumberParams'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import validationMiddleware from '../middlewares/validationMiddleware'
import belongsToCompany from '../middlewares/belongsToCompany'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { CompanyUpdateSchema, CompanyConfigSchema } from '../data/validationSchemas/CompanySchema'
import { UserRegisterSchema, UserUpdateSchema } from '../data/validationSchemas/UserSchema'
import { ConsentFormCreateSchema } from '../data/validationSchemas/ConsentFormSchema'
import { VisitCreateSchema } from '../data/validationSchemas/VisitSchema'

const companiesRouter = express.Router()
const companiesController = container.resolve(CompaniesController)

/**
 * PUT - Updates the specified company.
 */
companiesRouter.put(
  '/:companyId',
  checkValidNumberParams(['companyId']),
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_COMPANIES, UserPermissionType.CREATE_COMPANY_ADMINS]),
  belongsToCompany,
  validationMiddleware(CompanyUpdateSchema),
  companiesController.updateCompany
)

/**
 * GET - Returns all the finished visits belong to the company.
 */
companiesRouter.get(
  '/:companyId/visits',
  checkValidNumberParams(['companyId']),
  checkValidToken,
  hasPermission([UserPermissionType.READ_VISITS]),
  belongsToCompany,
  companiesController.getVisits
)

/**
 * POST - Creates a new visit for the company.
 */
companiesRouter.post(
  '/:companyId/visits',
  checkValidNumberParams(['companyId']),
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_VISITS]),
  belongsToCompany,
  validationMiddleware(VisitCreateSchema),
  companiesController.createVisit
)

/**
 * GET - Returns all the business hosts employed by the company.
 */
companiesRouter.get(
  '/:companyId/business-hosts',
  checkValidNumberParams(['companyId']),
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
  checkValidNumberParams(['companyId']),
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
  checkValidNumberParams(['companyId', 'businessHostId']),
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_BUSINESS_HOSTS]),
  belongsToCompany,
  validationMiddleware(UserUpdateSchema),
  companiesController.updateBusinessHost
)

/**
 * GET - Returns all the planned visits belongs to the business host employed by the company.
 */
companiesRouter.get(
  '/:companyId/business-hosts/:businessHostId/planned-visits',
  checkValidNumberParams(['companyId', 'businessHostId']),
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_VISITS]),
  belongsToCompany,
  companiesController.getPlannedVisits
)

/**
 * GET - Returns all the visits belong to the company.
 */
companiesRouter.get(
  '/:companyId/consent-forms',
  checkValidNumberParams(['companyId']),
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
  checkValidNumberParams(['companyId']),
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
  checkValidNumberParams(['companyId']),
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
  checkValidNumberParams(['companyId']),
  checkValidToken,
  hasPermission([UserPermissionType.EDIT_COMPANY_REGISTER_CONFIG]),
  belongsToCompany,
  validationMiddleware(CompanyConfigSchema),
  companiesController.updateCompanyConfig
)

/**
 * GET - Returns all available guest user data for visit planning.
 */
companiesRouter.get(
  '/:companyId/available-guest-users',
  checkValidNumberParams(['companyId']),
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_VISITS]),
  belongsToCompany,
  companiesController.getAvailableGuestUsers
)

export default companiesRouter
