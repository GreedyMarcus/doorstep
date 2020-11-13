import express from 'express'
import container from '../config/inversify.config'
import ConsentFormsController from '../controllers/ConsentFormsController'
import checkValidNumberParams from '../middlewares/checkValidNumberParams'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import validationMiddleware from '../middlewares/validationMiddleware'
import belongsToConsentForm from '../middlewares/belongsToConsentForm'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { ConsentFormType } from '../data/enums/ConsentFormType'
import { ConsentFormVersionCreateSchema } from '../data/validationSchemas/ConsentFormSchema'

const consentFormsRouter = express.Router()
const consentFormsController = container.resolve(ConsentFormsController)

/**
 * GET - Returns the global consent form specified by id.
 */
consentFormsRouter.get(
  '/global/:consentFormId',
  checkValidNumberParams(['consentFormId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  consentFormsController.getConsentFormById
)

/**
 * GET - Returns the local consent form specified by id.
 */
consentFormsRouter.get(
  '/local/:consentFormId',
  checkValidNumberParams(['consentFormId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_LOCAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.LOCAL),
  consentFormsController.getConsentFormById
)

/**
 * POST - Creates a new global consent form version.
 */
consentFormsRouter.post(
  '/global/:consentFormId/versions',
  checkValidNumberParams(['consentFormId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.createConsentFormVersion
)

/**
 * POST - Creates a new local consent form version.
 */
consentFormsRouter.post(
  '/local/:consentFormId/versions',
  checkValidNumberParams(['consentFormId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_LOCAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.LOCAL),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.createConsentFormVersion
)

/**
 * PUT - Updates the specified global consent form version's content.
 */
consentFormsRouter.patch(
  '/global/:consentFormId/versions/:versionId',
  checkValidNumberParams(['consentFormId', 'versionId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.updateConsentFormVersion
)

/**
 * PUT - Updates the specified local consent form version's content.
 */
consentFormsRouter.patch(
  '/local/:consentFormId/versions/:versionId',
  checkValidNumberParams(['consentFormId', 'versionId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_LOCAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.LOCAL),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.updateConsentFormVersion
)

/**
 * PUT - Actives the specified global consent form version.
 */
consentFormsRouter.put(
  '/global/:consentFormId/versions/:versionId/activation',
  checkValidNumberParams(['consentFormId', 'versionId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  consentFormsController.activateConsentFormVersion
)

/**
 * PUT - Actives the specified local consent form version.
 */
consentFormsRouter.put(
  '/local/:consentFormId/versions/:versionId/activation',
  checkValidNumberParams(['consentFormId', 'versionId']),
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_LOCAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.LOCAL),
  consentFormsController.activateConsentFormVersion
)

export default consentFormsRouter
