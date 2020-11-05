import express from 'express'
import container from '../config/inversify.config'
import ConsentFormsController from '../controllers/ConsentFormsController'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import validationMiddleware from '../middlewares/validationMiddleware'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { ConsentFormCreateSchema, ConsentFormVersionCreateSchema } from '../data/validationSchemas/ConsentFormSchema'

const consentFormsRouter = express.Router()
const consentFormsController = container.resolve(ConsentFormsController)

consentFormsRouter.get(
  '/global',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  consentFormsController.getGlobalConsentForms
)

consentFormsRouter.post(
  '/global',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  validationMiddleware(ConsentFormCreateSchema),
  consentFormsController.createGlobalConsentForm
)

consentFormsRouter.get(
  '/global/:consentFormId',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  consentFormsController.getGlobalConsentFormById
)

consentFormsRouter.post(
  '/global/:consentFormId/versions',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.createGlobalConsentFormVersion
)

consentFormsRouter.patch(
  '/global/:consentFormId/versions/:versionId',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  validationMiddleware(ConsentFormVersionCreateSchema),
  consentFormsController.updateGlobalConsentFormVersion
)

consentFormsRouter.put(
  '/global/:consentFormId/versions/:versionId/activation',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  consentFormsController.activateGlobalConsentFormVersion
)

export default consentFormsRouter
