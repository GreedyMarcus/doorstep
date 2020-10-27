import React, { FormEvent } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import LockRoundedIcon from '@material-ui/icons/LockRounded'
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
import { sendForgotPassword } from '../../store/user'
import { addNotification } from '../../store/action'

const ForgotPassword: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail, resetEmail] = useInput('', true, REGEXP.EMAIL)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.isValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidEmailFormat') }))
      return
    }

    dispatch(sendForgotPassword(email.value))
    resetEmail()
    history.push('/login')
  }

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <LockRoundedIcon className={classes.icon} />
        <Typography className={classes.title} component="h1">
          {t('auth.forgotPasswordTitle')}
        </Typography>
        <Typography className={classes.helper} component="h2">
          {t('auth.forgotPasswordHelper')}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...bindEmail} id="forgot-password-email" label={t('auth.email')} autoComplete="email" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Button className={classes.submit} type="submit" variant="contained" color="primary" size="large" fullWidth>
                {t('auth.forgotPasswordSubmit')}
              </Button>
              <Grid container justify="center">
                <Link component={RouteLink} to="/login">
                  {t('auth.loginRedirect')}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default ForgotPassword
