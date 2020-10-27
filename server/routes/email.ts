import express from 'express'
import container from '../config/inversify.config'
import EmailController from '../controllers/EmailController'
import checkValidToken from '../middlewares/checkValidToken'

const emailRouter = express.Router()
const emailController = container.resolve(EmailController)

emailRouter.get('/test', checkValidToken, emailController.test)

export default emailRouter
