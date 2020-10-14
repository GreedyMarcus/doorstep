import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'

const Login: React.FC = () => {
  const classes = useStyles()

  const [email, bindEmail, resetEmail] = useInput('', true, REGEXP.EMAIL)
  const [password, bindPassword, resetPassword] = useInput('', true)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (!email.error && !password.error) {
      // TODO: Make API call later...
      console.log(`Email: ${email.value}`)
      console.log(`Password: ${password.value}`)

      resetEmail()
      resetPassword()
    }
  }

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <MeetingRoomRoundedIcon className={classes.icon} />
        <Typography className={classes.welcome} component="h1">
          Welcome to Doorstep
        </Typography>
        <Typography className={classes.welcomeHelper} component="h2">
          Sign in to continue
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...bindEmail}
                id="sign-in-email"
                label="Email Address"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...bindPassword}
                id="sign-in-password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.submit}
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Sign In
              </Button>
              <Grid container justify="center">
                <Link href="/register" variant="body2">
                  Register office building
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Login
