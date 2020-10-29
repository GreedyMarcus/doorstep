import express from 'express'
import authRouter from './auth'
import companiesRouter from './companies'

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/companies', companiesRouter)

export default rootRouter
