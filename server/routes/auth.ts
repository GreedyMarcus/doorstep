import express from 'express'
import AuthController from '../controllers/AuthController'

const authRouter = express.Router()
const authController = new AuthController()

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/register', authController.register)

export default authRouter
