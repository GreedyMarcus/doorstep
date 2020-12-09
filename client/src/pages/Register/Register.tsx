import React from 'react'
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
import useRegister from './useRegister'
import { Link as RouteLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * The Register page where office buildings with admin accounts can be registered.
 */
const Register: React.FC = () => {
  const classes = useStyles()
  const [t] = useTranslation()
  const [
    activeStep,
    reviewData,
    handleAdminNextClick,
    handleBuildingAddressNextClick,
    handleBackClick,
    handleRegister
  ] = useRegister()

  const steps = ['page.register.adminDetails', 'page.register.buildingDetails', 'page.register.review']

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
            onRegisterClick={handleRegister}
            onBackClick={handleBackClick}
          />
        </>

        <Grid container justify="center">
          <Link component={RouteLink} to="/login">
            {t('page.register.loginRedirect')}
          </Link>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Register
