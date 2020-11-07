import express from 'express'
import container from '../config/inversify.config'
import OfficeBuildingsController from '../controllers/OfficeBuildingsController'
import validationMiddleware from '../middlewares/validationMiddleware'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import { UserPermissionType } from '../data/enums/UserPermissionType'
import { OfficeBuildingRegisterSchema } from '../data/validationSchemas/OfficeBuildingSchema'
import { CompanyRegisterSchema } from '../data/validationSchemas/CompanySchema'

const officeBuildingsRouter = express.Router()
const officeBuildingsController = container.resolve(OfficeBuildingsController)

officeBuildingsRouter.post(
  '/register',
  validationMiddleware(OfficeBuildingRegisterSchema),
  officeBuildingsController.registerOfficeBuilding
)

officeBuildingsRouter.get('/:buildingId/companies', checkValidToken, officeBuildingsController.getCompaniesInOfficeBuilding)

officeBuildingsRouter.post(
  '/:buildingId/companies',
  checkValidToken,
  hasPermission([UserPermissionType.CREATE_COMPANIES, UserPermissionType.CREATE_COMPANY_ADMINS]),
  validationMiddleware(CompanyRegisterSchema),
  officeBuildingsController.registerCompanyInOfficeBuilding
)

export default officeBuildingsRouter
