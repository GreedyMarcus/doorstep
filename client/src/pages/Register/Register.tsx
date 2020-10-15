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
  const stepLabels = ['Admin details', 'Office building details', 'Review registration']

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (
      !email.error &&
      !password.error &&
      !firstName.error &&
      !lastName.error &&
      !country.error &&
      !zipCode.error &&
      !city.error &&
      !streetAddress.error
    ) {
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
          {stepLabels.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete="off">
          {activeStep === 0 && (
            <RegisterAdminForm
              emailBinding={bindEmail}
              passwordBinding={bindPassword}
              firstNameBinding={bindFirstName}
              lastNameBinding={bindLastName}
            />
          )}
          {activeStep === 1 && (
            <RegisterBuildingForm
              countryBinding={bindCountry}
              zipCodeBinding={bindZipCode}
              cityBinding={bindCity}
              streetAddressBinding={bindStreetAddress}
            />
          )}

          <Grid container justify="flex-end">
            {activeStep !== 0 && (
              <Button onClick={() => setActiveStep(activeStep - 1)} className={classes.button}>
                Back
              </Button>
            )}

            {activeStep === stepLabels.length - 1 ? (
              <Button type="submit" variant="contained" color="primary" className={classes.button}>
                Sign up
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveStep(activeStep + 1)}
                className={classes.button}
              >
                Next
              </Button>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Register
