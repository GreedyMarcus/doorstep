import React, { useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded'
import Typography from '@material-ui/core/Typography'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import RegisterAdmin from './RegisterAdmin'
import RegisterBuilding from './RegisterBuilding'
import RegisterReview from './RegisterReview'
import useStyles from './useStyles'
import { Link as RouteLink, useHistory } from 'react-router-dom'
import { UserRegister } from '../../data/types/User'
import { Address } from '../../data/types/Address'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { registerAccount } from '../../store/user'

/**
 * Register page where office buildings with admin accounts can be registered.
 */
const Register: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [adminData, setAdminData] = useState({} as UserRegister)
  const [buildingAddressData, setBuildingAddressData] = useState({} as Address)
  const [activeStep, setActiveStep] = useState(0)

  const steps = ['page.register.adminDetails', 'page.register.buildingDetails', 'page.register.review']

  const isFormFinished = activeStep === steps.length - 1
  const reviewData = { admin: adminData, address: buildingAddressData }

  /**
   * Registers account with the already validated data.
   */
  const handleSubmit = async () => {
    if (isFormFinished) {
      await dispatch(registerAccount(reviewData))
      history.push('/login')
    }
  }

  /**
   * Handles the finished action of the admin form sub-component.
   */
  const handleAdminNextClick = (adminData: UserRegister) => {
    setAdminData(adminData)
    setActiveStep(activeStep + 1)
  }

  /**
   * Handles the finished action of the building form sub-component.
   */
  const handleBuildingAddressNextClick = (buildingAddressData: Address) => {
    setBuildingAddressData(buildingAddressData)
    setActiveStep(activeStep + 1)
  }

  /**
   * Steps back to the previous sub-component.
   */
  const handleBackClick = () => setActiveStep(activeStep - 1)

  return (
    <Container className={classes.container} component="main" maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <BusinessRoundedIcon className={classes.icon} />
        <Typography className={classes.title} component="h1">
          {t('page.register.pageTitle')}
        </Typography>

        <Stepper className={classes.stepper} activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{t(step)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <>
          <RegisterAdmin visible={activeStep === 0} onNextClick={handleAdminNextClick} />
          <RegisterBuilding
            visible={activeStep === 1}
            onNextClick={handleBuildingAddressNextClick}
            onBackClick={handleBackClick}
          />
          <RegisterReview
            visible={activeStep === 2}
            reviewData={reviewData}
            onRegisterClick={handleSubmit}
            onBackClick={handleBackClick}
          />
        </>

        <Grid container justify="center">
          <Link component={RouteLink} to="/login">
            {t('page.login.redirect')}
          </Link>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Register
