import express from 'express'
import authRouter from './auth'
import companiesRouter from './companies'
import consentFormsRouter from './consentForms'

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/companies', companiesRouter)
rootRouter.use('/consent-forms', consentFormsRouter)

export default rootRouter
