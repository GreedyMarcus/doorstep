import express from 'express'
import authRouter from './auth'
import officeBuildingsRouter from './officeBuildings'
import companiesRouter from './companies'
import consentFormsRouter from './consentForms'
import visitsRouter from './visits'

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/buildings', officeBuildingsRouter)
rootRouter.use('/companies', companiesRouter)
rootRouter.use('/consent-forms', consentFormsRouter)
rootRouter.use('/visits', visitsRouter)

export default rootRouter
