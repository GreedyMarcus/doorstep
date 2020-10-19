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
import { Link as RouteLink, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { loginUser } from '../../store/user'

const Login: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail, resetEmail] = useInput('', true, REGEXP.EMAIL)
  const [password, bindPassword, resetPassword] = useInput('', true)

  const clearInputs = () => {
    resetEmail()
    resetPassword()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const isLoginDataValid = [email, password].every(param => param.isValid)
    if (isLoginDataValid) {
      dispatch(loginUser(email.value, password.value))
      clearInputs()
      history.push('/')
    }
  }

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <MeetingRoomRoundedIcon className={classes.icon} />
        <Typography className={classes.welcome} component="h1">
          {t('auth.loginWelcome')}
        </Typography>
        <Typography className={classes.welcomeHelper} component="h2">
          {t('auth.loginWelcomeHelper')}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...bindEmail}
                id="login-email"
                label={t('auth.email')}
                autoComplete="email"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...bindPassword}
                id="login-password"
                label={t('auth.password')}
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
                {t('auth.loginSubmit')}
              </Button>
              <Grid container justify="center">
                <Link component={RouteLink} to="/register">
                  {t('auth.registerTitle')}
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
