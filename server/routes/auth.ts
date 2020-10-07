import express from 'express'
import TYPES from '../config/types'
import container from '../config/inversify.config'
import AuthController from '../controllers/AuthController'
import validationMiddleware from '../middlewares/validationMiddleware'
import { UserLoginSchema } from '../data/validation-schemas/UserSchema'
import { OfficeBuildingRegistrationSchema } from '../data/validation-schemas/OfficeBuildingSchema'

const authRouter = express.Router()
const authController = container.get<AuthController>(TYPES.Controller)

authRouter.post('/login', validationMiddleware(UserLoginSchema), authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post(
  '/register',
  validationMiddleware(OfficeBuildingRegistrationSchema),
  authController.register
)

export default authRouter
