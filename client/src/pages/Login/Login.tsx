import React, { FormEvent } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import PasswordField from '../../components/shared/PasswordField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { Link as RouteLink, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { loginUser } from '../../store/user'
import { addNotification } from '../../store/action'

/**
 * The login page where users can be authenticated.
 */
const Login: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail] = useInput({ initialValue: '', required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ initialValue: '' })

  /**
   * Authenticates user with the validated credentials.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isLoginDataValid = [email, password].every(param => param.valid)
    if (!isLoginDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.login') }))
      return
    }

    dispatch(loginUser({ email: email.value, password: password.value }))
    history.push('/')
  }

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <MeetingRoomRoundedIcon className={classes.icon} />
        <Typography className={classes.welcome} component="h1">
          {t('page.login.welcome')}
        </Typography>
        <Typography className={classes.welcomeHelper} component="h2">
          {t('page.login.welcomeHelper')}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...bindEmail} label={t('common.email')} autoComplete="email" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <PasswordField {...bindPassword} label={t('common.password')} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} className={classes.forgotPasswordLink}>
              <Grid container justify="flex-end">
                <Link component={RouteLink} to="/forgot-password">
                  {t('page.forgotPassword.question')}
                </Link>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button className={classes.submit} type="submit" variant="contained" color="primary" size="large" fullWidth>
                {t('page.login.submit')}
              </Button>
              <Grid container justify="center">
                <Link component={RouteLink} to="/register">
                  {t('page.register.pageTitle')}
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
