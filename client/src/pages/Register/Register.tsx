import React, { useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded'
import Typography from '@material-ui/core/Typography'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import RegisterAdminForm from './RegisterAdminForm'
import RegisterBuildingForm from './RegisterBuildingForm'
import RegisterReview from './RegisterReview'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'

const Register: React.FC = () => {
  const classes = useStyles()

  const [email, bindEmail, resetEmail] = useInput('', true, REGEXP.EMAIL)
  const [password, bindPassword, resetPassword] = useInput('', true, REGEXP.PASSWORD)
  const [firstName, bindFirstName, resetFirstName] = useInput('', true)
  const [lastName, bindLastName, resetLastName] = useInput('', true)
  const [country, bindCountry, resetCountry] = useInput('', true)
  const [zipCode, bindZipCode, resetZipCode] = useInput('', true)
  const [city, bindCity, resetCity] = useInput('', true)
  const [streetAddress, bindStreetAddress, resetStreetAddress] = useInput('', true)

  const [activeStep, setActiveStep] = useState(0)
  const steps = ['Admin details', 'Office building details', 'Review registration']

  const isRegisterDataValid = (): boolean => {
    return (
      !!email.value &&
      !email.error &&
      !!password.value &&
      !password.error &&
      !!firstName.value &&
      !firstName.error &&
      !!lastName.value &&
      !lastName.error &&
      !!country.value &&
      !country.error &&
      !!zipCode.value &&
      !zipCode.error &&
      !!city.value &&
      !city.error &&
      !!streetAddress.value &&
      !streetAddress.error
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (isRegisterDataValid() && activeStep === steps.length - 1) {
      // TODO: Make API call later...
      console.log('Registered')
      resetEmail()
      resetPassword()
      resetFirstName()
      resetLastName()
      resetCountry()
      resetZipCode()
      resetCity()
      resetStreetAddress()
    }
  }

  return (
    <Container className={classes.container} component="main" maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <MeetingRoomRoundedIcon className={classes.icon} />
        <Typography className={classes.title} component="h1">
          Register office building
        </Typography>

        <Stepper className={classes.stepper} activeStep={activeStep} alternativeLabel>
          {steps.map((label: string, index: number) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete="off">
          <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
            <RegisterAdminForm
              emailBinding={bindEmail}
              passwordBinding={bindPassword}
              firstNameBinding={bindFirstName}
              lastNameBinding={bindLastName}
            />
          </div>
          <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
            <RegisterBuildingForm
              countryBinding={bindCountry}
              zipCodeBinding={bindZipCode}
              cityBinding={bindCity}
              streetAddressBinding={bindStreetAddress}
            />
          </div>
          <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
            <RegisterReview
              email={email.value}
              firstName={firstName.value}
              lastName={lastName.value}
              country={country.value}
              zipCode={zipCode.value}
              city={city.value}
              streetAddress={streetAddress.value}
            />
          </div>
          <Grid container justify="flex-end">
            <Button
              style={{ display: activeStep !== 0 ? 'block' : 'none' }}
              onClick={() => setActiveStep(activeStep - 1)}
              className={classes.button}
            >
              Back
            </Button>

            <Button
              style={{ display: activeStep !== steps.length - 1 ? 'block' : 'none' }}
              variant="contained"
              color="primary"
              onClick={() => setActiveStep(activeStep + 1)}
              className={classes.button}
            >
              Next
            </Button>

            <Button
              style={{ display: activeStep === steps.length - 1 ? 'block' : 'none' }}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Sign up
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Register
