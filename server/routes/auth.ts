import express from 'express'
import container from '../config/inversify.config'
import AuthController from '../controllers/AuthController'
import validationMiddleware from '../middlewares/validationMiddleware'
import checkValidToken from '../middlewares/checkValidToken'
import getClientLanguage from '../middlewares/getClientLanguage'
import { UserLoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../data/validationSchemas/UserSchema'

const authRouter = express.Router()
const authController = container.resolve(AuthController)

authRouter.post('/login', validationMiddleware(UserLoginSchema), authController.login)
authRouter.get('/whoami', checkValidToken, authController.whoami)
authRouter.post('/forgot-password', validationMiddleware(ForgotPasswordSchema), getClientLanguage, authController.forgotPassword)
authRouter.post('/reset-password', validationMiddleware(ResetPasswordSchema), authController.resetPassword)

export default authRouter
