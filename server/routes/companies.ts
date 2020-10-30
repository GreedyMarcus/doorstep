import express from 'express'
import container from '../config/inversify.config'
import CompaniesController from '../controllers/CompaniesController'
import checkValidToken from '../middlewares/checkValidToken'
import hasPermission from '../middlewares/hasPermission'
import { UserPermissionType } from '../data/enums/UserPermissionType'

const companiesRouter = express.Router()
const companiesController = container.resolve(CompaniesController)

companiesRouter.get('/', checkValidToken, hasPermission([UserPermissionType.CREATE_COMPANIES]), companiesController.getCompanies)

export default companiesRouter
