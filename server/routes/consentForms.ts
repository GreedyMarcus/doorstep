import express from 'express'
import container from '../config/inversify.config'
import ConsentFormsController from '../controllers/ConsentFormsController'
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
 * GET - Returns a global consent form specified by id.
 */
consentFormsRouter.get(
  '/global/:consentFormId',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  consentFormsController.getConsentFormById
)

/**
 * POST - Creates a new global consent form version for the office building
 */
consentFormsRouter.post(
  '/global/:consentFormId/versions',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.createConsentFormVersion
)

/**
 * PUT - Updates the specified global consent form version's content.
 */
consentFormsRouter.patch(
  '/global/:consentFormId/versions/:versionId',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.updateConsentFormVersion
)

/**
 * PUT - Actives the specified global consent form version.
 */
consentFormsRouter.put(
  '/global/:consentFormId/versions/:versionId/activation',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  belongsToConsentForm(ConsentFormType.GLOBAL),
  consentFormsController.activateConsentFormVersion
)

export default consentFormsRouter
