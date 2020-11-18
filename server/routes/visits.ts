import express from 'express'
import container from '../config/inversify.config'
import VisitsController from '../controllers/VisitsController'
import checkValidNumberParams from '../middlewares/checkValidNumberParams'
import checkValidToken from '../middlewares/checkValidToken'
import hasAnyPermission from '../middlewares/hasAnyPermission'
import belongsToVisit from '../middlewares/belongsToVisit'
import ownsAccount from '../middlewares/ownsAccount'
import validationMiddleware from '../middlewares/validationMiddleware'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { GuestUpdateByUserSchema } from '../data/validationSchemas/VisitSchema'

const visitsRouter = express.Router()
const visitsController = container.resolve(VisitsController)

/**
 * GET - Returns the visit specified by id.
 */
visitsRouter.get(
  '/:visitId',
  checkValidNumberParams(['visitId']),
  checkValidToken,
  hasAnyPermission([UserPermissionType.READ_VISITS, UserPermissionType.CREATE_VISITS]),
  belongsToVisit,
  visitsController.getVisitById
)

/**
 * GET - Returns the upcoming visits belong to the specified guest user.
 */
visitsRouter.get(
  '/guest-invitations/:userId',
  checkValidNumberParams(['userId']),
  checkValidToken,
  ownsAccount,
  visitsController.getGuestInvitations
)

/**
 * GET - Returns the guest profile to be filled for the specified invitation.
 */
visitsRouter.get(
  '/guest-invitations/:userId/profiles/:visitId',
  checkValidNumberParams(['userId', 'visitId']),
  checkValidToken,
  ownsAccount,
  visitsController.getGuestInvitationProfile
)

/**
 * PUT - Updates the guest profile that belongs to the specified invitation.
 */
visitsRouter.put(
  '/guest-invitations/:userId/profiles/:visitId',
  checkValidNumberParams(['userId', 'visitId']),
  checkValidToken,
  ownsAccount,
  validationMiddleware(GuestUpdateByUserSchema),
  visitsController.updateGuestInvitationProfile
)

export default visitsRouter
