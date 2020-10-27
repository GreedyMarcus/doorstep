import express from 'express'
import authRouter from './auth'
import emailRouter from './email'

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/email', emailRouter)

export default rootRouter
