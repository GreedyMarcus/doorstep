import express from 'express'
import container from '../config/inversify.config'
import OfficeBuildingsController from '../controllers/OfficeBuildingsController'
import validationMiddleware from '../middlewares/validationMiddleware'
import checkValidNumberParams from '../middlewares/checkValidNumberParams'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import belongsToOfficeBuilding from '../middlewares/belongsToOfficeBuilding'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { OfficeBuildingRegisterSchema } from '../data/validationSchemas/OfficeBuildingSchema'
import { CompanyRegisterSchema } from '../data/validationSchemas/CompanySchema'
import { ConsentFormCreateSchema } from '../data/validationSchemas/ConsentFormSchema'

const officeBuildingsRouter = express.Router()
const officeBuildingsController = container.resolve(OfficeBuildingsController)

/**
 * POST - Creates a new office building.
 */
officeBuildingsRouter.post(
  '/',
  validationMiddleware(OfficeBuildingRegisterSchema),
  officeBuildingsController.registerOfficeBuilding
)

/**
 * GET - Returns all the companies belong to the office building.
 */
officeBuildingsRouter.get(
  '/:buildingId/companies',
  checkValidNumberParams(['buildingId']),
  checkValidToken,
  belongsToOfficeBuilding,
  officeBuildingsController.getCompanies
)

/**
 * POST - Creates a new company in the office building.
 */
officeBuildingsRouter.post(
  '/:buildingId/companies',
  checkValidNumberParams(['buildingId']),
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_COMPANIES, UserPermissionType.CREATE_COMPANY_ADMINS]),
  belongsToOfficeBuilding,
  validationMiddleware(CompanyRegisterSchema),
  officeBuildingsController.registerCompany
)

/**
 * GET - Returns all the consent forms belong to the office building.
 */
officeBuildingsRouter.get(
  '/:buildingId/consent-forms',
  checkValidNumberParams(['buildingId']),
  checkValidToken,
  belongsToOfficeBuilding,
  officeBuildingsController.getConsentForms
)

/**
 * POST - Creates a new global consent form in the office building.
 */
officeBuildingsRouter.post(
  '/:buildingId/consent-forms',
  checkValidNumberParams(['buildingId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToOfficeBuilding,
  validationMiddleware(ConsentFormCreateSchema),
  officeBuildingsController.createConsentForm
)

export default officeBuildingsRouter