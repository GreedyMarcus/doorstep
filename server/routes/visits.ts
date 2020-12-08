import express from 'express'
import container from '../config/inversify.config'
import VisitsController from '../controllers/VisitsController'
import checkValidNumberParams from '../middlewares/checkValidNumberParams'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
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
 * GET - Returns the guest that belongs to the specified visit.
 */
visitsRouter.get(
  '/:visitId/guests/:guestId',
  checkValidNumberParams(['visitId', 'guestId']),
  checkValidToken,
  hasPermission([UserPermissionType.READ_VISITS]),
  belongsToVisit,
  visitsController.getVisitGuestById
)

/**
 * PUT - Updates the guest that belongs to the specified visit by receptionist.
 */
visitsRouter.put(
  '/:visitId/guests/:guestId',
  checkValidNumberParams(['visitId', 'guestId']),
  checkValidToken,
  hasPermission([UserPermissionType.EDIT_VISITS]),
  belongsToVisit,
  validationMiddleware(GuestUpdateByUserSchema),
  visitsController.updateGuestByReceptionist
)

/**
 * POST - Tracks guest exit time.
 */
visitsRouter.post(
  '/:visitId/guests/:guestId/exit',
  checkValidNumberParams(['visitId', 'guestId']),
  checkValidToken,
  hasPermission([UserPermissionType.EDIT_VISITS]),
  belongsToVisit,
  visitsController.trackGuestExitTime
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
