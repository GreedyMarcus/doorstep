import express from 'express'
import container from '../config/inversify.config'
import AuthController from '../controllers/AuthController'
import checkValidToken from '../middlewares/checkValidToken'
import getClientLanguage from '../middlewares/getClientLanguage'
import validationMiddleware from '../middlewares/validationMiddleware'
import {
  UserLoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UserCredentialsUpdateSchema
} from '../data/validationSchemas/UserSchema'

const authRouter = express.Router()
const authController = container.resolve(AuthController)

/**
 * GET - Returns information about the currently authenticated user.
 */
authRouter.get('/whoami', checkValidToken, authController.whoami)

/**
 * POST - Authenticates user with the provided credentials.
 */
authRouter.post('/login', validationMiddleware(UserLoginSchema), authController.login)

/**
 * POST - Sends a link to the user via email in case of forgotten password.
 */
authRouter.post('/forgot-password', validationMiddleware(ForgotPasswordSchema), getClientLanguage, authController.forgotPassword)

/**
 * POST - Creates a new password for the specified user with the provided credentials.
 */
authRouter.post('/reset-password', validationMiddleware(ResetPasswordSchema), authController.resetPassword)

/**
 * PUT - Updates the credentials of the specified user
 */
authRouter.put('/user', checkValidToken, validationMiddleware(UserCredentialsUpdateSchema), authController.updateUserCredentials)

export default authRouter
