import React, { useState, FormEvent } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded'
import Typography from '@material-ui/core/Typography'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import RegisterAdminForm from './RegisterAdminForm'
import RegisterBuildingForm from './RegisterBuildingForm'
import RegisterReview from './RegisterReview'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'
import { Link as RouteLink, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { registerUser } from '../../store/user'
import { addNotification } from '../../store/action'

const Register: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail, resetEmail] = useInput('', true, REGEXP.EMAIL)
  const [password, bindPassword, resetPassword] = useInput('', true, REGEXP.PASSWORD)
  const [firstName, bindFirstName, resetFirstName] = useInput('', true)
  const [lastName, bindLastName, resetLastName] = useInput('', true)
  const [country, bindCountry, resetCountry] = useInput('', true)
  const [zipCode, bindZipCode, resetZipCode] = useInput('', true)
  const [city, bindCity, resetCity] = useInput('', true)
  const [streetAddress, bindStreetAddress, resetStreetAddress] = useInput('', true)
  const [activeStep, setActiveStep] = useState(0)

  const steps = ['auth.registerAdminDetails', 'auth.registerBuildingDetails', 'auth.registerReview']
  const isFormFinished = activeStep === steps.length - 1

  const clearInputs = () => {
    resetEmail()
    resetPassword()
    resetFirstName()
    resetLastName()
    resetCountry()
    resetZipCode()
    resetCity()
    resetStreetAddress()
  }

  const validateAdminData = (): boolean => {
    const isDataValid = [email, password, firstName, lastName].every(param => param.isValid)
    if (!isDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidAdminData') }))
      return false
    }
    return true
  }

  const validateBuildingData = (): boolean => {
    const isDataValid = [country, zipCode, city, streetAddress].every(param => param.isValid)
    if (!isDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidBuildingData') }))
      return false
    }
    return true
  }

  const handleNextClick = () => {
    let canStep = false

    if (activeStep === 0) canStep = validateAdminData()
    if (activeStep === 1) canStep = validateBuildingData()

    if (canStep) setActiveStep(activeStep + 1)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isFormFinished) {
      dispatch(
        registerUser({
          email: email.value,
          password: password.value,
          firstName: firstName.value,
          lastName: lastName.value,
          country: country.value,
          zipCode: zipCode.value,
          city: city.value,
          streetAddress: streetAddress.value
        })
      )
      clearInputs()
      history.push('/login')
    }
  }

  return (
    <Container className={classes.container} component="main" maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <BusinessRoundedIcon className={classes.icon} />
        <Typography className={classes.title} component="h1">
          {t('auth.registerTitle')}
        </Typography>

        <Stepper className={classes.stepper} activeStep={activeStep} alternativeLabel>
          {steps.map((label: string, index: number) => (
            <Step key={index}>
              <StepLabel>{t(label)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete="off">
          <RegisterAdminForm
            emailBinding={bindEmail}
            passwordBinding={bindPassword}
            firstNameBinding={bindFirstName}
            lastNameBinding={bindLastName}
            visible={activeStep === 0}
          />
          <RegisterBuildingForm
            countryBinding={bindCountry}
            zipCodeBinding={bindZipCode}
            cityBinding={bindCity}
            streetAddressBinding={bindStreetAddress}
            visible={activeStep === 1}
          />
          <RegisterReview
            email={email.value}
            firstName={firstName.value}
            lastName={lastName.value}
            country={country.value}
            zipCode={zipCode.value}
            city={city.value}
            streetAddress={streetAddress.value}
            visible={activeStep === 2}
          />
          <Grid className={classes.buttons} container justify="flex-end">
            <Button
              style={{ display: activeStep !== 0 ? 'block' : 'none' }}
              onClick={() => setActiveStep(activeStep - 1)}
              className={classes.button}
            >
              {t('general.back')}
            </Button>

            <Button
              style={{ display: !isFormFinished ? 'block' : 'none' }}
              variant="contained"
              color="primary"
              onClick={handleNextClick}
              className={classes.button}
            >
              {t('general.next')}
            </Button>

            <Button
              style={{ display: isFormFinished ? 'block' : 'none' }}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              {t('auth.registerSubmit')}
            </Button>
          </Grid>
        </form>
        <Grid container justify="center">
          <Link component={RouteLink} to="/login">
            {t('auth.loginRedirect')}
          </Link>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Register
