import express from 'express'
import TYPES from '../config/types'
import container from '../config/inversify.config'
import AuthController from '../controllers/AuthController'
import validationMiddleware from '../middlewares/validationMiddleware'
import checkValidToken from '../middlewares/checkValidToken'
import { UserLoginSchema } from '../data/validation-schemas/UserSchema'
import { OfficeBuildingRegistrationSchema } from '../data/validation-schemas/OfficeBuildingSchema'

const authRouter = express.Router()
const authController = container.get<AuthController>(TYPES.Controller)

authRouter.post('/login', validationMiddleware(UserLoginSchema), authController.login)
authRouter.post('/register', validationMiddleware(OfficeBuildingRegistrationSchema), authController.register)
authRouter.get('/whoami', checkValidToken, authController.whoami)

export default authRouter
