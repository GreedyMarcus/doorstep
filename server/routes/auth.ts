import express from 'express'
import AuthController from '../controllers/AuthController'
import validationMiddleware from '../middlewares/validationMiddleware'
import { OfficeBuildingRegistrationSchema } from '../data/validation-schemas/OfficeBuildingSchema'

const authRouter = express.Router()
const authController = new AuthController()

authRouter.post('/login', authController.login)

authRouter.post('/logout', authController.logout)

authRouter.post(
  '/register',
  validationMiddleware(OfficeBuildingRegistrationSchema),
  authController.register
)

export default authRouter
