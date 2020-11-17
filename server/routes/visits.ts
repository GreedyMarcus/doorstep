import express from 'express'
import container from '../config/inversify.config'
import VisitsController from '../controllers/VisitsController'
import checkValidNumberParams from '../middlewares/checkValidNumberParams'
import checkValidToken from '../middlewares/checkValidToken'
import hasAnyPermission from '../middlewares/hasAnyPermission'
import belongsToVisit from '../middlewares/belongsToVisit'
import ownsAccount from '../middlewares/ownsAccount'
import { UserPermissionType } from '../data/enums/UserPermissionType'

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

export default visitsRouter
