import express from 'express'
import container from '../config/inversify.config'
import ConsentFormsController from '../controllers/ConsentFormsController'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import { UserPermissionType } from '../data/enums/UserPermissionType'

const consentFormsRouter = express.Router()
const consentFormsController = container.resolve(ConsentFormsController)

consentFormsRouter.get(
  '/global',
  checkValidToken,
  hasPermission([UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS]),
  consentFormsController.getGlobalConsentForms
)

export default consentFormsRouter
