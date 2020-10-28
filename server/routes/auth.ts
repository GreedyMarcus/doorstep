import express from 'express'
import container from '../config/inversify.config'
import AuthController from '../controllers/AuthController'
import validationMiddleware from '../middlewares/validationMiddleware'
import checkValidToken from '../middlewares/checkValidToken'
import { UserLoginSchema, ForgotPasswordSchema } from '../data/validation-schemas/UserSchema'
import { OfficeBuildingRegistrationSchema } from '../data/validation-schemas/OfficeBuildingSchema'

const authRouter = express.Router()
const authController = container.resolve(AuthController)

authRouter.post('/login', validationMiddleware(UserLoginSchema), authController.login)
authRouter.post('/register', validationMiddleware(OfficeBuildingRegistrationSchema), authController.register)
authRouter.get('/whoami', checkValidToken, authController.whoami)
authRouter.post('/forgot-password', validationMiddleware(ForgotPasswordSchema), authController.forgotPassword)

export default authRouter
